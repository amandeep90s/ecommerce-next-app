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

const shippingItems: PolicyItem[] = [
  {
    value: 'item-1',
    question: 'What are the available shipping options?',
    answer:
      'We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Overnight Delivery (next business day, where available). Shipping options and estimated delivery times are displayed at checkout based on your delivery address.',
  },
  {
    value: 'item-2',
    question: 'How much does shipping cost?',
    answer:
      'Standard shipping is free on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹49 applies. Express and overnight options are charged separately and displayed at checkout. Remote or rural areas may incur additional charges.',
  },
  {
    value: 'item-3',
    question: 'Which areas do you deliver to?',
    answer:
      'We deliver to all major cities and towns across India. Delivery to remote pin codes may take additional time. Enter your pin code at checkout to confirm availability and estimated delivery time for your location.',
  },
  {
    value: 'item-4',
    question: 'How can I track my order?',
    answer:
      'Once your order is shipped, you will receive a confirmation email and SMS with a tracking number and a link to the courier\'s tracking page. You can also track your order at any time from the "My Orders" section in your account dashboard.',
  },
  {
    value: 'item-5',
    question: 'What happens if my order is delayed?',
    answer:
      'While we strive to deliver within the estimated timeframe, delays can occasionally occur due to weather conditions, public holidays, or high order volumes. If your order is significantly delayed beyond the promised date, please contact our support team at support@estore.com and we will investigate immediately.',
  },
  {
    value: 'item-6',
    question: 'Can I change my delivery address after placing an order?',
    answer:
      'Address changes can be made only before the order is dispatched. To request a change, contact our support team as soon as possible with your order ID. Once the shipment is handed to the courier, address modifications are no longer possible.',
  },
  {
    value: 'item-7',
    question: 'What if my package arrives damaged or is lost in transit?',
    answer:
      'If your package arrives damaged, please photograph the item and packaging immediately and report it within 48 hours at support@estore.com. For lost shipments, we will file a claim with the courier on your behalf and either re-ship the order or issue a full refund after investigation.',
  },
];

export function ShippingPolicyView() {
  return (
    <div className="w-full py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Shipping Policy</h2>
          <p className="text-muted-foreground">
            Everything you need to know about how E-Store ships and delivers your orders.
          </p>
        </div>

        <Accordion type="multiple" className="flex flex-col gap-4">
          {shippingItems.map((item) => (
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
