import React from 'react';
import { LegalPage } from '../components/marketing/LegalPage';

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy explains how WRNC collects, uses, stores, and protects information when you use the WRNC app and website."
      updated="September 11, 2026"
      sections={[
        {
          heading: 'Information you provide',
          paragraphs: [
            'We collect the email address and authentication information needed to create and secure your account. We also store the vehicle details, activity records, notes, mileage, photos, receipts, and documents that you choose to add to WRNC.',
          ],
        },
        {
          heading: 'How we use information',
          paragraphs: [
            'We use this information to operate WRNC, display your vehicle history and Build Passport, secure your account, respond to support requests, diagnose problems, and improve the service. We do not sell your personal information.',
          ],
        },
        {
          heading: 'Service providers and analytics',
          paragraphs: [
            'WRNC uses service providers for authentication, database hosting, private file storage, application hosting, and website analytics. These providers process information only to provide their services to WRNC and are subject to their own security and privacy obligations.',
            'Our public website may collect limited technical and referral information, such as pages visited, browser type, referring site, and campaign parameters. The mobile app does not include advertising SDKs.',
          ],
        },
        {
          heading: 'Storage and security',
          paragraphs: [
            'Vehicle records and uploaded files are stored using access controls designed to restrict them to the authenticated account owner. No system is completely secure, so keep your password private and contact us promptly if you believe your account has been compromised.',
          ],
        },
        {
          heading: 'Retention, access, and deletion',
          paragraphs: [
            'We retain account information while your account is active and as reasonably necessary to provide WRNC, meet legal obligations, resolve disputes, and enforce agreements. You may permanently delete your account and associated WRNC records from the Account menu in the app. You may also contact support@wrnc.app to request access, correction, or deletion assistance.',
          ],
        },
        {
          heading: 'Children and changes',
          paragraphs: [
            'WRNC is not directed to children under 13, and we do not knowingly collect personal information from children under 13. We may update this policy as WRNC changes. The revised policy will be posted here with a new effective date.',
          ],
        },
      ]}
    />
  );
}
