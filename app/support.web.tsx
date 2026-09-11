import React from 'react';
import { LegalPage } from '../components/marketing/LegalPage';

export default function SupportPage() {
  return (
    <LegalPage
      title="WRNC Support"
      description="Get help with your WRNC account, vehicles, activities, documents, or Build Passport."
      updated="September 11, 2026"
      sections={[
        {
          heading: 'Contact support',
          paragraphs: [
            'Email support@wrnc.app with the email address associated with your account, a short description of the issue, and screenshots when helpful. Do not send passwords, payment details, or sensitive vehicle documents by email.',
            'We aim to acknowledge support requests within two business days.',
          ],
        },
        {
          heading: 'Account and data requests',
          paragraphs: [
            'You can permanently delete your WRNC account and associated vehicle data from the Account menu inside the app. If you cannot access the app, email support@wrnc.app from the address associated with your account and request assistance.',
          ],
        },
        {
          heading: 'Before contacting us',
          paragraphs: [
            'Confirm that you are using the latest version of WRNC, that your device has an internet connection, and that you can sign out and sign back in. Include your device model and iOS version when reporting a technical problem.',
          ],
        },
      ]}
    />
  );
}
