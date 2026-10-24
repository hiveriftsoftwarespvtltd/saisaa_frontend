import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication processing
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Authentication confirmed! Redirecting to Royal Atelier Dashboard...');
      login(email, password);

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 700);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#061A13] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-stone-100">
      {/* Background Decorative Gold Arch & Vine */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-center items-center">
        <div className="w-[600px] h-[600px] rounded-full border border-[#D4AF37]/40 blur-2xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Laurel Logo */}
        <Link to="/" className="inline-flex flex-col items-center gap-2 group mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-transform duration-300 group-hover:scale-105">
            <img
              src="/saisaa-logo.jpg"
              alt="Saisaa"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-serif text-3xl tracking-[0.25em] text-[#F7E7BE] font-bold">
            SAISAA
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold -mt-1">
            Backoffice & Management Portal
          </span>
        </Link>

        <h2 className="font-serif text-2xl font-bold text-white tracking-tight mt-2">
          Administrator Sign In
        </h2>
        <p className="text-xs text-stone-400 mt-1 font-light">
          Access royal inventory, customer orders, and catalog controls.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0A261C] py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-[#D4AF37]/30 backdrop-blur-md space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5" autoComplete="off">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F7E7BE] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter administrator email"
                  required
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#061A13] border border-[#D4AF37]/35 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F7E7BE] mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#061A13] border border-[#D4AF37]/35 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#D4AF37]/50 bg-[#061A13] text-[#D4AF37] focus:ring-[#D4AF37] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-stone-300">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#E5C786] text-[#0A261C] rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#0A261C] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          {/* Links Footer */}
          <div className="pt-4 border-t border-white/10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
            >
              <span>&larr; Return to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
