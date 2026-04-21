import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Inpromptify — how we collect, use, and protect your data. GDPR and Australian Privacy Act compliant.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <span className="section-label">[ Privacy Policy ]</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-2 text-white leading-tight">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mt-4 leading-relaxed">
          Effective date: April 20, 2026
        </p>

        {/* 1. Introduction */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          1. Introduction
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Inpromptify (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Inpromptify
          platform, an AI literacy assessment and benchmarking service. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your personal information when you visit our
          website and use our services.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          We are committed to protecting your privacy and complying with applicable data protection
          laws, including the European Union General Data Protection Regulation (GDPR) and the
          Australian Privacy Act 1988 (Cth), including the Australian Privacy Principles (APPs).
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          By accessing or using our services, you acknowledge that you have read, understood, and
          agree to be bound by this Privacy Policy. If you do not agree, please discontinue use of
          our services immediately.
        </p>

        {/* 2. Information We Collect */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          2. Information We Collect
        </h2>

        <h3 className="text-lg font-medium text-white mt-6 mb-3">
          2.1 Personal Information
        </h3>
        <p className="text-gray-400 leading-relaxed mb-4">
          When you create an account or use our services, we may collect the following personal
          information through our platform:
        </p>
        <ul className="list-disc list-inside text-gray-400 leading-relaxed mb-4 space-y-2 ml-4">
          <li>Email address</li>
          <li>Full name</li>
          <li>Profile picture (if provided via social login)</li>
          <li>Authentication identifiers</li>
        </ul>

        <h3 className="text-lg font-medium text-white mt-6 mb-3">
          2.2 Assessment Data
        </h3>
        <p className="text-gray-400 leading-relaxed mb-4">
          When you complete assessments on our platform, we collect:
        </p>
        <ul className="list-disc list-inside text-gray-400 leading-relaxed mb-4 space-y-2 ml-4">
          <li>Your responses to assessment questions</li>
          <li>Assessment scores and results (including your PromptScore)</li>
          <li>
            Behavioral signals, including time spent per question, interaction patterns, navigation
            behavior within assessments, and response revision history
          </li>
          <li>Assessment completion status and timestamps</li>
        </ul>

        <h3 className="text-lg font-medium text-white mt-6 mb-3">
          2.3 Technical Data
        </h3>
        <p className="text-gray-400 leading-relaxed mb-4">
          We automatically collect certain technical information when you access our services:
        </p>
        <ul className="list-disc list-inside text-gray-400 leading-relaxed mb-4 space-y-2 ml-4">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device type and operating system</li>
          <li>Referring URL and pages visited</li>
          <li>Session duration and interaction data</li>
          <li>Screen resolution and viewport size</li>
        </ul>

        {/* 3. How We Use Your Information */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          3. How We Use Your Information
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          We use the information we collect for the following purposes:
        </p>
        <ul className="list-disc list-inside text-gray-400 leading-relaxed mb-4 space-y-2 ml-4">
          <li>To provide, maintain, and improve our assessment platform and services</li>
          <li>To create and manage your account and authenticate your identity</li>
          <li>To calculate your PromptScore and generate assessment results</li>
          <li>
            To provide benchmarking data, leaderboard rankings, and comparative analytics
          </li>
          <li>To process payments and manage subscriptions</li>
          <li>
            To analyze usage patterns and behavioral signals to improve assessment accuracy and
            platform performance
          </li>
          <li>To send transactional communications related to your account or assessments</li>
          <li>To detect, prevent, and address fraud, abuse, or technical issues</li>
          <li>To comply with legal obligations and enforce our terms of service</li>
        </ul>

        {/* 4. Cookies and Tracking */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          4. Cookies and Tracking
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          We use cookies and similar tracking technologies to operate and improve our platform.
        </p>

        <h3 className="text-lg font-medium text-white mt-6 mb-3">
          4.1 Essential Cookies
        </h3>
        <p className="text-gray-400 leading-relaxed mb-4">
          These cookies are strictly necessary for the operation of our platform. They include
          session cookies for authentication and cookies required to maintain
          your preferences and security tokens. These cannot be disabled without impairing core
          functionality.
        </p>

        <h3 className="text-lg font-medium text-white mt-6 mb-3">
          4.2 Analytics Cookies (PostHog)
        </h3>
        <p className="text-gray-400 leading-relaxed mb-4">
          We use PostHog, a product analytics platform, to understand how users interact with our
          services. PostHog collects information such as pages visited, features used, session
          replays, and user flows. This data helps us improve the user experience and identify
          technical issues. PostHog may set cookies to distinguish unique users and sessions.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          You can opt out of analytics tracking by adjusting your browser settings to block
          third-party cookies or by using a browser extension that blocks tracking scripts.
        </p>

        {/* 5. Third-Party Services */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          5. Third-Party Services
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          We rely on trusted third-party service providers to operate our platform. Each provider
          has access only to the information necessary to perform their specific function:
        </p>

        <div className="space-y-4 mt-4">
          <div className="border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Stripe — Payments</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Handles all payment processing and subscription management. We do not store your
              credit card details directly. Stripe processes your payment information, billing
              address, and transaction data in accordance with PCI DSS standards.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Neon — Database</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Provides our serverless PostgreSQL database infrastructure. All user data, assessment
              responses, and scores are stored in Neon-hosted databases. Data is encrypted at rest
              and in transit.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">PostHog — Analytics</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Collects anonymized usage analytics, feature interaction data, and session recordings
              to help us improve the platform experience. PostHog processes technical data and user
              interaction patterns.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Sentry — Error Tracking</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Monitors application errors and performance issues. Sentry may receive technical data
              such as stack traces, browser information, and limited contextual data when errors
              occur, to help us diagnose and fix issues quickly.
            </p>
          </div>
        </div>

        {/* 6. Data Sharing and Disclosure */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          6. Data Sharing and Disclosure
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          We do not sell your personal information to third parties. We may share your information
          only in the following circumstances:
        </p>
        <ul className="list-disc list-inside text-gray-400 leading-relaxed mb-4 space-y-2 ml-4">
          <li>
            <span className="text-white font-medium">Service providers:</span> With the third-party
            services listed above, strictly for the purposes described.
          </li>
          <li>
            <span className="text-white font-medium">Organizational accounts:</span> If you take an
            assessment through an employer or organization, your assessment results and scores may be
            shared with the hiring manager or administrator who invited you, in accordance with the
            visibility settings configured for that assessment.
          </li>
          <li>
            <span className="text-white font-medium">Public leaderboards:</span> If you opt in or
            your assessment is configured as public, your name and PromptScore may appear on public
            leaderboards.
          </li>
          <li>
            <span className="text-white font-medium">Legal requirements:</span> When required by
            law, regulation, legal process, or governmental request.
          </li>
          <li>
            <span className="text-white font-medium">Business transfers:</span> In connection with a
            merger, acquisition, or sale of assets, your data may be transferred as part of that
            transaction.
          </li>
          <li>
            <span className="text-white font-medium">Aggregated data:</span> We may share
            anonymized, aggregated data that cannot identify you individually for research,
            benchmarking, or industry reporting purposes.
          </li>
        </ul>

        {/* 7. Data Retention */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          7. Data Retention
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          We retain your personal information for as long as your account is active or as needed to
          provide you with our services. Specifically:
        </p>
        <ul className="list-disc list-inside text-gray-400 leading-relaxed mb-4 space-y-2 ml-4">
          <li>
            <span className="text-white font-medium">Account data:</span> Retained for the lifetime
            of your account. Upon account deletion, personal information is removed within 30 days.
          </li>
          <li>
            <span className="text-white font-medium">Assessment data:</span> Assessment responses,
            scores, and behavioral signals are retained for as long as your account exists. Upon
            deletion request, this data is permanently erased within 30 days.
          </li>
          <li>
            <span className="text-white font-medium">Analytics data:</span> PostHog analytics data
            is retained in accordance with PostHog&apos;s data retention policies and our configured
            retention periods.
          </li>
          <li>
            <span className="text-white font-medium">Payment records:</span> Transaction records may
            be retained for up to 7 years to comply with tax and accounting obligations.
          </li>
          <li>
            <span className="text-white font-medium">Error logs:</span> Sentry error logs are
            retained for up to 90 days.
          </li>
        </ul>
        <p className="text-gray-400 leading-relaxed mb-4">
          When data is no longer required, it is securely deleted or anonymized so that it can no
          longer be associated with you.
        </p>

        {/* 8. Your Rights */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          8. Your Rights
        </h2>

        <h3 className="text-lg font-medium text-white mt-6 mb-3">
          8.1 Rights Under the GDPR (EEA Residents)
        </h3>
        <p className="text-gray-400 leading-relaxed mb-4">
          If you are located in the European Economic Area (EEA), you have the following rights
          under the General Data Protection Regulation:
        </p>
        <ul className="list-disc list-inside text-gray-400 leading-relaxed mb-4 space-y-2 ml-4">
          <li>
            <span className="text-white font-medium">Right of access:</span> Request a copy of the
            personal data we hold about you.
          </li>
          <li>
            <span className="text-white font-medium">Right to rectification:</span> Request
            correction of inaccurate or incomplete personal data.
          </li>
          <li>
            <span className="text-white font-medium">Right to erasure:</span> Request deletion of
            your personal data where there is no compelling reason for continued processing.
          </li>
          <li>
            <span className="text-white font-medium">Right to data portability:</span> Request a
            machine-readable copy of your personal data to transfer to another service.
          </li>
          <li>
            <span className="text-white font-medium">Right to restrict processing:</span> Request
            that we limit the processing of your personal data in certain circumstances.
          </li>
          <li>
            <span className="text-white font-medium">Right to object:</span> Object to the
            processing of your personal data for direct marketing or where processing is based on
            legitimate interests.
          </li>
          <li>
            <span className="text-white font-medium">Right to withdraw consent:</span> Where
            processing is based on consent, you may withdraw that consent at any time.
          </li>
        </ul>
        <p className="text-gray-400 leading-relaxed mb-4">
          To exercise any of these rights, please contact us at{" "}
          <a
            href="mailto:privacy@inpromptify.com"
            className="text-white underline hover:text-gray-300"
          >
            privacy@inpromptify.com
          </a>
          . We will respond to your request within 30 days. You also have the right to lodge a
          complaint with your local data protection supervisory authority.
        </p>

        <h3 className="text-lg font-medium text-white mt-6 mb-3">
          8.2 Rights Under the Australian Privacy Act
        </h3>
        <p className="text-gray-400 leading-relaxed mb-4">
          If you are located in Australia, the Australian Privacy Act 1988 and the Australian
          Privacy Principles (APPs) provide you with the following rights:
        </p>
        <ul className="list-disc list-inside text-gray-400 leading-relaxed mb-4 space-y-2 ml-4">
          <li>
            <span className="text-white font-medium">Access:</span> You may request access to the
            personal information we hold about you (APP 12).
          </li>
          <li>
            <span className="text-white font-medium">Correction:</span> You may request that we
            correct any personal information that is inaccurate, out of date, incomplete, irrelevant,
            or misleading (APP 13).
          </li>
          <li>
            <span className="text-white font-medium">Complaint:</span> If you believe we have
            breached the APPs, you may lodge a complaint with us or with the Office of the Australian
            Information Commissioner (OAIC).
          </li>
        </ul>

        <h3 className="text-lg font-medium text-white mt-6 mb-3">
          8.3 Data Export
        </h3>
        <p className="text-gray-400 leading-relaxed mb-4">
          All users, regardless of location, may request an export of their personal data, including
          assessment responses, scores, and account information, in a structured, commonly used, and
          machine-readable format. To request a data export, email{" "}
          <a
            href="mailto:privacy@inpromptify.com"
            className="text-white underline hover:text-gray-300"
          >
            privacy@inpromptify.com
          </a>
          .
        </p>

        {/* 9. International Data Transfers */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          9. International Data Transfers
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Inpromptify is operated from Perth, Western Australia. Our third-party service providers
          may process and store data in various countries, including the United States and other
          jurisdictions outside Australia and the EEA.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Where personal data is transferred outside the EEA, we ensure that appropriate safeguards
          are in place, such as Standard Contractual Clauses (SCCs) approved by the European
          Commission, or reliance on the recipient&apos;s certification under an approved framework.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          For transfers of data from Australia, we take reasonable steps to ensure that overseas
          recipients handle personal information in accordance with the Australian Privacy Principles,
          as required under APP 8.
        </p>

        {/* 10. Security Measures */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          10. Security Measures
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          We take the security of your personal information seriously and implement appropriate
          technical and organizational measures to protect it, including:
        </p>
        <ul className="list-disc list-inside text-gray-400 leading-relaxed mb-4 space-y-2 ml-4">
          <li>Encryption of data in transit using TLS/SSL</li>
          <li>Encryption of data at rest in our database infrastructure</li>
          <li>
            Secure authentication with encrypted passwords, httpOnly session cookies, and support
            for multi-factor authentication
          </li>
          <li>Regular security reviews and dependency updates</li>
          <li>
            Payment processing handled entirely by Stripe, a PCI DSS Level 1 certified provider,
            ensuring we never directly store credit card information
          </li>
          <li>Application error monitoring via Sentry to quickly identify and resolve vulnerabilities</li>
          <li>Access to production systems restricted to authorized personnel only</li>
        </ul>
        <p className="text-gray-400 leading-relaxed mb-4">
          While we strive to protect your personal information, no method of transmission over the
          Internet or electronic storage is completely secure. We cannot guarantee absolute security,
          but we are committed to continually improving our security practices.
        </p>

        {/* 11. Children's Privacy */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          11. Children&apos;s Privacy
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Our services are not intended for individuals under the age of 16. We do not knowingly
          collect personal information from children under 16. If we become aware that we have
          inadvertently collected personal information from a child under 16, we will take steps to
          delete that information as soon as possible.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          If you are a parent or guardian and believe that your child has provided us with personal
          information, please contact us at{" "}
          <a
            href="mailto:privacy@inpromptify.com"
            className="text-white underline hover:text-gray-300"
          >
            privacy@inpromptify.com
          </a>{" "}
          so that we can take appropriate action.
        </p>

        {/* 12. Changes to This Policy */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          12. Changes to This Policy
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          We may update this Privacy Policy from time to time to reflect changes in our practices,
          technology, legal requirements, or other factors. When we make material changes, we will
          notify you by updating the effective date at the top of this page and, where appropriate,
          providing additional notice via email or an in-app notification.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          We encourage you to review this Privacy Policy periodically to stay informed about how we
          protect your information.
        </p>

        {/* 13. Contact Information */}
        <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
          13. Contact Information
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data
          practices, please contact us:
        </p>
        <div className="border border-white/10 rounded-lg p-6 mt-4">
          <p className="text-white font-medium">Miles Cass</p>
          <p className="text-gray-400 mt-1">Inpromptify</p>
          <p className="text-gray-400">Perth, Western Australia</p>
          <p className="text-gray-400 mt-2">
            Email:{" "}
            <a
              href="mailto:privacy@inpromptify.com"
              className="text-white underline hover:text-gray-300"
            >
              privacy@inpromptify.com
            </a>
          </p>
        </div>
        <p className="text-gray-400 leading-relaxed mt-6 mb-4">
          We aim to respond to all privacy-related inquiries within 30 days of receipt.
        </p>
      </div>
    </div>
  );
}
