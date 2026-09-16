import React from 'react';
import { LegalPage } from '../components/marketing/LegalPage';

export default function SupportPage() {
  return (
    <LegalPage
      title="Support"
      description="Help with your WRNC account, Garage, vehicle records, activities, documents, and Build Passport."
      canonicalPath="/support"
      updated="September 15, 2026"
      sections={[
        { heading: 'Contact WRNC Support', paragraphs: ['Email support@wrnc.app. Include the email address associated with your WRNC account and a concise description of the issue. Do not send passwords, authentication codes, or other secrets.'] },
        { heading: 'Account access', paragraphs: ['For sign-in or account-access problems, contact support@wrnc.app. WRNC may ask for information needed to verify the account before making account-level changes.'] },
        { heading: 'Account deletion', paragraphs: ['WRNC is adding an in-app account-deletion workflow for the App Store release path. Until that workflow is available in the shipping app, deletion questions may be directed to support@wrnc.app. The public Privacy Policy describes the categories of information affected by deletion and any information that may need to be retained for legal, security, or operational reasons.'] },
        { heading: 'Build records and attachments', paragraphs: ['For problems involving vehicles, activities, photos, documents, or Build Passport records, identify the affected vehicle and the action you were attempting when the issue occurred.'] },
        { heading: 'Response channel', paragraphs: ['WRNC support is provided by email at support@wrnc.app. Support availability and response times may vary during the V1 launch period.'] },
      ]}
    />
  );
}
