import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  return (
    <footer className="border-t border-gray-200 py-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4">
            <Link href={"/"} className="text-xl font-bold" scroll={false}>
              RENTIFUL
            </Link>
          </div>
          <nav className="mb-4">
            <ul className="flex space-x-6">
              <li>
                <Link href={"/about"}>About Us</Link>
              </li>
              <li>
                <Link href={"/contact"}>Contact Us</Link>
              </li>
              <li>
                <Link href={"/faq"}>FAQ</Link>
              </li>
              <li>
                <Link href={"/terms"}>Terms</Link>
              </li>
              <li>
                <Link href={"/privacy"}>Privacy</Link>
              </li>
            </ul>
          </nav>
          <div className="flex space-x-4 mb-4">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-primary-600"
            >
              <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-primary-600"
            >
              <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="Linkedin"
              className="hover:text-primary-600"
            >
              <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Youtube" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm to-gray-500 flex justify-center space-x-4">
          <span>
            &copy; RENTiful. All rights reserved. {new Date().getFullYear()}
          </span>
          <Link href={"/privacy"}>Privacy Policy</Link>
          <Link href={"/terms"}>Terms of Service</Link>
          <Link href={"/cookies"}>Cookies Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
