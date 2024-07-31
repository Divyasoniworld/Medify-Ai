import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Faq = () => {
  return (
    <div id='faq-section' className="flex md:min-h-screen w-full flex-col">
      <header className="p-4">
        <Link href="/" aria-label="Go home">
          <ArrowLeft size={24} className="hover:text-gray-700" />
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-start gap-4 p-4 md:gap-8 md:p-8 overflow-hidden">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold text-center mb-4">Frequently Asked Questions</h1>
          <Accordion className='px-3 overflow-y-auto custom-scrollbar' style={{ maxHeight: 'calc(100vh - 250px)' }} type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>What is MedifyAI?</AccordionTrigger>
              <AccordionContent>
                MedifyAI is an AI assistant that provides general information about medicines, pills, and health-related topics. It helps users understand medicine usage and other health-related queries.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does MedifyAI work?</AccordionTrigger>
              <AccordionContent>
                MedifyAI uses the Gemini API to fetch and display information about various medicines and health topics. Users can upload images of medicines or text to get detailed information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can MedifyAI provide medical advice?</AccordionTrigger>
              <AccordionContent>
                No, MedifyAI does not provide medical advice. It offers general information about medicines and health. Always consult a healthcare professional for medical advice.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is my data safe with MedifyAI?</AccordionTrigger>
              <AccordionContent>
                Yes, MedifyAI prioritizes your privacy and data security. Your information is handled with care and is not shared with third parties.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How can I contact support?</AccordionTrigger>
              <AccordionContent>
                Our team is available to assist you with any issues or questions you may have. Click <a href="mailto:divyasoniworld@gmail.com" className="text-blue-500 underline">here</a> to contact us.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">Can I upload images of medicines to get information?</AccordionTrigger>
              <AccordionContent>
                Yes, you can upload images of medicines to MedifyAI, and it will provide detailed information about the medicine based on the image.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left">What is the difference between "Clear Chat" and "New Chat"?</AccordionTrigger>
              <AccordionContent>
                When you click <strong>Clear Chat</strong>, the current chat messages are cleared, but the MedifyAI remembers your past conversation history. This allows the MedifyAI to continue understanding the context from your previous interactions.
              </AccordionContent>
              <AccordionContent>
                However, when you start a <strong>New Chat</strong>, it clears both the current chat messages and the MedifyAI's past memory of your conversations. This is useful if you want to start a completely fresh conversation with the MedifyAI without any prior context.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>Is MedifyAI free to use?</AccordionTrigger>
              <AccordionContent>
                Yes, MedifyAI is free to use. You can access all its features without any cost.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  );
};

export default Faq;
