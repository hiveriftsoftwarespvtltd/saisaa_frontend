import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { authApi } from '../api';
import { useToast } from '../context/ToastContext';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: request OTP, 2: verify OTP & set new password
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const { addToast } = useToast();

  // Resend countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Request 6-digit OTP to email
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword({ email: cleanEmail });
      const rawData = response?.data || response;
      const message =
        rawData?.message ||
        response?.message ||
        `Verification code dispatched to ${cleanEmail}.`;

      setStep(2);
      setSuccessMsg(message);
      setResendCooldown(60); // 60s cooldown for resend
      addToast(message, 'cart');
    } catch (err) {
      const msg =
        err?.message ||
        'Unable to process password reset request. Please check your connection and try again.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Resend code
  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;
    setErrorMsg('');
    setIsResending(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const response = await authApi.forgotPassword({ email: cleanEmail });
      const rawData = response?.data || response;
      const message =
        rawData?.message ||
        response?.message ||
        'A fresh verification code has been dispatched to your email.';

      setSuccessMsg(message);
      setResendCooldown(60);
      addToast(message, 'cart');
    } catch (err) {
      const msg = err?.message || 'Failed to resend code. Please try again.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setIsResending(false);
    }
  };



  // Step 2: Verify OTP and update password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanOtp = resetCode.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entry.');
      return;
    }

    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const response = await authApi.resetPassword({
        email: cleanEmail,
        otp: cleanOtp,
        newPassword,
      });

      const message =
        response?.data?.message ||
        response?.message ||
        'Your password has been successfully updated! Welcome back.';

      addToast(message, 'cart');

      // Navigate to login with success message and prefilled email
      navigate('/login', {
        state: {
          email: cleanEmail,
          message: 'Password reset successful! Please sign in with your new password.',
        },
      });
    } catch (err) {
      const msg =
        err?.message ||
        'Failed to reset password. Please check your verification code and try again.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
      {/* Decorative luxury ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto w-full relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-[#09231A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-8 sm:p-10 relative backdrop-blur-sm">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg mx-auto mb-3.5 p-0.5 bg-white">
              <img
                src="/saisaa-logo.jpg"
                alt="SAISAA"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4AF37] block mb-1">
              SAISAA Privé Security
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#09231A]">
              {step === 1 ? 'Reset Your Password' : 'Enter Verification Code'}
            </h1>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              {step === 1
                ? 'Enter your registered email address to receive a secure 6-digit verification code.'
                : `We dispatched a 6-digit verification code to ${email}.`}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Email Form */}
          {step === 1 ? (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Registered Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. ravinder@example.com"
                    autoFocus
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50/60 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-all text-stone-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>A secure 6-digit OTP valid for 15 minutes will be dispatched.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-[#09231A] hover:bg-[#0c3125] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Enter OTP & New Password Form */
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {/* Email recap banner with Change option */}
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-600 truncate">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate font-medium">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-[11px] font-semibold text-[#09231A] hover:text-[#D4AF37] underline transition-colors shrink-0 ml-2 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* 6-Digit OTP */}
              <div>


                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    6-Digit Verification Code <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isResending}
                    className="text-[11px] font-semibold text-[#09231A] hover:text-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : isResending
                          ? 'Sending...'
                          : 'Resend Code'}
                    </span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => {
                      setResetCode(e.target.value.replace(/[^0-9]/g, ''));
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Enter 6-digit code"
                    autoFocus
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50/60 border border-stone-200 rounded-xl tracking-[0.25em] font-mono text-center font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-all"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-stone-50/60 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-all text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Re-enter your new password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-stone-50/60 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09231A]/20 focus:border-[#09231A] transition-all text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-4 bg-[#09231A] hover:bg-[#0c3125] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Update Password & Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Back Link */}
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
