import React from 'react';
import { LegalPage } from '../components/marketing/LegalPage';

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How WRNC handles account information, vehicle build records, photos, documents, and technical information."
      canonicalPath="/privacy"
      updated="September 15, 2026"
      sections={[
        { heading: 'Who operates WRNC', paragraphs: ['WRNC is operated by Swear Like A Sailor, LLC. This policy applies to the WRNC application, wrnc.app, and related WRNC services. Questions about this policy may be sent to support@wrnc.app.'] },
        { heading: 'Information you provide', paragraphs: ['WRNC may process information you provide when creating or using an account, including account identifiers and authentication information; vehicle and build information; activities and maintenance records; notes; photos; documents, receipts, and other attachments; and support communications.'] },
        { heading: 'Technical and service information', paragraphs: ['WRNC and service providers used to operate, secure, diagnose, and improve the service may process technical information such as device or application information, network information, logs, errors, and service-usage events when those functions are active. WRNC is auditing the exact production telemetry used by the V1 mobile binary and will keep this policy and the App Store privacy disclosures aligned with the shipping implementation.'] },
        { heading: 'How information is used', paragraphs: ['WRNC uses information to provide authentication and account access, store and display build records, preserve user-submitted documentation, operate and secure the service, troubleshoot failures, provide support, and improve product reliability.'] },
        { heading: 'Storage and service providers', paragraphs: ['WRNC uses third-party infrastructure and service providers to deliver parts of the service. Production account, authentication, database, and file-storage functions use Supabase. Other infrastructure providers may process limited technical information as necessary to host, deliver, monitor, or secure WRNC. Service providers are used to perform functions for WRNC and are not granted permission by WRNC to use user content for their own advertising.'] },
        { heading: 'Sharing and sale of personal information', paragraphs: ['WRNC does not sell user build records, photos, documents, or account information. Information may be disclosed to service providers that operate WRNC, when required by law or valid legal process, to protect the rights or security of WRNC or its users, or in connection with a business transaction subject to applicable law.'] },
        { heading: 'Retention and deletion', paragraphs: ['WRNC retains account and user-generated information while needed to provide the service and for legitimate security, legal, backup, and operational purposes. WRNC is implementing an in-app account-deletion workflow for its App Store release path. Deletion requests and questions may also be sent to support@wrnc.app. Some information may be retained where required by law, necessary to resolve disputes, prevent abuse, enforce agreements, or maintain security and backup integrity.'] },
        { heading: 'Your choices', paragraphs: ['You may choose what vehicle and build information you add to WRNC and may contact support@wrnc.app regarding access, correction, or deletion questions. Device-level permissions for photos, files, and similar resources can be managed through the operating system where supported.'] },
        { heading: 'Children', paragraphs: ['WRNC is not directed to children under 13. WRNC does not knowingly seek personal information from children under 13. If you believe a child has provided personal information to WRNC, contact support@wrnc.app.'] },
        { heading: 'Security', paragraphs: ['WRNC uses administrative and technical safeguards intended to protect information. No storage or transmission system can be guaranteed to be completely secure. Users are responsible for protecting their account credentials.'] },
        { heading: 'Changes to this policy', paragraphs: ['WRNC may update this policy as the service changes or legal requirements evolve. The effective date on this page will be updated when changes are published. Material changes may also be communicated through the service when appropriate.'] },
      ]}
    />
  );
}
