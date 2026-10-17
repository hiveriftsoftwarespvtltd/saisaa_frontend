import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
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
          Password Recovery
        </h2>
        <p className="text-xs text-stone-400 mt-1 font-light">
          Request a security reset link for your administrator account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0A261C] py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-[#D4AF37]/30 backdrop-blur-md space-y-5">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-2 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F7E7BE]">
                Reset Instructions Dispatched
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                A password reset link has been sent to{' '}
                <strong className="text-white">{email}</strong>. Please check your inbox and security spam folder.
              </p>
              <div className="pt-3">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F7E7BE] mb-1.5">
                  Registered Staff Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@saisaa.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#061A13] border border-[#D4AF37]/35 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

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
                    <span>Send Password Reset Link</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
