const https = require('https');

console.log('🔍 Probando deployment que funcionaba antes...\n');

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

async function testWorkingDeployment() {
  const workingUrl = 'https://nuevotrain-backend-2s5uyooio-jorge-castros-projects-839066ef.vercel.app';
  
  console.log(`🎯 Probando deployment anterior: ${workingUrl}\n`);
  
  // 1. Probar endpoint raíz
  console.log('1️⃣  Probando endpoint raíz...');
  try {
    const response = await makeRequest(workingUrl);
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${response.data}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  // 2. Probar health check
  console.log('\n2️⃣  Probando /health...');
  try {
    const response = await makeRequest(`${workingUrl}/health`);
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Response: ${response.data}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('\n💡 Recomendación:');
  console.log('   Si este deployment funciona, úsalo temporalmente');
  console.log('   mientras solucionamos el problema del deployment actual');
}

testWorkingDeployment().catch(console.error);

