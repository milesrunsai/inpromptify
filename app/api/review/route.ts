import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI prompt coaching expert. Analyze this conversation between a user and an AI assistant.

For each USER message (ignore assistant responses), evaluate:
1. Clarity (was the instruction clear?)
2. Context (did they provide enough context?)
3. Format specification (did they tell the AI how to format the output?)
4. Specificity (was it specific or vague?)
5. Efficiency (could they have gotten the same result in fewer messages?)

Return JSON:
{
  "overallScore": 1-10,
  "prompts": [
    {
      "original": "the user's prompt text",
      "score": 1-10,
      "feedback": "one sentence feedback",
      "betterVersion": "rewritten prompt that would get better results"
    }
  ],
  "patterns": ["pattern 1 to improve", "pattern 2", "pattern 3"],
  "summary": "2-3 sentence overall assessment"
}`;

function parseConversation(text: string): string[] {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const userMessages: string[] = [];
  
  // Common patterns for user messages
  const userPrefixes = ['user:', 'human:', 'you:', 'me:', 'prompt:', 'question:'];
  const assistantPrefixes = ['assistant:', 'ai:', 'chatgpt:', 'claude:', 'gpt:', 'response:', 'answer:'];
  
  let currentMessage = '';
  let isUserMessage = false;
  let messageCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Check if this line starts a new message
    const startsWithUser = userPrefixes.some(prefix => lowerLine.startsWith(prefix));
    const startsWithAssistant = assistantPrefixes.some(prefix => lowerLine.startsWith(prefix));
    
    if (startsWithUser || startsWithAssistant) {
      // Save previous message if it was a user message
      if (isUserMessage && currentMessage.trim()) {
        userMessages.push(currentMessage.trim());
      }
      
      // Start new message
      isUserMessage = startsWithUser;
      currentMessage = startsWithUser ? line.replace(/^[^:]+:\s*/, '') : '';
      messageCount++;
    } else if (isUserMessage) {
      // Continue building user message
      currentMessage += (currentMessage ? ' ' : '') + line;
    } else if (!startsWithAssistant && messageCount === 0) {
      // No prefixes found, assume alternating messages starting with user
      if (i % 2 === 0) {
        userMessages.push(line);
      }
    }
  }
  
  // Don't forget the last message
  if (isUserMessage && currentMessage.trim()) {
    userMessages.push(currentMessage.trim());
  }
  
  // If no clear pattern found, try to extract meaningful prompts
  if (userMessages.length === 0) {
    // Look for questions or commands
    const potentialPrompts = lines.filter(line => {
      const l = line.toLowerCase();
      return line.length > 20 && (
        line.includes('?') || 
        l.startsWith('can you') ||
        l.startsWith('please') ||
        l.startsWith('write') ||
        l.startsWith('create') ||
        l.startsWith('explain') ||
        l.startsWith('tell me') ||
        l.startsWith('how to') ||
        l.startsWith('what is')
      );
    });
    
    if (potentialPrompts.length > 0) {
      userMessages.push(...potentialPrompts);
    } else {
      // Last resort: split by common separators and take odd/even
      const segments = text.split(/\n\n|\n---|\n\*\*/).filter(s => s.trim().length > 20);
      if (segments.length >= 2) {
        userMessages.push(segments[0].trim());
        if (segments.length >= 4) {
          userMessages.push(segments[2].trim());
        }
      }
    }
  }
  
  return userMessages;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation } = body;
    
    if (!conversation || typeof conversation !== 'string') {
      return NextResponse.json(
        { error: 'Conversation text is required' },
        { status: 400 }
      );
    }
    
    if (conversation.length < 50) {
      return NextResponse.json(
        { error: 'Conversation too short for meaningful analysis' },
        { status: 400 }
      );
    }
    
    // Parse the conversation to extract user prompts
    const userPrompts = parseConversation(conversation);
    
    if (userPrompts.length === 0) {
      return NextResponse.json(
        { error: 'No user prompts found in conversation' },
        { status: 400 }
      );
    }
    
    // Send to OpenAI for analysis
    const analysisPrompt = `${SYSTEM_PROMPT}

Conversation to analyze:
${conversation}

Extracted user prompts:
${userPrompts.map((prompt, i) => `${i + 1}. ${prompt}`).join('\n')}

Analyze each of these user prompts and provide the JSON response.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.1,
    });
    
    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }
    
    // Try to parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from OpenAI');
      }
    }
    
    // Validate the structure
    if (!analysisResult.overallScore || !analysisResult.prompts || !analysisResult.patterns || !analysisResult.summary) {
      throw new Error('Invalid analysis structure');
    }
    
    return NextResponse.json(analysisResult);
    
  } catch (error) {
    console.error('Review API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze conversation' },
      { status: 500 }
    );
  }
}