import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import PolicySection from '@/components/legal/PolicySection';

const tocItems = [
  { id: 'acceptance', label: '1. Acceptance of Terms' },
  { id: 'eligibility', label: '2. Eligibility & Accounts' },
  { id: 'license', label: '3. License & IP Rights' },
  { id: 'conduct', label: '4. Acceptable Use' },
  { id: 'liability', label: '5. Limitation of Liability' },
  { id: 'termination', label: '6. Termination' },
  { id: 'disputes', label: '7. Dispute Resolution' },
  { id: 'contact', label: '8. Contact Information' },
];

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalPageLayout 
      title="Terms of Service" 
      lastUpdated="December 18, 2025" 
      tocItems={tocItems}
    >
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="text-slate-400 hover:text-white hover:bg-slate-800">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </div>
      <div className="text-xl text-slate-400 mb-10 leading-relaxed border-l-4 border-[#BFFF00] pl-6 py-2 bg-[#1E293B]/30 rounded-r-lg">
        Please read these Terms carefully before using Petrolord NextGen. These terms govern your access to and use of our academic and enterprise software suite.
      </div>

      <PolicySection id="acceptance" title="1. Acceptance of Terms">
        <p>
          By accessing or using the Petrolord NextGen website and services (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
        </p>
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
      </PolicySection>

      <PolicySection id="eligibility" title="2. Eligibility & Accounts">
        <p>
          To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>You must be at least 18 years old or have reached the age of majority in your jurisdiction.</li>
          <li>You are responsible for safeguarding your password and for all activities that occur under your account.</li>
          <li>You agree not to disclose your password to any third party.</li>
          <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
        </ul>
      </PolicySection>

      <PolicySection id="license" title="3. Intellectual Property Rights">
        <p>
          The Service and its original content, features, and functionality are and will remain the exclusive property of Lordsway Energy Limited and its licensors. The Service is protected by copyright, trademark, and other laws of both Nigeria and foreign countries.
        </p>
        <p>
          Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Lordsway Energy Limited.
        </p>
        <h3 className="text-white font-semibold mt-4 mb-2">User License</h3>
        <p>
          Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Service for your personal, non-commercial (academic) or internal business use.
        </p>
      </PolicySection>

      <PolicySection id="conduct" title="4. Acceptable Use Policy">
        <p>You agree not to engage in any of the following prohibited activities:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Copying, distributing, or disclosing any part of the Service in any medium, including without limitation by any automated or non-automated "scraping".</li>
          <li>Using any automated system, including without limitation "robots," "spiders," "offline readers," etc., to access the Service.</li>
          <li>Transmitting spam, chain letters, or other unsolicited email.</li>
          <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service.</li>
          <li>Taking any action that imposes, or may impose at our sole discretion an unreasonable or disproportionately large load on our infrastructure.</li>
          <li>Uploading invalid data, viruses, worms, or other software agents through the Service.</li>
          <li>Collecting or harvesting any personally identifiable information, including account names, from the Service.</li>
          <li>Using the Service for any commercial solicitation purposes without express written consent.</li>
        </ul>
      </PolicySection>

      <PolicySection id="liability" title="5. Limitation of Liability">
        <p>
          In no event shall Lordsway Energy Limited, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Your access to or use of or inability to access or use the Service;</li>
          <li>Any conduct or content of any third party on the Service;</li>
          <li>Any content obtained from the Service; and</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
        </ul>
      </PolicySection>

      <PolicySection id="termination" title="6. Termination">
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        <p>
          Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact support to request deletion.
        </p>
      </PolicySection>

      <PolicySection id="disputes" title="7. Dispute Resolution">
        <p>
          These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
        </p>
      </PolicySection>

      <PolicySection id="contact" title="8. Contact Information">
        <p>If you have any questions about these Terms, please contact us:</p>
        <div className="mt-4 flex flex-col gap-2">
           <a href="mailto:legal@petrolord.com" className="text-[#BFFF00] hover:underline">legal@petrolord.com</a>
           <span className="text-slate-400">Attn: Legal Department</span>
        </div>
      </PolicySection>
    </LegalPageLayout>
  );
};

export default TermsOfServicePage;