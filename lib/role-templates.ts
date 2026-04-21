export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  focusDimensions: string[];
  questionTags: string[];
  recommendedQuestionCount: number;
  scoringWeights: Record<string, number>;
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    description:
      "Evaluates AI-assisted coding, debugging, and development workflow proficiency.",
    focusDimensions: ["promptQuality", "iterationIntelligence", "efficiency"],
    questionTags: [
      "prompt-engineering",
      "iteration",
      "debugging",
      "tool-orchestration",
      "code-generation",
    ],
    recommendedQuestionCount: 12,
    scoringWeights: {
      promptQuality: 0.3,
      efficiency: 0.25,
      iterationIntelligence: 0.25,
      responseQuality: 0.1,
      speed: 0.1,
    },
  },
  {
    id: "product-manager",
    name: "Product Manager",
    description:
      "Measures ability to leverage AI for research, specs, prioritization, and stakeholder communication.",
    focusDimensions: ["promptQuality", "responseQuality", "efficiency"],
    questionTags: [
      "prompt-engineering",
      "context-awareness",
      "output-evaluation",
      "specificity",
      "structured-output",
    ],
    recommendedQuestionCount: 10,
    scoringWeights: {
      promptQuality: 0.3,
      responseQuality: 0.3,
      efficiency: 0.2,
      iterationIntelligence: 0.1,
      speed: 0.1,
    },
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description:
      "Assesses AI usage for data exploration, analysis prompts, and insight extraction.",
    focusDimensions: ["promptQuality", "efficiency", "responseQuality"],
    questionTags: [
      "prompt-engineering",
      "specificity",
      "structured-output",
      "context-awareness",
      "output-evaluation",
    ],
    recommendedQuestionCount: 10,
    scoringWeights: {
      promptQuality: 0.25,
      efficiency: 0.25,
      responseQuality: 0.25,
      iterationIntelligence: 0.15,
      speed: 0.1,
    },
  },
  {
    id: "designer",
    name: "Designer",
    description:
      "Evaluates creative AI collaboration — image generation prompts, design iteration, and feedback loops.",
    focusDimensions: ["promptQuality", "iterationIntelligence", "responseQuality"],
    questionTags: [
      "prompt-engineering",
      "iteration",
      "specificity",
      "context-awareness",
      "creative",
    ],
    recommendedQuestionCount: 10,
    scoringWeights: {
      promptQuality: 0.3,
      iterationIntelligence: 0.3,
      responseQuality: 0.2,
      efficiency: 0.1,
      speed: 0.1,
    },
  },
  {
    id: "marketer",
    name: "Marketer",
    description:
      "Tests AI-driven content creation, audience targeting, and campaign optimization skills.",
    focusDimensions: ["promptQuality", "responseQuality", "speed"],
    questionTags: [
      "prompt-engineering",
      "context-awareness",
      "output-evaluation",
      "specificity",
      "structured-output",
    ],
    recommendedQuestionCount: 10,
    scoringWeights: {
      promptQuality: 0.25,
      responseQuality: 0.25,
      speed: 0.2,
      efficiency: 0.15,
      iterationIntelligence: 0.15,
    },
  },
  {
    id: "customer-support",
    name: "Customer Support",
    description:
      "Measures ability to use AI for ticket triage, response drafting, and knowledge base management.",
    focusDimensions: ["speed", "responseQuality", "efficiency"],
    questionTags: [
      "prompt-engineering",
      "context-awareness",
      "output-evaluation",
      "tool-orchestration",
    ],
    recommendedQuestionCount: 8,
    scoringWeights: {
      speed: 0.25,
      responseQuality: 0.25,
      efficiency: 0.2,
      promptQuality: 0.2,
      iterationIntelligence: 0.1,
    },
  },
  {
    id: "executive",
    name: "Executive / Leadership",
    description:
      "Evaluates strategic AI literacy — delegation, output evaluation, and decision-making with AI insights.",
    focusDimensions: ["responseQuality", "promptQuality", "efficiency"],
    questionTags: [
      "output-evaluation",
      "context-awareness",
      "prompt-engineering",
      "tool-orchestration",
    ],
    recommendedQuestionCount: 8,
    scoringWeights: {
      responseQuality: 0.3,
      promptQuality: 0.25,
      efficiency: 0.2,
      iterationIntelligence: 0.15,
      speed: 0.1,
    },
  },
  {
    id: "general",
    name: "General",
    description:
      "Balanced assessment across all AI proficiency dimensions. Best for roles without a specific template.",
    focusDimensions: [
      "promptQuality",
      "efficiency",
      "speed",
      "responseQuality",
      "iterationIntelligence",
    ],
    questionTags: [],
    recommendedQuestionCount: 10,
    scoringWeights: {
      promptQuality: 0.25,
      efficiency: 0.2,
      speed: 0.15,
      responseQuality: 0.25,
      iterationIntelligence: 0.15,
    },
  },
];

export function getRoleTemplate(id: string): RoleTemplate | undefined {
  return ROLE_TEMPLATES.find((t) => t.id === id);
}
