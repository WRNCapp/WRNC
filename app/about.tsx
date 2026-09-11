import { LegalDocumentPage } from '../components/legal/LegalDocumentPage';

const sections = [
  { id: 'product', title: 'About WRNC', placeholder: '[PLACEHOLDER: Founder must approve the public product and mission description.]' },
  { id: 'operator', title: 'Operator', placeholder: 'WRNC is operated by Swear Like A Sailor, LLC.' },
  { id: 'support', title: 'Support', placeholder: '[PLACEHOLDER: Founder must approve the public support URL and contact method.]' },
  { id: 'legal', title: 'Legal Documents', placeholder: '[PLACEHOLDER: Link the approved Privacy Notice and Terms of Service before launch.]' },
];

export default function AboutPage() {
  return <LegalDocumentPage documentType="about" sections={sections} title="About WRNC" />;
}
