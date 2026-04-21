"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";

type Phase = "paste" | "results";

interface PromptAnalysis {
  original: string;
  score: number;
  feedback: string;
  betterVersion: string;
}

interface AnalysisResult {
  overallScore: number;
  prompts: PromptAnalysis[];
  patterns: string[];
  summary: string;
}

export default function ReviewPage() {
  const [phase, setPhase] = useState<Phase>("paste");
  const [conversation, setConversation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Rate limiting check
  const checkRateLimit = useCallback((): { allowed: boolean; count: number } => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('inpromptify_review_date');
    const storedCount = parseInt(localStorage.getItem('inpromptify_review_count') || '0');
    
    if (storedDate === today) {
      return { allowed: storedCount < 3, count: storedCount };
    } else {
      // New day, reset count
      localStorage.setItem('inpromptify_review_date', today);
      localStorage.setItem('inpromptify_review_count', '0');
      return { allowed: true, count: 0 };
    }
  }, []);

  const incrementReviewCount = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentCount = parseInt(localStorage.getItem('inpromptify_review_count') || '0');
    localStorage.setItem('inpromptify_review_count', String(currentCount + 1));
    localStorage.setItem('inpromptify_review_date', today);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (conversation.length < 100) return;
    
    // Check rate limit
    const { allowed } = checkRateLimit();
    if (!allowed) {
      setError("You've reached your daily limit of 3 free reviews. Sign up for unlimited access!");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      
      const result = await response.json();
      setResults(result);
      setPhase("results");
      incrementReviewCount();
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze conversation');
    } finally {
      setIsAnalyzing(false);
    }
  }, [conversation, checkRateLimit, incrementReviewCount]);

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }, []);

  const handleReset = useCallback(() => {
    setPhase("paste");
    setConversation("");
    setResults(null);
    setError(null);
    setCopiedIndex(null);
  }, []);

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 6) return "bg-orange-100 text-orange-800 border-orange-200";
    if (score >= 4) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const { count: reviewCount } = checkRateLimit();

  // Paste phase
  if (phase === "paste") {
    return (
      <>
        <style>{`header, nav, footer, [role="banner"], [role="contentinfo"] { display: none !important; }`}</style>
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="w-full max-w-2xl px-6">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Review Your AI Conversation
              </h1>
              <p className="text-gray-600">
                Paste a conversation with ChatGPT, Claude, or any AI. Get instant feedback on your prompting.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <textarea
                  placeholder="Paste your AI conversation here..."
                  value={conversation}
                  onChange={(e) => setConversation(e.target.value)}
                  className="w-full min-h-[300px] px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {conversation.length} characters
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleAnalyze}
                  disabled={conversation.length < 100 || isAnalyzing}
                  className="w-full px-8 py-3.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Conversation"}
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  {reviewCount}/3 free reviews today for non-Pro users
                </p>
              </div>
            </div>
          </div>

          {/* Logo watermark */}
          <img src="/logo.png" alt="" className="fixed bottom-6 left-6 h-5 w-auto opacity-20" />
        </div>
      </>
    );
  }

  // Results phase
  if (phase === "results" && results) {
    return (
      <>
        <style>{`header, nav, footer, [role="banner"], [role="contentinfo"] { display: none !important; }`}</style>
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-16">
            
            {/* Overall Score */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-50 border-4 border-orange-500/20 mb-4">
                <span className="text-3xl font-bold text-orange-500">{results.overallScore}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Prompt Analysis Complete
              </h1>
              <p className="text-gray-600 max-w-md mx-auto">
                {results.summary}
              </p>
            </div>

            {/* Individual Prompts */}
            <div className="space-y-8 mb-12">
              <h2 className="text-lg font-semibold text-gray-900">Your Prompts</h2>
              
              {results.prompts.map((prompt, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 mr-4">
                      <p className="text-sm text-gray-600 mb-2">Original prompt:</p>
                      <p className="text-gray-900 bg-gray-50 rounded-lg p-3 text-sm">
                        {prompt.original.length > 200 
                          ? `${prompt.original.substring(0, 200)}...` 
                          : prompt.original}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getScoreColor(prompt.score)}`}>
                      {prompt.score}/10
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{prompt.feedback}</p>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-green-800">Better version:</p>
                      <button
                        onClick={() => handleCopy(prompt.betterVersion, index)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-green-800 text-sm">{prompt.betterVersion}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Patterns to Improve */}
            <div className="border-t border-gray-100 pt-8 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 3 Patterns to Improve</h3>
              <ul className="space-y-2">
                {results.patterns.map((pattern, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-semibold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Review Another
              </button>
            </div>
          </div>
          
          {/* Logo watermark */}
          <img src="/logo.png" alt="" className="fixed bottom-6 left-6 h-5 w-auto opacity-20" />
        </div>
      </>
    );
  }

  return null;
}