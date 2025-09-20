// Script para probar la conexión a la base de datos de Neon
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function testDatabaseConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('🔌 Intentando conectar a la base de datos...');
    await client.connect();
    console.log('✅ Conexión exitosa a la base de datos!');

    // Probar una consulta simple
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    console.log('📊 Información de la base de datos:');
    console.log(`   - Tiempo actual: ${result.rows[0].current_time}`);
    console.log(`   - Versión: ${result.rows[0].db_version}`);

    // Probar listar tablas
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas encontradas:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('   (No hay tablas en el esquema public)');
    }

    return { success: true, message: 'Conexión exitosa' };
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error(`   - Mensaje: ${error.message}`);
    console.error(`   - Código: ${error.code}`);
    console.error(`   - Detalle: ${error.detail || 'N/A'}`);
    
    return { success: false, error: error.message };
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada.');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testDatabaseConnection()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 ¡Prueba de conexión completada exitosamente!');
        process.exit(0);
      } else {
        console.log('\n💥 Prueba de conexión falló.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = { testDatabaseConnection };
