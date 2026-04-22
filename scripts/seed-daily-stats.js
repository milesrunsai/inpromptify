const { PrismaClient } = require('../lib/generated/prisma/client');
const prisma = new PrismaClient();

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  
  console.log(`Seeding daily quiz stats for ${today}...`);
  
  // Create some test attempts for today
  const attempts = [
    {
      email: 'user1@example.com',
      date: today,
      score: 5,
      totalQuestions: 5,
      streak: 3,
      responses: { displayName: 'Alex' }
    },
    {
      email: 'user2@example.com', 
      date: today,
      score: 4,
      totalQuestions: 5,
      streak: 1,
      responses: { displayName: 'Jordan' }
    },
    {
      email: 'user3@example.com',
      date: today,
      score: 3,
      totalQuestions: 5, 
      streak: 2,
      responses: { displayName: 'Sam' }
    },
    {
      email: 'user4@example.com',
      date: today,
      score: 4,
      totalQuestions: 5,
      streak: 1,
      responses: { displayName: 'Taylor' }
    },
    {
      email: 'user5@example.com',
      date: today,
      score: 5,
      totalQuestions: 5,
      streak: 7,
      responses: { displayName: 'River' }
    },
    {
      email: 'user6@example.com',
      date: today,
      score: 2,
      totalQuestions: 5,
      streak: 1,
      responses: { displayName: 'Casey' }
    },
  ];

  // Clear existing attempts for today first
  await prisma.dailyQuizAttempt.deleteMany({
    where: { date: today }
  });

  // Create new attempts
  for (const attempt of attempts) {
    await prisma.dailyQuizAttempt.create({
      data: attempt
    });
  }

  console.log(`✅ Created ${attempts.length} daily quiz attempts for ${today}`);
  
  // Verify the stats
  const stats = await prisma.dailyQuizAttempt.aggregate({
    where: { date: today },
    _count: true,
    _avg: { score: true },
    _max: { score: true }
  });
  
  console.log(`📊 Today's stats:`);
  console.log(`   Participants: ${stats._count}`);
  console.log(`   Average score: ${Math.round(stats._avg.score * 10) / 10}/5`);
  console.log(`   Top score: ${stats._max.score}/5`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());