import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-background py-4 border-t">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-foreground font-bold text-xl">
          Medify<span className='text-[#595bcc]'>AI</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/privacy-policy">
            <Link href="" className="text-foreground hover:text-primary">Privacy Policy</Link>
          </Link>
          <Link href="/faq">
            <Link href="" className="text-foreground hover:text-primary">FAQ</Link>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
