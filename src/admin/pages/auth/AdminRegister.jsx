import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AdminRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const { showAdminToast } = useAdmin();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'Empty', score: 0, color: 'bg-stone-600' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { label: 'Weak', score: 25, color: 'bg-red-500' };
    if (score === 2 || score === 3)
      return { label: 'Medium', score: 65, color: 'bg-amber-500' };
    return { label: 'Strong', score: 100, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMsg('You must acknowledge the administrative access policies.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Administrator account registration submitted! Redirecting to sign in...');
      showAdminToast('Account registered successfully', 'success');

      setTimeout(() => {
        navigate('/admin/login');
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#061A13] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-stone-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex flex-col items-center gap-2 group mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.35)]">
            <img src="/saisaa-logo.jpg" alt="Saisaa" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif text-2xl tracking-[0.25em] text-[#F7E7BE] font-bold">
            SAISAA
          </span>
        </Link>

        <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
          Register Administrator
        </h2>
        <p className="text-xs text-stone-400 mt-1 font-light">
          Create staff account with store operator privileges.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0A261C] py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-[#D4AF37]/30 backdrop-blur-md space-y-5">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#F7E7BE] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Vikramaditya Rathore"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#061A13] border border-[#D4AF37]/35 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#F7E7BE] mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="staff@saisaa.in"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#061A13] border border-[#D4AF37]/35 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#F7E7BE] mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#061A13] border border-[#D4AF37]/35 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#F7E7BE] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#061A13] border border-[#D4AF37]/35 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>Strength: {strength.label}</span>
                    <span>Use 8+ chars with mix of symbols</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#F7E7BE] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#061A13] border border-[#D4AF37]/35 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-300 select-none">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-[#D4AF37]/50 bg-[#061A13] text-[#D4AF37] focus:ring-[#D4AF37] w-4 h-4"
                />
                <span>
                  I agree to the SAISAA Administrator Security Guidelines & Confidentiality Terms.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#E5C786] text-[#0A261C] rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#0A261C] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Staff Account</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-stone-400">
              Already registered?{' '}
              <Link to="/admin/login" className="text-[#D4AF37] hover:underline font-bold ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
