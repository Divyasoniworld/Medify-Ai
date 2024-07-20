// components/Layout.js
import { PageTransition } from 'next-page-transitions';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Layout = ({ children }) => {
  const { asPath } = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [asPath]);

  return (
    <PageTransition
      timeout={300}
      classNames="page-transition"
    >
      {children}
    </PageTransition>
  );
};

export default Layout;
