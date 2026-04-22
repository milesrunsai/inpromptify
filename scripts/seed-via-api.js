const ADMIN_SECRET = "flinch-admin-2026-xyz";
const BASE_URL = "https://inpromptify.com";

async function createDailyAttempt(email, displayName, score) {
  const response = await fetch(`${BASE_URL}/api/admin/leaderboard?secret=${ADMIN_SECRET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      displayName: displayName,
      score: score,
      totalQuestions: 5,
      streak: Math.floor(Math.random() * 5) + 1,
      date: new Date().toISOString().slice(0, 10)
    })
  });
  
  if (!response.ok) {
    console.error(`Failed to create attempt for ${email}:`, await response.text());
  } else {
    console.log(`✅ Created attempt: ${displayName} - ${score}/5`);
  }
}

async function seedTodaysStats() {
  console.log("🌱 Seeding today's daily quiz stats...");
  
  const attempts = [
    ['alex.chen@example.com', 'Alex', 5],
    ['jordan.smith@example.com', 'Jordan', 4], 
    ['sam.taylor@example.com', 'Sam', 3],
    ['casey.rivera@example.com', 'Casey', 4],
    ['river.jones@example.com', 'River', 5],
    ['taylor.kim@example.com', 'Taylor', 2],
    ['jamie.wong@example.com', 'Jamie', 4],
    ['sydney.park@example.com', 'Sydney', 3],
    ['morgan.lee@example.com', 'Morgan', 5],
    ['avery.brown@example.com', 'Avery', 4],
  ];
  
  for (const [email, name, score] of attempts) {
    await createDailyAttempt(email, name, score);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`🎉 Done! Created ${attempts.length} daily quiz attempts.`);
  console.log("📊 Expected stats: 10 participants, avg: 3.9/5, top: 5/5");
}

seedTodaysStats().catch(console.error);