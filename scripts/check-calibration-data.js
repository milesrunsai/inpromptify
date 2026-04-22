const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function checkCalibrationData() {
  try {
    // Check CalibrationResponse table
    const calibrationCount = await prisma.calibrationResponse.count();
    console.log(`📊 CalibrationResponse records: ${calibrationCount}`);
    
    if (calibrationCount > 0) {
      const sample = await prisma.calibrationResponse.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      console.log('\n📝 Recent calibration responses:');
      sample.forEach(r => {
        console.log(`- Question ${r.questionId}: ${r.wasCorrect ? '✅' : '❌'} in ${r.timeTakenMs}ms`);
      });
    }
    
    // Check DailyQuizAttempt table (main assessments)
    const assessmentCount = await prisma.dailyQuizAttempt.count({
      where: { totalQuestions: 100 } // Main assessments only
    });
    console.log(`\n🎯 Main assessment attempts: ${assessmentCount}`);
    
    if (assessmentCount > 0) {
      const recentAssessments = await prisma.dailyQuizAttempt.findMany({
        where: { totalQuestions: 100 },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          email: true,
          score: true,
          date: true,
          responses: true
        }
      });
      
      console.log('\n🏆 Recent main assessments:');
      recentAssessments.forEach(a => {
        const name = a.responses?.displayName || a.email.split('@')[0];
        console.log(`- ${name}: ${a.score}/100 on ${a.date}`);
      });
    }
    
    // Check old daily quiz data
    const oldQuizCount = await prisma.dailyQuizAttempt.count({
      where: { totalQuestions: 5 } // Old daily quizzes
    });
    console.log(`\n📅 Old daily quiz attempts: ${oldQuizCount}`);
    
    console.log('\n✅ Data check complete');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCalibrationData();