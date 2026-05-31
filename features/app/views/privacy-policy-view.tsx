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

const privacyItems: PolicyItem[] = [
  {
    value: 'item-1',
    question: 'What personal information does E-Store collect?',
    answer:
      'We collect information you provide directly, such as your name, email address, phone number, delivery address, and payment details when you register or place an order. We also automatically collect usage data including your IP address, browser type, device identifiers, and browsing behavior on our platform to improve our services.',
  },
  {
    value: 'item-2',
    question: 'How does E-Store use my personal information?',
    answer:
      'Your information is used to process orders, handle payments, and arrange deliveries. We also use it to send order updates and customer support communications, personalize product recommendations, and improve our platform. With your consent, we may send promotional emails and offers, which you can opt out of at any time.',
  },
  {
    value: 'item-3',
    question: 'Does E-Store share my data with third parties?',
    answer:
      'We share your data only with partners necessary to operate our services — including logistics providers (such as Delhivery or Shiprocket) to fulfill your orders, and payment processors (such as Razorpay or PayU) to handle transactions securely. We never sell, rent, or trade your personal information to marketers or data brokers.',
  },
  {
    value: 'item-4',
    question: 'Does E-Store use cookies?',
    answer:
      'Yes, we use cookies and similar tracking technologies to remember your preferences, keep you logged in, and understand how you use our platform. You can disable cookies through your browser settings at any time, though some features of the site may not function properly as a result.',
  },
  {
    value: 'item-5',
    question: 'How can I access, update, or delete my personal data?',
    answer:
      'You can update your personal information at any time from your account settings. To request deletion of your account and associated data, contact us at privacy@estore.com. Please note that some data may be retained as required by applicable law or for legitimate business purposes such as fraud prevention.',
  },
  {
    value: 'item-6',
    question: 'How does E-Store protect my data?',
    answer:
      "We use industry-standard security measures including TLS encryption for data in transit and AES-256 encryption for data at rest. Access to personal data is restricted to authorized personnel only. In the unlikely event of a data breach, affected users will be notified within 72 hours. E-Store complies with India's Digital Personal Data Protection Act (DPDPA) 2023.",
  },
];

export function PrivacyPolicyView() {
  return (
    <div className="w-full py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Privacy Policy</h2>
          <p className="text-muted-foreground">
            How E-Store collects, uses, and protects your personal information.
          </p>
        </div>

        <Accordion type="multiple" className="flex flex-col gap-4">
          {privacyItems.map((item) => (
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
