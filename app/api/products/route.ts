import { NextRequest } from 'next/server'

// Generate 500 product data
function generateProducts() {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive'];
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Canon', 'Dell', 'HP', 'Asus'];
  const statuses = ['In Stock', 'Out of Stock', 'Limited Stock'];
  
  const products = [];
  
  for (let i = 1; i <= 500; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    products.push({
      id: i,
      productName: `${brand} Product ${i}`,
      categoryName: category,
      brandName: brand,
      unitPrice: Math.floor(Math.random() * 1000) + 10,
      stockQuantity: Math.floor(Math.random() * 100),
      stockStatus: status,
      customerRating: (Math.random() * 5).toFixed(1),
      productDescription: `High quality ${category.toLowerCase()} product from ${brand}`,
      productSku: `SKU-${String(i).padStart(6, '0')}`,
      createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }
  
  return products;
}

const allProducts = generateProducts();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const draw = parseInt(searchParams.get('draw') || '1');
    const start = parseInt(searchParams.get('start') || '0');
    const length = parseInt(searchParams.get('length') || '10');
    const rawSearchValue = searchParams.get('search[value]') || '';
    let searchValue = rawSearchValue;
    
    // Handle multiple encoding scenarios
    try {
      searchValue = decodeURIComponent(rawSearchValue);
    } catch (e) {
      searchValue = rawSearchValue;
    }
    
    // Replace + with space (URL encoding)
    searchValue = searchValue.replace(/\+/g, ' ');
    
    console.log('🔍 Search Debug:', {
      raw: rawSearchValue,
      decoded: searchValue,
      length: searchValue.length,
      hasSpace: searchValue.includes(' ')
    });
    
    const orderColumn = parseInt(searchParams.get('order[0][column]') || '0');
    const orderDir = searchParams.get('order[0][dir]') || 'asc';
    
    const categoryFilter = searchParams.get('category') || '';
    const statusFilter = searchParams.get('status') || '';
    const priceMin = parseFloat(searchParams.get('priceMin') || '0');
    const priceMax = parseFloat(searchParams.get('priceMax') || '999999');
    
    let filteredProducts = [...allProducts];
    
    if (searchValue) {
      filteredProducts = filteredProducts.filter(product =>
        product.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.brandName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(product => 
        product.categoryName === categoryFilter
      );
    }
    
    if (statusFilter) {
      filteredProducts = filteredProducts.filter(product => 
        product.stockStatus === statusFilter
      );
    }
    
    filteredProducts = filteredProducts.filter(product => 
      product.unitPrice >= priceMin && product.unitPrice <= priceMax
    );
    
    const columns = ['id', 'productName', 'categoryName', 'brandName', 'unitPrice', 'stockQuantity', 'stockStatus', 'customerRating'];
    const sortColumn = columns[orderColumn] || 'id';
    
    filteredProducts.sort((a, b) => {
      let aVal = a[sortColumn as keyof typeof a];
      let bVal = b[sortColumn as keyof typeof b];
      
      if (typeof aVal === 'string' && !isNaN(Number(aVal))) {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      
      if (aVal < bVal) return orderDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return orderDir === 'asc' ? 1 : -1;
      return 0;
    });
    
    const paginatedProducts = filteredProducts.slice(start, start + length);
    
    const response = Response.json({
      draw: draw,
      recordsTotal: allProducts.length,
      recordsFiltered: filteredProducts.length,
      data: paginatedProducts
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
    
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}