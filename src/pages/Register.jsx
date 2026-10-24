import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Gift,
  Crown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
    newsletter: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMsg) setErrorMsg('');
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'Empty', score: 0, color: 'bg-stone-200', text: 'text-stone-400' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { label: 'Weak', score: 25, color: 'bg-rose-500', text: 'text-rose-500' };
    if (score === 2 || score === 3)
      return { label: 'Good', score: 65, color: 'bg-amber-500', text: 'text-amber-600' };
    return { label: 'Strong & Secure', score: 100, color: 'bg-emerald-600', text: 'text-emerald-700' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMsg('You must agree to the Terms & Privacy Policy to register.');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login', {
        state: {
          registeredEmail: formData.email.trim().toLowerCase(),
          message:
            'Account created successfully! Please enter your password to sign in.',
        },
      });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
      {/* Decorative Royal Corner Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#09231A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full">
        {/* Top Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
          <Link to="/" className="hover:text-[#09231A] transition-colors flex items-center gap-1">
            <span>&larr; Back to Boutique</span>
          </Link>
          <span className="text-[#D4AF37] font-serif tracking-widest uppercase">
            SAISAA MAISON PRIVÉ
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Brand Privileges Panel (Desktop) */}
          <div className="lg:col-span-5 bg-[#09231A] p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Gold Glows */}
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
                  <span>Exclusive Privé Membership</span>
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-stone-100 leading-snug">
                  Curate Your Legacy Wardrobe
                </h2>
                <p className="text-stone-300 text-xs leading-relaxed font-light">
                  Join the circle of discerning patrons who celebrate pure silk, heritage zardozi, and handspun craftsmanship.
                </p>
              </div>

              {/* Membership Benefits Box */}
              <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3.5 backdrop-blur-sm">
                <div className="text-xs font-semibold text-[#F7E7BE] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#D4AF37]" />
                  <span>Welcome Gifts for New Patrons</span>
                </div>

                <div className="space-y-2.5 text-xs text-stone-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span><strong>500 Reward Points</strong> credited immediately</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span>Flat <strong>15% Off</strong> first order code: <span className="text-[#F7E7BE] font-mono">SHAHI500</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span>Complimentary bespoke size consultation</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span>Free insured express shipping across India</span>
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
                  New Patron Registration
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Create Your Account
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Enjoy seamless checkout, order tracking, and exclusive bridal privileges.
                </p>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Aanya Sharma"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
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
                      placeholder="e.g. aanya@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-colors"
                    />
                  </div>
                </div>


                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-9 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-9 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Security Strength:</span>
                      <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Checkboxes */}
                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-0.5 w-3.5 h-3.5 text-[#09231A] rounded border-stone-300 focus:ring-[#09231A]"
                    />
                    <span className="text-stone-600">
                      I agree to the{' '}
                      <Link to="/about" className="text-[#09231A] font-semibold underline">
                        Terms of Service
                      </Link>{' '}
                      &{' '}
                      <Link to="/about" className="text-[#09231A] font-semibold underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="mt-0.5 w-3.5 h-3.5 text-[#09231A] rounded border-stone-300 focus:ring-[#09231A]"
                    />
                    <span className="text-stone-600">
                      Send me bespoke lookbooks, VIP previews, and private sale codes via WhatsApp & Email.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-3 px-4 bg-[#09231A] hover:bg-[#0c3125] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-75"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-stone-200 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Already have an account link */}
              <div className="mt-5 text-center text-xs text-stone-600">
                <span>Already registered with SAISAA? </span>
                <Link
                  to="/login"
                  className="font-bold text-[#09231A] hover:text-[#D4AF37] transition-colors underline"
                >
                  Sign In to Your Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
