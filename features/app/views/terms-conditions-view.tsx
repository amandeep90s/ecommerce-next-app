import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type PolicyItem = {
  value: string;
  question: string;
  answer: string;
};

const termsItems: PolicyItem[] = [
  {
    value: 'item-1',
    question: 'Who can use E-Store and what do I agree to by using it?',
    answer:
      'E-Store is available to users who are at least 18 years of age, or who have parental consent. By accessing or using our platform, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please discontinue use immediately. E-Store reserves the right to update these terms at any time, and continued use constitutes acceptance of any changes.',
  },
  {
    value: 'item-2',
    question: 'What are my responsibilities regarding my account?',
    answer:
      'You are responsible for providing accurate and complete information when registering, and for maintaining the security of your account credentials. All activity under your account is your responsibility. If you suspect unauthorized access, notify us immediately at support@estore.com. E-Store will not be liable for losses resulting from failure to protect your login details.',
  },
  {
    value: 'item-3',
    question: 'Can E-Store cancel or modify my order?',
    answer:
      'Yes. E-Store reserves the right to refuse or cancel any order at our sole discretion, including cases of pricing errors, suspected fraud, or product unavailability. Once an order is confirmed and payment is processed, the price is final. Promotional codes and discounts cannot be combined unless explicitly stated.',
  },
  {
    value: 'item-4',
    question: 'Who owns the content on the E-Store platform?',
    answer:
      'All content on E-Store — including logos, product images, text, UI design, and software — is the exclusive property of E-Store Clothing Pvt. Ltd. or its licensors. You may not reproduce, distribute, or create derivative works from any content without explicit written permission. Unauthorized use may result in legal action.',
  },
  {
    value: 'item-5',
    question: 'What conduct is prohibited on E-Store?',
    answer:
      'You agree not to submit false or fraudulent orders, use bots or scrapers to access the platform, post offensive or misleading reviews, attempt unauthorized access to our systems, or resell E-Store products without written authorization. Violations may result in immediate account suspension without notice or refund.',
  },
  {
    value: 'item-6',
    question: "What is E-Store's liability limitation?",
    answer:
      'To the maximum extent permitted by law, E-Store shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our total liability for any claim is limited to the amount you paid for the specific order giving rise to that claim.',
  },
  {
    value: 'item-7',
    question: 'Which laws govern these terms and where are disputes resolved?',
    answer:
      'These Terms & Conditions are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra. We encourage resolving issues through our customer support first. For unresolved disputes exceeding ₹50,000, parties may pursue arbitration under the Arbitration and Conciliation Act, 1996.',
  },
];

export function TermsAndConditionsView() {
  return (
    <div className="w-full py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Terms & Conditions</h2>
          <p className="text-muted-foreground">
            Please read these terms carefully before using the E-Store platform.
          </p>
        </div>

        <Accordion type="multiple" className="flex flex-col gap-4">
          {termsItems.map((item) => (
            <AccordionItem key={item.value} value={item.value} className="rounded-md border!">
              <AccordionTrigger className="cursor-pointer px-4 py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground px-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
