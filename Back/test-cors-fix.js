const https = require('https');

console.log('🧪 Probando fix de CORS...\n');

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://nuevotrain-frontend-ajxnvxr2u-jorge-castros-projects-839066ef.vercel.app'
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
          corsHeaders: {
            'access-control-allow-origin': res.headers['access-control-allow-origin'],
            'access-control-allow-credentials': res.headers['access-control-allow-credentials'],
            'access-control-allow-methods': res.headers['access-control-allow-methods']
          }
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testCorsFix() {
  // Probar con el deployment más reciente
  const deployments = [
    'https://nuevotrain-backend-78hpog9p3-jorge-castros-projects-839066ef.vercel.app',
    'https://nuevotrain-backend-2s5uyooio-jorge-castros-projects-839066ef.vercel.app'
  ];
  
  for (const deployment of deployments) {
    console.log(`🔍 Probando deployment: ${deployment.split('-')[2].substring(0, 8)}...`);
    
    try {
      // Probar OPTIONS request (preflight)
      const optionsResponse = await makeRequest(`${deployment}/auth/register`, 'OPTIONS');
      console.log(`   OPTIONS Status: ${optionsResponse.statusCode}`);
      console.log(`   CORS Headers:`, optionsResponse.corsHeaders);
      
      // Probar POST request
      const postResponse = await makeRequest(`${deployment}/auth/register`, 'POST', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      });
      console.log(`   POST Status: ${postResponse.statusCode}`);
      
      if (optionsResponse.statusCode === 204 || optionsResponse.statusCode === 200) {
        console.log(`   ✅ CORS configurado correctamente`);
      } else {
        console.log(`   ❌ CORS no configurado`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('💡 Recomendación:');
  console.log('   Si el deployment más reciente (78hpog9p3) tiene CORS configurado,');
  console.log('   actualiza la URL del backend en tu frontend.');
}

testCorsFix().catch(console.error);

