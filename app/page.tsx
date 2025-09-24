export default function Home() {
  const apis = [
    { method: 'GET', url: '/api/users', desc: 'Public users data (pagination)' },
    { method: 'GET', url: '/api/test', desc: 'Test endpoint' },
    { method: 'GET', url: '/api/hello', desc: 'Hello API' },
    { method: 'POST', url: '/api/auth/register', desc: 'Register new user' },
    { method: 'POST', url: '/api/auth/login', desc: 'Login user' },
    { method: 'GET', url: '/api/users/profile', desc: 'User profile (protected)' },
    { method: 'GET', url: '/api/users/secure', desc: 'Secure users data (protected)' }
  ]

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Server Next.js API</h1>
      <p>Server Next.js berhasil berjalan!</p>
      
      <h2>Available API Endpoints:</h2>
      <div style={{ marginTop: '20px' }}>
        {apis.map((api, index) => (
          <div key={index} style={{ 
            marginBottom: '10px', 
            padding: '10px', 
            border: '1px solid #ddd', 
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                backgroundColor: api.method === 'GET' ? '#28a745' : '#007bff',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 'bold',
                minWidth: '50px',
                textAlign: 'center'
              }}>
                {api.method}
              </span>
              <code style={{ backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '3px' }}>
                {api.url}
              </code>
              <span style={{ color: '#666' }}>{api.desc}</span>
            </div>
          </div>
        ))}
      </div>
      
      <h3>Demo Accounts:</h3>
      <ul>
        <li><strong>Admin:</strong> admin@demo.com / admin123</li>
        <li><strong>User:</strong> user@demo.com / user123</li>
      </ul>
    </main>
  )
}