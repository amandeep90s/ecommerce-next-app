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

const refundItems: PolicyItem[] = [
  {
    value: 'item-1',
    question: 'What is the return window for E-Store orders?',
    answer:
      'You can return most items within 30 days of the delivery date. Items must be unworn, unwashed, and in their original condition with all tags attached. Returns initiated after 30 days will not be accepted.',
  },
  {
    value: 'item-2',
    question: 'Which items are not eligible for return?',
    answer:
      'Sale items marked as "Final Sale", intimate apparel, swimwear, and accessories are non-returnable for hygiene and safety reasons. Items that show signs of wear, alteration, washing, or damage will also not be accepted.',
  },
  {
    value: 'item-3',
    question: 'How do I initiate a return?',
    answer:
      'Go to "My Orders" in your E-Store account, select the item you want to return, and choose a reason. A prepaid return shipping label will be sent to your registered email. Pack the item securely and drop it off at any designated courier partner location within 5 days.',
  },
  {
    value: 'item-4',
    question: 'How long does it take to receive my refund?',
    answer:
      'Refunds are processed within 3–5 business days after we receive and inspect your return. The amount will reflect in your original payment method within 5–10 business days. E-Store credit is issued within 24 hours of return approval. Cash on Delivery (COD) refunds are transferred to your bank account within 7 business days.',
  },
  {
    value: 'item-5',
    question: 'Can I exchange an item instead of returning it?',
    answer:
      'Yes, size and color exchanges are available for the same product within 14 days of delivery. The replacement item is dispatched once we receive and inspect your original return. If the size you need is out of stock, a full refund will be issued automatically.',
  },
  {
    value: 'item-6',
    question: 'What should I do if I received a damaged or wrong item?',
    answer:
      'Please report damaged, defective, or incorrect items within 48 hours of delivery by contacting our support team. Attach clear photographs of the issue. We will arrange a free pickup and offer a full refund or replacement at no cost to you.',
  },
];

export function RefundPolicyView() {
  return (
    <div className="w-full py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Refund Policy</h2>
          <p className="text-muted-foreground">
            Everything you need to know about returns, refunds, and exchanges at E-Store.
          </p>
        </div>

        <Accordion type="multiple" className="flex flex-col gap-4">
          {refundItems.map((item) => (
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
