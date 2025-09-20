const https = require('https');

console.log('🔍 Probando dominio principal del backend...\n');

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

async function testMainDomain() {
  const mainDomain = 'https://nuevotrain-backend.vercel.app';
  
  console.log(`🎯 Probando dominio principal: ${mainDomain}\n`);
  
  // 1. Probar endpoint raíz
  console.log('1️⃣  Probando endpoint raíz...');
  try {
    const response = await makeRequest(mainDomain);
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${response.data}`);
    console.log(`   Content-Type: ${response.headers['content-type']}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // 2. Probar health check
  console.log('\n2️⃣  Probando /health...');
  try {
    const response = await makeRequest(`${mainDomain}/health`);
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${response.data}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n💡 Resultado:');
  console.log('   Si el dominio principal funciona, úsalo en lugar del URL específico');
}

testMainDomain().catch(console.error);

