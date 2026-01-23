import { ReactNode } from 'react';
// import Navbar from './Navbar';
// import Footer from './Footer';
import Navbar from '../landing-page/Navbar';
import Footer from '../landing-page/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
