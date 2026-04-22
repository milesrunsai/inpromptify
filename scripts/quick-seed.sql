-- Quick seed for daily quiz data
-- Run with: psql -d inpromptify -f scripts/quick-seed.sql

-- Clear existing data for today
DELETE FROM "DailyQuizAttempt" WHERE date = CURRENT_DATE;

-- Add sample attempts for today
INSERT INTO "DailyQuizAttempt" (email, date, score, "totalQuestions", streak, responses, "createdAt", "updatedAt") VALUES
('alex@example.com', CURRENT_DATE, 5, 5, 3, '{"displayName": "Alex"}', NOW(), NOW()),
('jordan@example.com', CURRENT_DATE, 4, 5, 1, '{"displayName": "Jordan"}', NOW(), NOW()),
('sam@example.com', CURRENT_DATE, 3, 5, 2, '{"displayName": "Sam"}', NOW(), NOW()),
('casey@example.com', CURRENT_DATE, 4, 5, 1, '{"displayName": "Casey"}', NOW(), NOW()),
('river@example.com', CURRENT_DATE, 5, 5, 7, '{"displayName": "River"}', NOW(), NOW()),
('taylor@example.com', CURRENT_DATE, 2, 5, 1, '{"displayName": "Taylor"}', NOW(), NOW()),
('jamie@example.com', CURRENT_DATE, 4, 5, 2, '{"displayName": "Jamie"}', NOW(), NOW()),
('sydney@example.com', CURRENT_DATE, 3, 5, 1, '{"displayName": "Sydney"}', NOW(), NOW());

-- Show results
SELECT 
  COUNT(*) as participants,
  AVG(score) as avg_score,
  MAX(score) as top_score
FROM "DailyQuizAttempt" 
WHERE date = CURRENT_DATE;