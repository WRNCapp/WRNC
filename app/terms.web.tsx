import React from 'react';
import { LegalPage } from '../components/marketing/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="These terms govern your access to and use of the WRNC app and website."
      updated="September 11, 2026"
      sections={[
        {
          heading: 'Using WRNC',
          paragraphs: [
            'You must provide accurate account information, protect your login credentials, and use WRNC only for lawful purposes. You are responsible for activity under your account and for the vehicle information and files you upload.',
          ],
        },
        {
          heading: 'Your content',
          paragraphs: [
            'You retain ownership of the vehicle records, photos, documents, and other content you add. You grant WRNC a limited license to host, process, back up, and display that content only as needed to operate and improve the service. You must have the right to upload your content.',
          ],
        },
        {
          heading: 'Acceptable use',
          paragraphs: [
            'Do not misuse WRNC, interfere with its operation, attempt unauthorized access, upload malicious or unlawful material, infringe another person’s rights, or use the service to facilitate fraud or illegal activity.',
          ],
        },
        {
          heading: 'Service availability',
          paragraphs: [
            'WRNC may change, suspend, or discontinue features and may perform maintenance without notice. Keep independent copies of records you cannot afford to lose. WRNC is a documentation tool and does not replace professional mechanical, legal, insurance, title, or safety advice.',
          ],
        },
        {
          heading: 'Termination and disclaimers',
          paragraphs: [
            'You may stop using WRNC or delete your account at any time. We may restrict or terminate access when these terms are violated or when necessary to protect WRNC or others.',
            'To the extent permitted by law, WRNC is provided “as is” without warranties of uninterrupted or error-free operation. Swear Like A Sailor, LLC is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of WRNC.',
          ],
        },
        {
          heading: 'Governing terms and updates',
          paragraphs: [
            'These terms and any additional terms presented in WRNC form the agreement between you and Swear Like A Sailor, LLC regarding the service. We may update these terms, and continued use after an update means you accept the revised terms.',
          ],
        },
      ]}
    />
  );
}
