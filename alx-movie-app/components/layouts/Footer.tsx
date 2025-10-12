import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <small>&copy; {new Date().getFullYear()} MovieApp</small>
    </footer>
  );
};

export default Footer;
