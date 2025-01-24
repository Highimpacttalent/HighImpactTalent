import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="w-full px-14 py-6 bg-white rounded-lg ">
      <h1 className="text-3xl font-bold w-full mb-4 text-[#1176DB]">Privacy Policy</h1>
      <p className="mb-4">
      High Impact Talent ("we," "us," "our") is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website [www.highimpacttalent.com].
      </p>
      
      <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Personal Data: Name, email address, phone number, job title, and other contact details.</li>
        <li>Usage Data: Information on how you interact with our website, including IP address, browser type, and pages visited.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
      {/* <p className="mb-4">
        We use the information we collect about you in the following ways:
      </p> */}
      <ul className="list-disc list-inside mb-4">
        <li>To Provide Services: Facilitate job applications, post job listings, and match candidates with employers</li>
        <li>To Improve Our Services: Analyze usage data to enhance user experience and website functionality.</li>
        <li>To Communicate: Send newsletters, updates, and promotional materials related to our services.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-2">3. How We Share Your Information</h2>
      {/* <p className="mb-4">
        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
      </p> */}
      <ul className="list-disc list-inside mb-4">
        <li>With Employers: Share candidate information with potential employers for job matching purposes.</li>
        <li>With Service Providers: Share data with third-party service providers who assist us in operating our website and providing services.</li>
        <li>As Required by Law: Disclose information if required by law or to protect our rights and safety.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-2">4. Security</h2>
      <p className="mb-4">
      We implement appropriate security measures to protect your data from unauthorized access, alteration, and disclosure. However, no method of transmission over the internet or electronic storage is 100% secure.
      </p>
      
      <h2 className="text-2xl font-semibold mb-2">5. Your Rights:</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Access: Request access to your personal data.</li>
        <li>Correction: Request correction of any inaccurate or incomplete data.</li>
        <li>Deletion: Request deletion of your personal data.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-2">6. Changes to This Policy</h2>
      <p className="mb-4">
      We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>
      
      <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
      <p>
      If you have any questions about this Privacy Policy, please contact us at highimpacttalentenquiry@gmail.com
      </p>
    </div>
  );
};

export default PrivacyPolicy;
