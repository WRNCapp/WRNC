import { LegalDocumentPage } from '../components/legal/LegalDocumentPage';

const sections = [
  { id: 'scope', title: 'Scope', placeholder: '[PLACEHOLDER: Founder and Legal must approve scope and covered services.]' },
  { id: 'collection', title: 'Information We Collect', placeholder: '[PLACEHOLDER: Legal must approve the data categories and collection description after reconciliation with production behavior.]' },
  { id: 'use', title: 'How Information Is Used', placeholder: '[PLACEHOLDER: Founder and Legal must approve every stated purpose.]' },
  { id: 'providers', title: 'Service Providers and Disclosures', placeholder: '[PLACEHOLDER: Legal must approve vendor disclosures and sharing language.]' },
  { id: 'retention', title: 'Retention and Deletion', placeholder: '[PLACEHOLDER: Legal must approve retention periods, deletion exceptions, and the account-deletion process.]' },
  { id: 'rights', title: 'Privacy Rights and Choices', placeholder: '[PLACEHOLDER: Legal must approve jurisdiction-specific rights and request procedures.]' },
  { id: 'contact', title: 'Contact', placeholder: '[PLACEHOLDER: Founder must approve the privacy contact method and mailing address, if used.]' },
];

export default function PrivacyPage() {
  return <LegalDocumentPage documentType="privacy" sections={sections} title="Privacy Notice" />;
}
