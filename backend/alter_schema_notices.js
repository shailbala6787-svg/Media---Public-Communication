const { Client } = require('pg');

const connectionString = 'postgresql://postgres.zcddgbtdlexnqtaegtkh:Uppcchq@123@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres';

async function alterSchema() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    const sql = `
      ALTER TABLE public.public_notices ADD COLUMN IF NOT EXISTS department TEXT;
      ALTER TABLE public.public_notices ADD COLUMN IF NOT EXISTS notice_number TEXT;
      ALTER TABLE public.public_notices ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
      NOTIFY pgrst, 'reload schema';
    `;
    
    console.log('Executing alter table...');
    await client.query(sql);
    console.log('Alter table executed successfully!');
  } catch (error) {
    console.error('Error executing schema:', error);
  } finally {
    await client.end();
  }
}

alterSchema();
