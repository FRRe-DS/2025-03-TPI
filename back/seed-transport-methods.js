const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'shipping_db',
};

// Transport methods data based on the enum
const transportMethods = [
  {
    name: 'Air Transport',
    type: 'air',
    estimatedDays: '1-3'
  },
  {
    name: 'Sea Transport',
    type: 'sea',
    estimatedDays: '7-21'
  },
  {
    name: 'Road Transport',
    type: 'road',
    estimatedDays: '2-5'
  },
  {
    name: 'Rail Transport',
    type: 'rail',
    estimatedDays: '3-7'
  }
];

async function seedTransportMethods() {
  let connection;
  
  try {
    console.log('🌱 Starting transport methods seed...');
    
    // Create database connection
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Check if transport_methods table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'transport_methods'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Table transport_methods does not exist. Please run migrations first.');
      return;
    }
    
    // Clear existing data
    await connection.execute('DELETE FROM transport_methods');
    console.log('🗑️  Cleared existing transport methods');
    
    // Insert new transport methods
    for (const method of transportMethods) {
      await connection.execute(
        'INSERT INTO transport_methods (name, type, estimatedDays) VALUES (?, ?, ?)',
        [method.name, method.type, method.estimatedDays]
      );
      console.log(`✅ Inserted: ${method.name} (${method.type}) - ${method.estimatedDays} days`);
    }
    
    console.log('🎉 Transport methods seed completed successfully!');
    
    // Verify the data
    const [rows] = await connection.execute('SELECT * FROM transport_methods');
    console.log('\n📋 Current transport methods in database:');
    rows.forEach(row => {
      console.log(`  - ${row.name} (${row.type}) - ${row.estimatedDays} days`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding transport methods:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the seed function
if (require.main === module) {
  seedTransportMethods()
    .then(() => {
      console.log('✨ Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTransportMethods };
