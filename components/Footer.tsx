import { Twitter, Linkedin, Github, Facebook, Instagram } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl flex flex-col items-center space-y-8">
        {/* Logo and Company Name */}
        <div className="flex items-center gap-2">
          {/* <Image
            src={}
            alt="DevStudio Logo"
            width={34}
            height={34}
            className="text-white"
          /> */}
          <span className="text-lg font-semibold text-white">Dev Events</span>
        </div>

        {/* Navigation Links */}

        {/* Separator Line */}
        <div className="w-full border-t border-dashed border-gray-700 pt-8" />

        {/* Copyright and Social Media */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between text-sm">
          <p className="mb-4 md:mb-0">© {"Dev Events"}</p>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/abdessalam-chaabani-42050b336/"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5" />
            </a>

            <a
              href="https://github.com/Sonabdou04"
              aria-label="GitHub"
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
