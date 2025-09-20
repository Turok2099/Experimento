const https = require('https');

console.log('🔍 Probando deployment específico del backend...\n');

function makeRequest(url, method = 'GET', headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData,
          url: url
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

async function testBackendDeployment() {
  const backendUrl = 'https://nuevotrain-backend-78hpog9p3-jorge-castros-projects-839066ef.vercel.app';
  
  console.log(`🎯 Probando: ${backendUrl}\n`);
  
  // 1. Probar endpoint raíz
  console.log('1️⃣  Probando endpoint raíz...');
  try {
    const response = await makeRequest(backendUrl);
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${response.data}`);
    console.log(`   Content-Type: ${response.headers['content-type']}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // 2. Probar health check
  console.log('\n2️⃣  Probando /health...');
  try {
    const response = await makeRequest(`${backendUrl}/health`);
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${response.data}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // 3. Probar endpoint de API
  console.log('\n3️⃣  Probando /api...');
  try {
    const response = await makeRequest(`${backendUrl}/api`);
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${response.data}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // 4. Probar con diferentes métodos HTTP
  console.log('\n4️⃣  Probando métodos HTTP...');
  const methods = ['GET', 'POST', 'OPTIONS'];
  
  for (const method of methods) {
    try {
      const response = await makeRequest(backendUrl, method);
      console.log(`   ${method}: Status ${response.statusCode}`);
    } catch (error) {
      console.log(`   ${method}: Error - ${error.message}`);
    }
  }
  
  console.log('\n💡 Diagnóstico:');
  console.log('   - Si todos fallan: Problema de conectividad');
  console.log('   - Si solo algunos fallan: Problema de configuración');
  console.log('   - Si devuelve 404: Endpoint no existe');
  console.log('   - Si devuelve 500: Error interno del servidor');
}

testBackendDeployment().catch(console.error);

