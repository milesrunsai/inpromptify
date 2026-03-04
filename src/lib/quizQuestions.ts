export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "You need an AI to analyze a complex legal contract. Which prompting technique will produce the most reliable output?",
    options: [
      "Ask the AI to summarize the contract in one sentence",
      "Break the task into steps: first identify parties, then key terms, then obligations, then risks",
      "Copy-paste the entire contract and say 'analyze this'",
      "Ask the AI to role-play as a lawyer and give its opinion",
    ],
    correctIndex: 1,
    explanation: "Breaking complex tasks into structured steps (chain-of-thought) produces more reliable and thorough analysis than vague or single-shot requests.",
    category: "Prompt Engineering",
  },
  {
    id: 2,
    question: "A colleague asks you to use AI to generate a quarterly financial report with exact revenue figures. What is the correct approach?",
    options: [
      "Ask the AI to generate the report with estimated figures",
      "Provide the real data to the AI and have it format and analyze it",
      "Let the AI pull the latest figures from the internet",
      "Ask the AI to research your company's financials and compile them",
    ],
    correctIndex: 1,
    explanation: "AI models do not have access to your company's real-time data and will hallucinate figures if asked to generate them. Always provide the actual data and use AI for formatting, analysis, and insight extraction.",
    category: "Hallucination Awareness",
  },
  {
    id: 3,
    question: "You are choosing an AI model for a customer support chatbot that needs to handle 10,000 requests per day at minimum cost. Which factor matters MOST?",
    options: [
      "The model with the highest benchmark score",
      "The model with the largest context window",
      "The balance of cost per token, latency, and accuracy for your specific use case",
      "The newest model available",
    ],
    correctIndex: 2,
    explanation: "Model selection should be driven by your specific requirements — cost, speed, and accuracy trade-offs matter more than benchmark rankings or recency. A smaller, faster model may outperform an expensive frontier model for simple support tasks.",
    category: "Model Selection",
  },
  {
    id: 4,
    question: "You want the AI to write product descriptions in the same style as three examples you provide. Which technique are you using?",
    options: [
      "Zero-shot prompting",
      "Chain-of-thought prompting",
      "Few-shot prompting",
      "Retrieval-augmented generation",
    ],
    correctIndex: 2,
    explanation: "Few-shot prompting provides examples in the prompt so the model learns the pattern, style, and format you want. This is one of the most practical techniques for consistent output quality.",
    category: "Few-Shot Prompting",
  },
  {
    id: 5,
    question: "Your team wants to use AI to make hiring decisions about candidates. What is the most important concern?",
    options: [
      "Making sure the AI model is the most expensive one available",
      "Ensuring the AI has been trained on enough hiring data",
      "Bias, fairness, transparency, and keeping a human in the loop for final decisions",
      "Speed of processing applications",
    ],
    correctIndex: 2,
    explanation: "AI systems can perpetuate or amplify biases present in training data. High-stakes decisions like hiring require fairness auditing, transparency in how decisions are made, and human oversight — not just automation.",
    category: "Ethical AI Use",
  },
  {
    id: 6,
    question: "When should you NOT use AI for a task?",
    options: [
      "Drafting a first version of a marketing email",
      "Making a final medical diagnosis for a patient",
      "Summarizing meeting notes",
      "Generating code boilerplate for a new project",
    ],
    correctIndex: 1,
    explanation: "AI should not be the sole decision-maker for high-stakes outcomes that affect health, safety, or legal standing. Medical diagnosis requires licensed professionals — AI can assist but not replace human judgment in critical domains.",
    category: "When NOT to Use AI",
  },
  {
    id: 7,
    question: "You are getting inconsistent creative outputs from an AI. The responses vary wildly between requests. Which parameter should you adjust?",
    options: [
      "Increase the maximum token limit",
      "Lower the temperature setting",
      "Change to a different model entirely",
      "Add more text to the system prompt",
    ],
    correctIndex: 1,
    explanation: "Temperature controls randomness in AI outputs. Lower temperature (e.g., 0.2) produces more consistent, deterministic responses. Higher temperature (e.g., 0.9) increases creativity but also variability.",
    category: "Temperature & Parameters",
  },
  {
    id: 8,
    question: "Your company wants an AI chatbot that can answer questions about your internal product documentation. What architecture is most appropriate?",
    options: [
      "Fine-tune a model on your documentation",
      "Use a large model with a bigger context window and paste all docs in",
      "Retrieval-Augmented Generation (RAG) — retrieve relevant docs and include them in the prompt",
      "Train a custom model from scratch on your data",
    ],
    correctIndex: 2,
    explanation: "RAG (Retrieval-Augmented Generation) is the standard approach for grounding AI in specific knowledge. It retrieves relevant documents at query time and includes them in context, avoiding the cost and complexity of fine-tuning while keeping responses accurate and up-to-date.",
    category: "RAG Concepts",
  },
  {
    id: 9,
    question: "You ask an AI to write a research paper and it confidently cites three academic studies with authors, titles, and publication years. What should you do?",
    options: [
      "Trust the citations since the AI provided specific details",
      "Verify every citation independently — AI frequently fabricates realistic-looking references",
      "Only verify the citations if they seem unusual",
      "Ask the AI to confirm its own citations are correct",
    ],
    correctIndex: 1,
    explanation: "AI models frequently hallucinate citations that look completely legitimate — with real-sounding author names, journals, and dates — but are entirely fabricated. Always verify citations from independent sources. Asking the AI to self-verify does not work.",
    category: "AI Limitations",
  },
  {
    id: 10,
    question: "You want an AI to explain its reasoning step-by-step before giving a final answer to a complex math problem. What should you include in your prompt?",
    options: [
      "Just ask for the final answer to save tokens",
      "Tell the AI to think step by step and show its work before the final answer",
      "Ask the AI to answer quickly",
      "Provide the answer and ask the AI to verify it",
    ],
    correctIndex: 1,
    explanation: "Chain-of-thought prompting — asking the model to reason step by step — significantly improves accuracy on complex reasoning tasks. The model's intermediate steps help it arrive at better conclusions and make errors easier to spot.",
    category: "Chain-of-Thought",
  },
];

export function getLetterGrade(score: number, total: number): string {
  const pct = (score / total) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

export function getPercentileEstimate(score: number, total: number): number {
  // Rough percentile based on expected difficulty distribution
  const pct = (score / total) * 100;
  if (pct >= 90) return 95;
  if (pct >= 80) return 82;
  if (pct >= 70) return 68;
  if (pct >= 60) return 52;
  if (pct >= 50) return 38;
  if (pct >= 40) return 25;
  if (pct >= 30) return 15;
  return 8;
}
