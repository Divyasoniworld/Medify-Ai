import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'

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
      <main  className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8 overflow-hidden">
        <div className="w-full max-w-xl">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that match the other
                componentsaesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It s animated by default, but you can disable it if you
                prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  )
}

export default Faq
