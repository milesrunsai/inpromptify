import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Hiring Assessment Tool | Screen AI Skills for Technical Roles",
  description: "Advanced AI hiring assessment platform for screening prompt engineering, model selection, and AI implementation skills. Reduce mis-hires by 95% with standardized AI competency testing.",
  keywords: "AI hiring assessment, AI skills test, prompt engineering assessment, AI technical interview, AI competency screening, AI talent evaluation",
};

export default function AIHiringAssessmentPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AI Hiring Assessment Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Screen AI skills with confidence. Our standardized assessment evaluates 
              prompt engineering, model selection, and practical AI implementation abilities.
            </p>
            <Link 
              href="/assess"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg hover:bg-orange-600 mr-4"
            >
              Try Live Demo
            </Link>
            <Link 
              href="/contact"
              className="border border-gray-300 text-gray-900 px-8 py-4 rounded-lg text-lg hover:bg-gray-50"
            >
              Enterprise Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Market Problem */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">The AI Hiring Crisis</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Traditional technical interviews can't assess AI competency. 
              Companies are hiring based on buzzwords, not actual skills.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-red-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-red-800 mb-4">Current Hiring Problems</h3>
              <ul className="space-y-3 text-red-700">
                <li>• 66% of leaders won't hire without AI skills</li>
                <li>• $50,000+ average cost per bad AI hire</li>
                <li>• 6 months average time-to-productivity</li>
                <li>• No standardized way to measure AI competency</li>
                <li>• Candidates can fake basic AI knowledge</li>
                <li>• Traditional coding tests miss AI workflow skills</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">InpromptiFy Solution</h3>
              <ul className="space-y-3 text-green-700">
                <li>• Standardized AI competency measurement</li>
                <li>• 95% reduction in AI hiring mis-matches</li>
                <li>• 60% faster candidate screening process</li>
                <li>• Practical scenario-based testing</li>
                <li>• Anti-cheating measures with text input</li>
                <li>• Real AI tool proficiency evaluation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comprehensive AI Skills Assessment</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Technical Proficiency</h3>
              <p className="text-gray-600 mb-4">
                Evaluate prompt engineering effectiveness, model selection capabilities, 
                and AI tool integration skills.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Prompt optimization techniques</li>
                <li>• Model capability understanding</li>
                <li>• Token management and cost optimization</li>
                <li>• API integration and workflow design</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Strategic Application</h3>
              <p className="text-gray-600 mb-4">
                Test ability to identify AI use cases, assess implementation feasibility, 
                and plan strategic deployments.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Use case identification and scoping</li>
                <li>• ROI assessment capabilities</li>
                <li>• Risk evaluation and mitigation</li>
                <li>• Implementation planning skills</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibent mb-4">Practical Implementation</h3>
              <p className="text-gray-600 mb-4">
                Assess real-world problem-solving with AI tools, debugging capabilities, 
                and workflow optimization skills.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Real scenario problem-solving</li>
                <li>• Debugging and optimization</li>
                <li>• Workflow integration abilities</li>
                <li>• Quality evaluation and testing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Seamless Hiring Integration</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Integrate AI assessments into your existing hiring workflow. 
              Compatible with major ATS platforms and recruiting tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">Candidate Invitation</h3>
              <p className="text-sm text-gray-600">Send assessment links via email or ATS integration</p>
            </div>
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">AI Skills Testing</h3>
              <p className="text-sm text-gray-600">15-minute adaptive assessment with practical scenarios</p>
            </div>
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">Detailed Scoring</h3>
              <p className="text-sm text-gray-600">Comprehensive competency breakdown and recommendations</p>
            </div>
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold mb-2">Hiring Decision</h3>
              <p className="text-sm text-gray-600">Data-driven candidate evaluation and ranking</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Screening AI Skills Today</h2>
          <p className="text-xl mb-8">
            Join companies using InpromptiFy to build AI-competitive teams
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/assess"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600"
            >
              Try Assessment Free
            </Link>
            <Link 
              href="/contact"
              className="border border-gray-300 text-white px-8 py-4 rounded-lg hover:bg-gray-800"
            >
              Enterprise Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}