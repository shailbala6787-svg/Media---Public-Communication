const fs = require('fs');

async function seed() {
  try {
    // 1. Login as Admin
    console.log('Logging in as Admin...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'shailbalasingh6787@gmail.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    
    if (!loginData.success) {
      throw new Error('Login failed: ' + loginData.message);
    }
    const token = loginData.token;
    console.log('Login successful.');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 2. Add a Press Release
    console.log('Adding Press Release...');
    const prRes = await fetch('http://localhost:5000/api/press-releases', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'New AI Policy Launched',
        summary: 'The government announces a new comprehensive AI policy for public communication.',
        content: 'This policy aims to regulate and encourage the use of Artificial Intelligence in public sectors. It focuses on ethical guidelines, data privacy, and innovation. We expect a massive digital transformation in the upcoming years.',
        category: 'Technology',
        status: 'published',
        tags: 'AI, Policy, Government'
      })
    });
    console.log('Press Release Response:', await prRes.json());

    // 3. Add a Public Notice
    console.log('Adding Public Notice...');
    const pnRes = await fetch('http://localhost:5000/api/public-notices', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Road Closure on Main St',
        content: 'Due to ongoing maintenance work, Main St will be closed from 10 PM to 6 AM for the next three days. Please take alternative routes.',
        status: 'active',
        priority: 'high'
      })
    });
    console.log('Public Notice Response:', await pnRes.json());

    // 4. Add an Announcement
    console.log('Adding Announcement...');
    const annRes = await fetch('http://localhost:5000/api/announcements', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Portal Scheduled Downtime',
        content: 'The Media & Public Communication portal will be down for maintenance this Sunday from 2 AM to 4 AM.',
        status: 'active',
        priority: 'normal',
        pinned: true
      })
    });
    console.log('Announcement Response:', await annRes.json());

    // 5. Add a Contact Message (Public Endpoint)
    console.log('Adding Contact Message...');
    const contactRes = await fetch('http://localhost:5000/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Citizen',
        email: 'john.citizen@example.com',
        subject: 'Query regarding new AI policy',
        message: 'Could you provide a detailed PDF of the newly launched AI policy?'
      })
    });
    console.log('Contact Message Response:', await contactRes.json());

    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

seed();
