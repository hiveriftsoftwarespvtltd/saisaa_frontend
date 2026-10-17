import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, User } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#061A13] text-stone-300 border-t border-[#D4AF37]/25">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Column 1: Brand & Laurel Emblem (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                <img
                  src="/saisaa-logo.jpg"
                  alt="Saisaa"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37] font-semibold">
                SUITS &bull; SAREES &bull; KURTIS
              </p>
              <h4 className="font-serif text-lg text-[#F7E7BE] italic tracking-wide">
                More Than Fashion
              </h4>
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold text-[#F7E7BE] tracking-wider uppercase font-serif">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider text-stone-300">
              <li>
                <Link to="/" className="hover:text-[#F7E7BE] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#F7E7BE] transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/suits" className="hover:text-[#F7E7BE] transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#F7E7BE] transition-colors">Collections</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F7E7BE] transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold text-[#F7E7BE] tracking-wider uppercase font-serif">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider text-stone-300">
              <li>
                <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F7E7BE] transition-colors">Shipping & Delivery</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">Returns & Exchange</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F7E7BE] transition-colors">Size & Fabric Guide</Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#F7E7BE] transition-colors">Track Order</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get In Touch (3 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-semibold text-[#F7E7BE] tracking-wider uppercase font-serif">
              Get In Touch
            </h4>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-[#F7E7BE] font-medium">Pooja Vishwakarma</span>
              </div>

              <a
                href="tel:+919116863306"
                className="flex items-center gap-2.5 hover:text-[#F7E7BE] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+91 9116863306</span>
              </a>

              <a
                href="mailto:pooja.vishwakarma84@gmail.com"
                className="flex items-center gap-2.5 hover:text-[#F7E7BE] transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>pooja.vishwakarma84@gmail.com</span>
              </a>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2 text-[#E8D49E]">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#09231A] transition-all"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#09231A] transition-all"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#09231A] transition-all text-xs font-bold"
                aria-label="Pinterest"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#09231A] transition-all"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-6 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-3">
          <p className="tracking-wide">
            &copy; 2026 Saisaa &bull; More Than Fashion
          </p>
          <div className="flex items-center space-x-4 tracking-wider">
            <Link to="/about" className="hover:text-[#F7E7BE] transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">Terms & Conditions</Link>
            <span>|</span>
            <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
