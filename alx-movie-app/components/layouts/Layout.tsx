import React from 'react';
import Header from './Header';
import Footer from './Footer';

export type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
