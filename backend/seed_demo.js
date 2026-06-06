require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seedDemoData() {
  try {
    console.log("Fetching an admin user to attach as author...");
    const { data: users } = await supabase.from('users').select('id').limit(1);
    const authorId = users && users.length > 0 ? users[0].id : null;

    if (!authorId) {
      console.log("No users found to attach as author.");
      return;
    }

    console.log("Inserting Demo Press Releases...");
    await supabase.from('press_releases').insert([
      {
        title: "[DEMO - PUBLIC] Naya Highway Project Manzoor",
        summary: "Yeh ek public press release hai.",
        content: "Naya highway project manzoor ho gaya hai jisse aam janta ko bahut fayda hoga. (Yeh published hai aur public ko dikhega)",
        category: "Policy",
        status: "published", // PUBLIC SEES THIS
        author_id: authorId,
        views: 150
      },
      {
        title: "[DEMO - DRAFT] Departmental Meeting",
        summary: "Yeh ek draft press release hai.",
        content: "Internal meeting scheduled for next week. (Yeh draft hai, public ko nahi dikhega)",
        category: "General",
        status: "draft", // PUBLIC DOES NOT SEE THIS
        author_id: authorId,
        views: 0
      }
    ]);

    console.log("Inserting Demo Announcements...");
    await supabase.from('announcements').insert([
      {
        title: "[DEMO - PUBLIC] Public Holiday Announced",
        content: "Kal sabhi schools aur offices band rahenge. (Yeh public ko dikhega)",
        priority: "high",
        target_audience: "public", // PUBLIC SEES THIS
        status: "active",
        pinned: true
      },
      {
        title: "[DEMO - STAFF] Internal IT Update",
        content: "Sabhi staff members apne computers update kar lein. (Yeh aam janta ko nahi dikhega)",
        priority: "medium",
        target_audience: "staff", // PUBLIC DOES NOT SEE THIS
        status: "active",
        pinned: false
      }
    ]);

    console.log("Demo data successfully inserted!");
  } catch (error) {
    console.error("Error inserting demo data:", error);
  }
}

seedDemoData();
