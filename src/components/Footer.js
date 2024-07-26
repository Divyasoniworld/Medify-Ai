import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="border-t bg-background py-4 px-6 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-2 text-lg font-semibold md:justify-start w-full md:w-auto">
                    <Link href="/" className="text-foreground text-2xl font-bold transition-colors hover:text-foreground">
                        Medify<span className="text-[#595bcc]">AI</span>
                    </Link>
                </div>
                <div className="flex flex-row md:flex-row gap-2 md:gap-4 mt-2 md:mt-0 text-center md:text-right w-full md:w-auto">
                    <Link href="/privacy-policy" className="text-foreground text-base transition-colors hover:text-foreground">
                        Privacy Policy
                    </Link>
                    <Link href="/terms-conditions" className="text-foreground text-base transition-colors hover:text-foreground">
                        Terms & Conditions
                    </Link>
                    <Link href="/faq" className="text-foreground text-base transition-colors hover:text-foreground">
                        FAQ
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
