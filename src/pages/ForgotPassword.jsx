import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [step, setStep] = useState(1); // 1: request, 2: entered reset code / password
  const [newPassword, setNewPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your registered email address or mobile number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setSuccessMsg(`We have dispatched a verification code to ${emailOrPhone}. (Demo Code: 123456)`);
      addToast('Reset instructions dispatched', 'cart');
    }, 800);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!resetCode.trim()) {
      setErrorMsg('Please enter the 6-digit reset code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('Password updated successfully! Please sign in.', 'cart');
      navigate('/login');
    }, 700);
  };

  return (
    <div className="min-h-[80vh] bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
      <div className="max-w-md mx-auto w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#09231A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 sm:p-10 relative">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#D4AF37] shadow-md mx-auto mb-3">
              <img
                src="/saisaa-logo.jpg"
                alt="Saisaa"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Reset Your Password
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Enter your registered details to recover your SAISAA Privé access.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. ravinder@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-[#09231A] hover:bg-[#0c3125] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-stone-200 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter 6-digit code (Demo: 123456)"
                  className="w-full px-4 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new secure password"
                  className="w-full px-4 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-[#09231A] hover:bg-[#0c3125] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-stone-200 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Update Password & Sign In</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-[#09231A] hover:text-[#D4AF37] transition-colors underline"
            >
              Remember your password? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
