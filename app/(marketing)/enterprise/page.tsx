import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Enterprise AI Skills Assessment & Training Platform",
  description: "Comprehensive AI competency assessment and training solutions for enterprise. Screen candidates, assess workforce skills, and develop AI capabilities across your organization.",
  keywords: "enterprise AI assessment, AI skills testing, workforce AI training, AI competency platform, AI hiring assessment, enterprise AI solutions",
};

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Enterprise AI Competency Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Assess, develop, and certify AI skills across your organization. 
            From hiring the right talent to upskilling your workforce.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg hover:bg-orange-600"
            >
              Schedule Demo
            </Link>
            <Link 
              href="/assess"
              className="border border-gray-300 text-gray-900 px-8 py-4 rounded-lg text-lg hover:bg-gray-50"
            >
              Try Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Enterprise AI Challenge</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Hiring Challenges</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 66% won't hire without AI skills</li>
                <li>• $50K+ cost per bad AI hire</li>
                <li>• No standardized assessment methods</li>
                <li>• 6-month average time-to-productivity</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Workforce Gaps</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 78% lack functional AI literacy</li>
                <li>• Fragmented training approaches</li>
                <li>• No measurement of progress</li>
                <li>• Skills become obsolete rapidly</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Competitive Risk</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• AI-first competitors emerging</li>
                <li>• Innovation pipeline stagnation</li>
                <li>• Talent retention challenges</li>
                <li>• Market position erosion</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Complete AI Competency Solution</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Assessment & Hiring</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Standardized AI skills evaluation across 5 competency dimensions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>ATS integration for seamless candidate screening</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Practical scenario testing with real AI tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Bias-free, objective competency measurement</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6">Training & Development</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Personalized learning paths based on assessment results</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Industry-specific AI application training</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>Continuous certification and skill validation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">→</span>
                  <span>ROI tracking and progress analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Proven ROI for Enterprise</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">95%</div>
              <div className="text-gray-300">Reduction in mis-hires</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">60%</div>
              <div className="text-gray-300">Faster time-to-productivity</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">300%</div>
              <div className="text-gray-300">Training ROI improvement</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">$2M+</div>
              <div className="text-gray-300">Average annual savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your AI Capabilities?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join leading enterprises who are building AI-competitive workforces with InpromptiFy
          </p>
          <Link 
            href="/contact"
            className="bg-orange-500 text-white px-12 py-4 rounded-lg text-xl hover:bg-orange-600"
          >
            Get Enterprise Demo
          </Link>
        </div>
      </section>
    </div>
  );
}