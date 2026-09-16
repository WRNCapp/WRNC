import React from 'react';
import { LegalPage } from '../components/marketing/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="Terms governing access to and use of WRNC."
      canonicalPath="/terms"
      updated="September 15, 2026"
      sections={[
        { heading: 'Agreement', paragraphs: ['These Terms of Use govern access to WRNC, operated by Swear Like A Sailor, LLC. By creating an account or using WRNC, you agree to these terms. If you do not agree, do not use the service.'] },
        { heading: 'Your account', paragraphs: ['You are responsible for providing accurate account information, protecting your credentials, and activity conducted through your account. Notify support@wrnc.app if you believe your account has been compromised.'] },
        { heading: 'Your content', paragraphs: ['You retain ownership of vehicle records, photos, documents, notes, and other content you submit to WRNC. You grant WRNC the limited rights necessary to host, store, process, reproduce, and display that content for the purpose of operating and providing the service to you.'] },
        { heading: 'Acceptable use', paragraphs: ['Do not use WRNC to violate law, infringe another person’s rights, distribute malicious material, interfere with the service, attempt unauthorized access, or upload content you do not have the right to use.'] },
        { heading: 'Automotive information', paragraphs: ['WRNC is a documentation and organization platform for automotive builders. Information stored in or presented through WRNC is not a substitute for professional mechanical, safety, engineering, legal, insurance, valuation, or regulatory advice. Users remain responsible for verifying work, parts, procedures, vehicle condition, and legal compliance.'] },
        { heading: 'Service availability and changes', paragraphs: ['WRNC may change, suspend, or discontinue features as the product develops. WRNC does not guarantee uninterrupted or error-free availability. Planned changes will be managed with the goal of preserving durable user build records.'] },
        { heading: 'Termination and deletion', paragraphs: ['You may stop using WRNC at any time. WRNC may restrict or terminate access for misuse, security threats, or material violations of these terms. Account deletion is subject to the retention and deletion provisions described in the Privacy Policy.'] },
        { heading: 'Disclaimers and limitation', paragraphs: ['WRNC is provided on an “as available” basis to the extent permitted by law. Swear Like A Sailor, LLC disclaims warranties that cannot be reasonably made for an evolving software service. To the maximum extent permitted by applicable law, WRNC and Swear Like A Sailor, LLC will not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the service. Nothing in these terms limits rights or liabilities that cannot legally be limited.'] },
        { heading: 'Changes to these terms', paragraphs: ['These terms may be updated as WRNC evolves. The effective date on this page identifies the current version. Continued use after an update takes effect constitutes acceptance where permitted by law.'] },
        { heading: 'Contact', paragraphs: ['Questions about these terms may be sent to support@wrnc.app.'] },
      ]}
    />
  );
}
