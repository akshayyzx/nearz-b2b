import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-xl mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div>
            <p className="text-gray-500 text-sm">© {currentYear} NearzB2B. All rights reserved.</p>
          </div>

          <div className="flex space-x-4">
            <a href="/privacy" className="text-gray-500 text-sm hover:text-gray-700">Privacy Policy</a>
            <a href="/terms" className="text-gray-500 text-sm hover:text-gray-700">Terms of Service</a>
            <a href="/contact" className="text-gray-500 text-sm hover:text-gray-700">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
