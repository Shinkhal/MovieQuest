import React from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black to-gray-900 text-white py-8 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
        
        <div>
          <h2 className="text-2xl font-bold tracking-wide">MovieQuest</h2>
          <p className="mt-2 text-gray-400 text-sm">
            Your gateway to the world of cinema.
          </p>
        </div>

        <div className="flex justify-center space-x-6">
          <Link
            href="https://github.com/Shinkhal"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-transform duration-300 hover:scale-110"
          >
            <FaGithub size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/shinkhal-sinha/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-transform duration-300 hover:scale-110"
          >
            <FaLinkedin size={24} />
          </Link>
          <Link
            href="mailto:shinkhalsinha@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-transform duration-300 hover:scale-110"
          >
            <HiOutlineMail size={24} />
          </Link>
          <Link
            href="https://www.instagram.com/shinkhal_sinha_/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-transform duration-300 hover:scale-110"
          >
            <FaInstagram size={24} />
          </Link>
        </div>

        <div className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Shinkhal Sinha. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
