const { Client } = require('pg');

const connectionString = 'postgresql://postgres.zcddgbtdlexnqtaegtkh:Uppcchq@123@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres';

async function reloadCache() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    const sql = `NOTIFY pgrst, 'reload schema';`;
    
    console.log('Executing reload schema...');
    await client.query(sql);
    console.log('Reload schema executed successfully!');
  } catch (error) {
    console.error('Error executing schema reload:', error);
  } finally {
    await client.end();
  }
}

reloadCache();
