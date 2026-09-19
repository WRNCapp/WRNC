import { LegalDocumentPage } from '../components/legal/LegalDocumentPage';

const sections = [
  { id: 'acceptance', title: 'Acceptance and Eligibility', placeholder: '[PLACEHOLDER: Founder and Legal must approve assent, eligibility, and age language.]' },
  { id: 'accounts', title: 'Accounts', placeholder: '[PLACEHOLDER: Legal must approve account responsibilities and termination language.]' },
  { id: 'service', title: 'WRNC Service', placeholder: '[PLACEHOLDER: Founder and Legal must approve the service description and availability terms.]' },
  { id: 'content', title: 'User Content', placeholder: '[PLACEHOLDER: Legal must approve ownership, license, prohibited-content, and content-removal language.]' },
  { id: 'disclaimers', title: 'Disclaimers and Liability', placeholder: '[PLACEHOLDER: Legal must draft and approve all warranty, safety, and liability terms.]' },
  { id: 'disputes', title: 'Governing Law and Disputes', placeholder: '[PLACEHOLDER: Legal must approve jurisdiction, venue, arbitration, and class-action language, if any.]' },
  { id: 'contact', title: 'Contact', placeholder: '[PLACEHOLDER: Founder must approve the legal notices contact method and address.]' },
];

export default function TermsPage() {
  return <LegalDocumentPage documentType="terms" sections={sections} title="Terms of Service" />;
}
