import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


const PrivacyPolicy = () => {
  return (
    <div id='privacy-policy-section' className="flex md:min-h-screen w-full flex-col">
      <header className="p-4">
        <Link href="/" aria-label="Go home">
          <ArrowLeft size={24} className="hover:text-gray-700" />
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-start gap-4 p-4 md:gap-8 md:p-8 overflow-hidden">
        <div className="w-full max-w-xl flex-1 " >
          <h1 className="text-2xl font-bold text-center mb-4">Privacy Policy</h1>
          <div className="text-left px-3 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <p className="mb-4">
              Welcome to MedifyAI. We value your privacy and are committed to protecting your personal information. This privacy policy outlines how we handle your data when you use our services.
            </p>
            <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
            <p className="mb-4">
              MedifyAI only collects your email address. We do not collect any other personal information or data.
            </p>
            <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
            <p className="mb-4">
              We use your email address to:
              <ul className="list-disc list-inside ml-4">
                <li>Provide you with updates and information about our services.</li>
                <li>Respond to your inquiries and support requests.</li>
              </ul>
            </p>
            <h2 className="text-xl font-semibold mb-2">Data Security</h2>
            <p className="mb-4">
              We take your data security seriously and implement reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            <h2 className="text-xl font-semibold mb-2">Sharing Your Information</h2>
            <p className="mb-4">
              We do not share your email address with any third parties. Your information is used solely by MedifyAI to enhance your user experience.
            </p>
            <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
            <p className="mb-4">
              You have the right to:
              <ul className="list-disc list-inside ml-4">
                <li>Access the personal information we hold about you.</li>
                <li>Request the correction of inaccurate or incomplete information.</li>
                <li>Request the deletion of your personal information.</li>
              </ul>
            </p>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this privacy policy, please contact us at <a href="mailto:divyasoniworld@gmail.com" className="text-blue-500 underline">divyasoniworld@gmail.com</a>.
            </p>
            <p className="mb-4">
              By using MedifyAI, you agree to the terms of this privacy policy. We may update this policy from time to time, so please review it periodically.
            </p>
            <p className="text-sm text-gray-600">Last updated: [28-07-2024]</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
