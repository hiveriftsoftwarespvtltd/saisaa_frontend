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
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.25)] shrink-0">
                <img
                  src="/saisaa-logo.jpg"
                  alt="Saisaa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-2xl font-bold tracking-normal text-[#F7E7BE] leading-none group-hover:text-white transition-colors"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Saisaa
                </span>
                <span
                  className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mt-1"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                
                </span>
              </div>
            </Link>

            <div className="space-y-1">
              <h4 className="font-serif text-sm sm:text-base text-[#F7E7BE]/85 italic tracking-wide">
                More Than Fashion &bull; Heritage Atelier
              </h4>
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-semibold text-[#F7E7BE] tracking-wider uppercase font-serif">
              Collections
            </h4>
            <ul className="space-y-3 text-sm tracking-wide text-stone-300">
              <li>
                <Link to="/stitched-suits" className="hover:text-[#F7E7BE] transition-colors">Stitched Suits</Link>
              </li>
              <li>
                <Link to="/unstitched-suits" className="hover:text-[#F7E7BE] transition-colors">Unstitched Suits</Link>
              </li>
              <li>
                <Link to="/sarees" className="hover:text-[#F7E7BE] transition-colors">Royal Sarees</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#F7E7BE] transition-colors">All Creations</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F7E7BE] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-semibold text-[#F7E7BE] tracking-wider uppercase font-serif">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm tracking-wide text-stone-300">
              <li>
                <Link to="/return-exchange-policy" className="hover:text-[#F7E7BE] transition-colors font-medium text-[#F7E7BE]">
                  Return within 7 days
                </Link>
              </li>
              <li>
                <Link to="/return-exchange-policy" className="hover:text-[#F7E7BE] transition-colors font-medium text-[#F7E7BE]">
                  Exchange within 7 days
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#F7E7BE] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F7E7BE] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#F7E7BE] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">
                  Contact Us & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get In Touch (3 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-base font-semibold text-[#F7E7BE] tracking-wider uppercase font-serif">
              Get In Touch
            </h4>
            <div className="space-y-3.5 text-sm text-stone-300">
              <div className="flex items-center gap-3">
                <User className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
                <span className="text-[#F7E7BE] font-medium">Pooja Vishwakarma</span>
              </div>

              <a
                href="tel:+919116863306"
                className="flex items-center gap-3 hover:text-[#F7E7BE] transition-colors"
              >
                <Phone className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
                <span>+91 9116863306</span>
              </a>

              <a
                href="mailto:pooja.vishwakarma84@gmail.com"
                className="flex items-center gap-3 hover:text-[#F7E7BE] transition-colors break-all"
              >
                <Mail className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
                <span>pooja.vishwakarma84@gmail.com</span>
              </a>

              <div className="flex items-center gap-3">
                <MapPin className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2 text-[#E8D49E]">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/people/Saisaa-Fashion/61595840763742/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#09231A] transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/saisaafashion/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#09231A] transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-6 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-stone-400 gap-3">
          <p className="tracking-wide">
            &copy; 2026 Saisaa &bull; More Than Fashion
          </p>
          <div className="flex items-center flex-wrap gap-4 tracking-wide">
            <Link to="/privacy-policy" className="hover:text-[#F7E7BE] transition-colors">Privacy Policy</Link>
            <span className="text-stone-600">|</span>
            <Link to="/return-exchange-policy" className="hover:text-[#F7E7BE] transition-colors">Return within 7 days</Link>
            <span className="text-stone-600">|</span>
            <Link to="/return-exchange-policy" className="hover:text-[#F7E7BE] transition-colors">Exchange within 7 days</Link>
            <span className="text-stone-600">|</span>
            <Link to="/contact" className="hover:text-[#F7E7BE] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
