import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  Server,
  Sparkles,
} from 'lucide-react';
import { useAuth, useNotification } from '../../hooks';
import { authService } from '../../services';
import { AdminLayout } from '../../components/templates';
import { Button, Badge, Alert } from '../../components/atoms';
import { FormField } from '../../components/molecules';

export const AdminSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { success, error: notifyError } = useNotification();

  // Profile Form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  // Profile update handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      notifyError('Full name cannot be empty');
      return;
    }

    setProfileSaving(true);
    setProfileSuccess(false);
    try {
      const updated = await authService.updateProfile({ fullName: fullName.trim() });
      updateUser(updated);
      setProfileSuccess(true);
      success('Admin profile updated successfully!');
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      notifyError(msg);
    } finally {
      setProfileSaving(false);
    }
  };

  // Password change handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please provide your current password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    setPasswordSaving(true);
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      success('Password changed successfully! Keep your new credentials safe.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to change password';
      setPasswordError(msg);
      notifyError(msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  // Password strength checker helper
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  return (
    <AdminLayout title="Account & Security Settings">
      <div className="w-full space-y-6 animate-fade-in">
        {/* Clean Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-surface-200/60">
          <div>
            <h1 className="text-2xl font-black text-surface-900 tracking-tight">
              Account & Security Settings
            </h1>
            <p className="text-xs text-surface-500">
              Manage your administrator profile, security credentials, and authentication preferences.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-soft">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Administrator
            </span>
          </div>
        </div>

        {/* 2-Column Equal Height Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Admin Profile Details */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-surface-200 shadow-soft flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-100">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-surface-900">Admin Profile Details</h2>
                  <p className="text-xs text-surface-500">Your administrative identity</p>
                </div>
              </div>

              {profileSuccess && (
                <Alert type="success" onDismiss={() => setProfileSuccess(false)}>
                  Admin profile successfully updated!
                </Alert>
              )}

              <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-surface-700 mb-1">
                    Email Address (Login Identifier)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-500 text-xs font-semibold cursor-not-allowed pl-10"
                    />
                    <Mail className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" />
                  </div>
                  <p className="text-[11px] text-surface-400 mt-1">
                    Primary administrative email used for sign-in.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 mb-1">
                    Full Display Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. System Administrator"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-surface-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>

                {/* Account Status Capsule */}
                <div className="bg-surface-50 p-3.5 rounded-xl border border-surface-200/80 space-y-1.5 text-xs text-surface-600">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-surface-500">Security Access</span>
                    <span className="font-bold text-surface-900">Full Administrator</span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-surface-500">Session Protocol</span>
                    <span className="font-semibold text-emerald-700">Encrypted Token (Active)</span>
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-5 mt-5 border-t border-surface-100">
              <Button
                form="profile-form"
                type="submit"
                variant="primary"
                size="md"
                isLoading={profileSaving}
                className="w-full !bg-brand-600 hover:!bg-brand-700 shadow-soft"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Profile Changes
              </Button>
            </div>
          </div>

          {/* Card 2: Change Password & Security */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-surface-200 shadow-soft flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-100">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-surface-900">Change Admin Password</h2>
                  <p className="text-xs text-surface-500">Keep your administrative account protected</p>
                </div>
              </div>

              {passwordError && (
                <Alert type="error" onDismiss={() => setPasswordError(null)}>
                  {passwordError}
                </Alert>
              )}

              <form id="password-form" onSubmit={handleChangePassword} className="space-y-3.5">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-surface-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter existing password"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-surface-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-2.5 text-surface-400 hover:text-surface-700"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-surface-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-surface-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-2.5 text-surface-400 hover:text-surface-700"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex gap-1 h-1 w-full bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strengthScore <= 2
                              ? 'bg-rose-500 w-1/3'
                              : strengthScore <= 4
                              ? 'bg-amber-500 w-2/3'
                              : 'bg-emerald-500 w-full'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-surface-400">
                        <span>Password strength:</span>
                        <span className="font-bold">
                          {strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Good' : 'Strong & Secure'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-surface-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-surface-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2.5 text-surface-400 hover:text-surface-700"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="pt-5 mt-5 border-t border-surface-100">
              <Button
                form="password-form"
                type="submit"
                variant="primary"
                size="md"
                isLoading={passwordSaving}
                className="w-full !bg-slate-900 hover:!bg-slate-800 shadow-soft"
              >
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </div>
          </div>
        </div>

        {/* Card 3: System Infrastructure & Deployment Overview */}
        <div className="bg-white rounded-2xl p-6 border border-surface-200 shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-surface-100">
            <div className="w-8 h-8 rounded-lg bg-surface-100 text-surface-700 flex items-center justify-center flex-shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-surface-900">
                Security & Cloud Infrastructure
              </h3>
              <p className="text-xs text-surface-500">
                Production credential management and authentication lifecycle
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-surface-600">
            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200/70 space-y-1">
              <div className="font-bold text-surface-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Database Sync
              </div>
              <p className="text-[11px] leading-relaxed text-surface-500">
                Credentials updated here are instantly hashed and committed to your PostgreSQL database.
              </p>
            </div>

            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200/70 space-y-1">
              <div className="font-bold text-surface-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-600" /> Environment Variables
              </div>
              <p className="text-[11px] leading-relaxed text-surface-500">
                Managed via Render variables <code className="bg-white px-1 py-0.5 rounded border border-surface-200 text-brand-800 font-semibold">INITIAL_ADMIN_EMAIL</code> and <code className="bg-white px-1 py-0.5 rounded border border-surface-200 text-brand-800 font-semibold">INITIAL_ADMIN_PASSWORD</code>.
              </p>
            </div>

            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200/70 space-y-1">
              <div className="font-bold text-surface-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" /> Emergency Recovery
              </div>
              <p className="text-[11px] leading-relaxed text-surface-500">
                In case of lockout, enable <code className="bg-white px-1 py-0.5 rounded border border-surface-200 text-brand-800 font-semibold">FORCE_ADMIN_PASSWORD_RESET=true</code> on Render to re-sync credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
