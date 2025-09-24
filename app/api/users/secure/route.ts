import { verifyToken } from "@/app/lib/auth";

function generateSecureUsers(start: number, length: number) {
  const firstNames = [
    "Alex",
    "Emma",
    "Ryan",
    "Sophia",
    "Nathan",
    "Isabella",
    "Lucas",
    "Mia",
    "Ethan",
    "Charlotte",
    "Mason",
    "Amelia",
    "Logan",
    "Harper",
    "Jacob",
    "Evelyn",
    "Noah",
    "Abigail",
    "Liam",
    "Emily",
    "Oliver",
    "Elizabeth",
    "Elijah",
    "Sofia",
    "James",
    "Avery",
    "Benjamin",
    "Ella",
    "Lucas",
    "Madison",
    "Henry",
    "Scarlett",
    "Alexander",
    "Victoria",
    "Michael",
    "Aria",
    "Daniel",
    "Grace",
    "Matthew",
    "Chloe",
    "Jackson",
    "Camila",
    "Sebastian",
    "Penelope",
    "Jack",
    "Riley",
    "Aiden",
    "Layla",
    "Owen",
    "Lillian",
  ];
  const lastNames = [
    "Anderson",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark",
    "Rodriguez",
    "Lewis",
    "Lee",
    "Walker",
    "Hall",
    "Allen",
    "Young",
    "Hernandez",
    "King",
    "Wright",
    "Lopez",
    "Hill",
    "Scott",
    "Green",
    "Adams",
    "Baker",
    "Gonzalez",
    "Nelson",
    "Carter",
    "Mitchell",
    "Perez",
    "Roberts",
    "Turner",
    "Phillips",
    "Campbell",
    "Parker",
    "Evans",
    "Edwards",
    "Collins",
    "Stewart",
    "Sanchez",
    "Morris",
    "Rogers",
    "Reed",
    "Cook",
    "Morgan",
    "Bell",
    "Murphy",
    "Bailey",
    "Rivera",
    "Cooper",
    "Richardson",
    "Cox",
    "Howard",
  ];
  const domains = [
    "company.com",
    "corp.com",
    "enterprise.com",
    "business.com",
    "secure.com",
  ];
  const departments = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Sales",
    "Operations",
    "Legal",
    "R&D",
  ];

  const users = [];
  for (let i = start + 1; i <= start + length; i++) {
    const firstName = firstNames[(i - 1) % firstNames.length];
    const lastName =
      lastNames[Math.floor((i - 1) / firstNames.length) % lastNames.length];
    const domain = domains[(i - 1) % domains.length];
    const department = departments[(i - 1) % departments.length];

    // Generate random date within last 3 years and next 1 year
    const randomDays = Math.floor(Math.random() * 1460) - 365; // 4 years range, 1 year future
    const createdAt = new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000);

    users.push({
      id: i,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${
        i > 2500 ? i : ""
      }@${domain}`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${String(
        Math.floor(Math.random() * 9000) + 1000
      )}`,
      age: 22 + (i % 43),
      salary: 45000 + i * 1500 + Math.floor(Math.random() * 25000),
      department,
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${firstName}${lastName}${i}`,
      created_at: createdAt.toISOString().split("T")[0], // YYYY-MM-DD format
    });
  }
  return users;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Token tidak ditemukan" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload) {
      return Response.json({ error: "Token tidak valid" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const draw = searchParams.get("draw") || "1";
    const start = parseInt(searchParams.get("start") || "0");
    const length = parseInt(searchParams.get("length") || "10");
    const searchValue = searchParams.get("search[value]") || "";

    // Column-specific searches
    const firstNameSearch = searchParams.get("columns[1][search][value]") || "";
    const lastNameSearch = searchParams.get("columns[2][search][value]") || "";
    const emailSearch = searchParams.get("columns[3][search][value]") || "";
    const phoneSearch = searchParams.get("columns[4][search][value]") || "";
    const ageSearch = searchParams.get("columns[5][search][value]") || "";
    const salarySearch = searchParams.get("columns[6][search][value]") || "";
    const departmentSearch =
      searchParams.get("columns[7][search][value]") || "";
    const createdAtSearch = searchParams.get("columns[8][search][value]") || "";

    // Filter parameters
    const dateFilter = searchParams.get("date") || "";
    const startDate = searchParams.get("start_date") || "";
    const endDate = searchParams.get("end_date") || "";
    const yearFilter = searchParams.get("year") || "";
    const monthFilter = searchParams.get("month") || "";

    console.log("🔍 Search values:", {
      global: searchValue,
      firstName: firstNameSearch,
      lastName: lastNameSearch,
      email: emailSearch,
      phone: phoneSearch,
      age: ageSearch,
      salary: salarySearch,
      department: departmentSearch,
      date: dateFilter,
      startDate: startDate,
      endDate: endDate,
      year: yearFilter,
      month: monthFilter,
    });

    // Generate all users for filtering
    const allUsers = generateSecureUsers(0, 5000);

    // Filter users based on global search
    let filteredUsers = allUsers;
    if (searchValue) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.phone.includes(searchValue) ||
          user.department.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Filter by column-specific searches
    if (firstNameSearch) {
      filteredUsers = filteredUsers.filter((user) =>
        user.firstName.toLowerCase().includes(firstNameSearch.toLowerCase())
      );
    }

    if (lastNameSearch) {
      filteredUsers = filteredUsers.filter((user) =>
        user.lastName.toLowerCase().includes(lastNameSearch.toLowerCase())
      );
    }

    if (emailSearch) {
      filteredUsers = filteredUsers.filter((user) =>
        user.email.toLowerCase().includes(emailSearch.toLowerCase())
      );
    }

    if (phoneSearch) {
      filteredUsers = filteredUsers.filter((user) =>
        user.phone.includes(phoneSearch)
      );
    }

    if (ageSearch) {
      filteredUsers = filteredUsers.filter((user) =>
        user.age.toString().includes(ageSearch)
      );
    }

    if (salarySearch) {
      filteredUsers = filteredUsers.filter((user) =>
        user.salary.toString().includes(salarySearch)
      );
    }

    if (departmentSearch) {
      filteredUsers = filteredUsers.filter((user) =>
        user.department.toLowerCase().includes(departmentSearch.toLowerCase())
      );
    }

    if (createdAtSearch) {
      filteredUsers = filteredUsers.filter((user) =>
        user.created_at.includes(createdAtSearch)
      );
    }

    // Date filters
    if (dateFilter && /^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
      console.log("📅 Filtering by date:", dateFilter);
      filteredUsers = filteredUsers.filter(
        (user) => user.created_at === dateFilter
      );
    }

    if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      console.log("📅 Filtering from date:", startDate);
      filteredUsers = filteredUsers.filter(
        (user) => user.created_at >= startDate
      );
    }

    if (endDate && /^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      console.log("📅 Filtering to date:", endDate);
      filteredUsers = filteredUsers.filter(
        (user) => user.created_at <= endDate
      );
    }

    if (yearFilter && /^\d{4}$/.test(yearFilter)) {
      console.log("📅 Filtering by year:", yearFilter);
      filteredUsers = filteredUsers.filter((user) =>
        user.created_at.startsWith(yearFilter)
      );
    }

    if (monthFilter && /^\d{4}-\d{2}$/.test(monthFilter)) {
      console.log("📅 Filtering by month:", monthFilter);
      filteredUsers = filteredUsers.filter((user) =>
        user.created_at.startsWith(monthFilter)
      );
    }

    // Paginate filtered results
    const paginatedUsers = filteredUsers.slice(start, start + length);

    const response = Response.json({
      draw: parseInt(draw),
      recordsTotal: 5000,
      recordsFiltered: filteredUsers.length,
      data: paginatedUsers,
    });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
