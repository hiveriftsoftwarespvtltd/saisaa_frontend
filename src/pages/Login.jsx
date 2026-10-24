import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Gift,
  Crown,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  // If already logged in, offer quick jump to account
  const from = location.state?.from?.pathname || '/account';

  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail || location.state?.email || '',
    password: '',
    rememberMe: true,
  });

  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto pre-fill if redirected with registered email
  useEffect(() => {
    if (location.state?.registeredEmail) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.registeredEmail,
      }));
    }
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid registered email address.');
      return;
    }
    if (!formData.password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email.trim(), formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(
        err.message || 'Login failed. Please check your credentials.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
      {/* Decorative Royal Corner Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#09231A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full">
        {/* Breadcrumb / Top Bar */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
          <Link to="/" className="hover:text-[#09231A] transition-colors flex items-center gap-1">
            <span>&larr; Back to Boutique</span>
          </Link>
          <span className="text-[#D4AF37] font-serif tracking-widest uppercase">
            SAISAA MAISON PRIVÉ
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero / Brand Privilege Panel (Desktop) */}
          <div className="lg:col-span-5 bg-[#09231A] p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Subtle Gold Floral Glow */}
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full border border-[#D4AF37]/20 blur-xl" />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border border-[#D4AF37]/20 blur-xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37] shadow-md shrink-0">
                  <img
                    src="/saisaa-logo.jpg"
                    alt="Saisaa"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl tracking-widest text-[#F7E7BE] font-bold">
                    SAISAA
                  </h3>
                  <p className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase">
                    Haute Handcrafted Ethnicwear
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F7E7BE] text-xs font-medium">
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>The Privé Patron Experience</span>
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-stone-100 leading-snug">
                  Welcome to Your Royal Dressing Suite
                </h2>
                <p className="text-stone-300 text-xs leading-relaxed font-light">
                  Sign in to effortlessly track bespoke orders, curate your bridal wishlist, and unlock curated seasonal privileges.
                </p>
              </div>

              {/* Privileges List */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-200">First Looks & Secret Drops</h4>
                    <p className="text-[11px] text-stone-400">Exclusive 48-hour early access to new limited-run ensembles.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                    <Gift className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-200">Privé Reward Points</h4>
                    <p className="text-[11px] text-stone-400">Earn 5% cashback points redeemable on handloom silk & suits.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-200">Bespoke Size Concierge</h4>
                    <p className="text-[11px] text-stone-400">Save your precise body measurements for perfect custom tailoring.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-6 border-t border-white/10 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Authentic Handcrafted Indian Wear</span>
              <span className="text-[#D4AF37]">Est. 2024</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                  Member Access
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Sign In to Saisaa
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Access your orders, addresses, and curated preferences.
                </p>
              </div>

              {/* Registration Success Notice */}
              {successMsg && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Email & Password Login Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. ravinder@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-stone-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-[#D4AF37] hover:text-[#09231A] transition-colors font-medium hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your account password"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 text-[#09231A] rounded border-stone-300 focus:ring-[#09231A]"
                    />
                    <span className="text-stone-600">Keep me signed in</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 bg-[#09231A] hover:bg-[#0c3125] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-75"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-stone-200 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Privé</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Create Account Link */}
              <div className="mt-6 text-center text-xs text-stone-600">
                <span>New to Saisaa? </span>
                <Link
                  to="/register"
                  className="font-bold text-[#09231A] hover:text-[#D4AF37] transition-colors underline"
                >
                  Create an Account & Join Privé
                </Link>
              </div>

              {/* Admin Portal Gateway */}
              {/* <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Looking for Atelier Staff Portal?</span>
                <Link
                  to="/admin/login"
                  className="text-stone-500 hover:text-[#09231A] font-medium transition-colors hover:underline"
                >
                  Admin Access &rarr;
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
