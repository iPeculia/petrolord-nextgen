import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import PolicySection from '@/components/legal/PolicySection';

const tocItems = [
  { id: 'intro', label: '1. Introduction' },
  { id: 'collection', label: '2. Information Collection' },
  { id: 'usage', label: '3. Use of Information' },
  { id: 'security', label: '4. Data Security' },
  { id: 'retention', label: '5. Data Retention' },
  { id: 'sharing', label: '6. Third-Party Sharing' },
  { id: 'rights', label: '7. Your Rights' },
  { id: 'cookies', label: '8. Cookies & Tracking' },
  { id: 'children', label: '9. Children’s Privacy' },
  { id: 'contact', label: '10. Contact Us' },
];

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      lastUpdated="December 18, 2025" 
      tocItems={tocItems}
    >
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="text-slate-400 hover:text-white hover:bg-slate-800">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </div>
      <div className="text-xl text-slate-400 mb-10 leading-relaxed border-l-4 border-[#BFFF00] pl-6 py-2 bg-[#1E293B]/30 rounded-r-lg">
        At Petrolord NextGen, we take your privacy seriously. This document outlines our transparent approach to handling your data while you focus on engineering the future.
      </div>

      <PolicySection id="intro" title="1. Introduction">
        <p>
          Welcome to Petrolord NextGen ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this policy, or our practices with regards to your personal information, please contact us at legal@petrolord.com.
        </p>
        <p>
          When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
        </p>
      </PolicySection>

      <PolicySection id="collection" title="2. Information We Collect">
        <p>We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services, when participating in activities on the Services, or otherwise contacting us.</p>
        
        <h3 className="text-white font-semibold mt-6 mb-2">Personal Information Provided by You</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
          <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
          <li><strong>Academic Data:</strong> University affiliation, department, student ID numbers, and enrollment verification documents.</li>
          <li><strong>Credentials:</strong> Passwords, password hints, and similar security information used for authentication and account access.</li>
        </ul>

        <h3 className="text-white font-semibold mt-6 mb-2">Information Automatically Collected</h3>
        <p>
          We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information.
        </p>
      </PolicySection>

      <PolicySection id="usage" title="3. How We Use Your Information">
        <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>To facilitate account creation and logon process:</strong> If you choose to link your account with us to a third-party account (such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process.</li>
          <li><strong>To send administrative information to you:</strong> We may use your personal information to send you product, service, and new feature information and/or information about changes to our terms, conditions, and policies.</li>
          <li><strong>To fulfill and manage your orders:</strong> We may use your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.</li>
          <li><strong>Request feedback:</strong> We may use your information to request feedback and to contact you about your use of our Services.</li>
          <li><strong>To protect our Services:</strong> We may use your information as part of our efforts to keep our Services safe and secure (for example, for fraud monitoring and prevention).</li>
        </ul>
      </PolicySection>

      <PolicySection id="security" title="4. Data Security & Protection">
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the services within a secure environment.
        </p>
        <p>
          Our security measures include:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Encryption of data in transit (TLS 1.2+) and at rest.</li>
          <li>Strict access controls and authentication mechanisms.</li>
          <li>Regular security audits and vulnerability assessments.</li>
          <li>Secure data centers compliant with ISO 27001 standards.</li>
        </ul>
      </PolicySection>

      <PolicySection id="retention" title="5. Data Retention">
        <p>
          We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
        </p>
        <p>
          When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
        </p>
      </PolicySection>

      <PolicySection id="sharing" title="6. Third-Party Services & Sharing">
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
        <p>We may process or share data based on the following legal basis:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information in a specific purpose.</li>
          <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
          <li><strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>
          <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
        </ul>
        <p className="mt-4 text-[#BFFF00] font-medium">We do not sell your personal data to advertisers or third parties.</p>
      </PolicySection>

      <PolicySection id="rights" title="7. Your User Rights">
        <p>In some regions (like the European Economic Area), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information.</p>
        <p>To make such a request, please use the contact details provided below. We will consider and act upon any request in accordance with applicable data protection laws.</p>
      </PolicySection>

      <PolicySection id="cookies" title="8. Cookies & Tracking">
        <p>
          We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
        </p>
      </PolicySection>

      <PolicySection id="children" title="9. Children's Privacy">
        <p>
          We do not knowingly solicit data from or market to children under 13 years of age. By using the Services, you represent that you are at least 13 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 13 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records.
        </p>
      </PolicySection>

      <PolicySection id="contact" title="10. Contact Us">
        <p>If you have questions or comments about this policy, you may email us at <a href="mailto:privacy@petrolord.com" className="text-[#BFFF00] hover:underline">privacy@petrolord.com</a> or by post to:</p>
        <address className="mt-4 not-italic bg-slate-800 p-6 rounded-lg border border-slate-700">
          <strong className="text-white block mb-2">Lordsway Energy Limited</strong>
          Data Protection Officer<br />
          8 The Providence Street<br />
          Lekki Phase 1, Lagos<br />
          Nigeria
        </address>
      </PolicySection>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;