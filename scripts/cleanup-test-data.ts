/**
 * Cleanup test data from the database
 * Run with: npx tsx scripts/cleanup-test-data.ts
 */

import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete test daily quiz attempts (emails containing "test" or from anon IDs)
  const deletedDaily = await prisma.dailyQuizAttempt.deleteMany({
    where: {
      OR: [
        { email: { contains: "test" } },
        { email: { contains: "inpromptyou" } },
      ],
    },
  });
  console.log(`Deleted ${deletedDaily.count} test daily quiz attempts`);

  // Delete test assessment data
  const deletedAssessments = await prisma.assessment.deleteMany({
    where: {
      OR: [
        { candidateEmail: { contains: "test" } },
        { candidateEmail: { contains: "inpromptyou" } },
      ],
    },
  });
  console.log(`Deleted ${deletedAssessments.count} test assessments`);

  // Delete test weekly challenge attempts
  try {
    const deletedWeekly = await prisma.weeklyChallengeAttempt.deleteMany({
      where: {
        user: {
          email: { contains: "test" },
        },
      },
    });
    console.log(`Deleted ${deletedWeekly.count} test weekly attempts`);
  } catch {
    console.log("No weekly attempts table yet or no test data");
  }

  console.log("Done! Test data cleaned up.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
