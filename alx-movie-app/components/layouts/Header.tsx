import React from 'react';

export type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title = 'MovieApp' }) => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
