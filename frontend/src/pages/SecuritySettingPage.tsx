import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  Lock,
  Smartphone,
  LogOut,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

const SecuritySettingsPage = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome on Windows', lastActive: '2 hours ago', isCurrent: true },
    { id: 2, device: 'Safari on iPhone', lastActive: '1 day ago', isCurrent: false },
    { id: 3, device: 'Chrome on MacOS', lastActive: '3 days ago', isCurrent: false },
  ]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdatePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    toast.success('Password updated successfully');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogoutSession = (sessionId: number) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success('Session ended');
  };

  const handleLogoutAllSessions = () => {
    setActiveSessions([activeSessions.find((s) => s.isCurrent) || activeSessions[0]]);
    toast.success('All other sessions logged out');
  };

  return (
    <>
      <Helmet>
        <title>Security Settings | PropGrowthX</title>
        <meta name="description" content="Manage your security settings and account protection." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');

        .page-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          font-size: 48px;
          font-weight: 400;
          letter-spacing: -1.5px;
        }

        .page-subtitle {
          color: #666;
          font-size: 15px;
        }

        .settings-card {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .settings-card:hover {
          border-color: rgba(0, 0, 0, 0.12);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }

        .settings-card-header {
          padding: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .settings-card-content {
          padding: 24px;
        }

        .settings-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #333;
        }

        .session-item {
          background: #f9fafb;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .session-item:hover {
          background: #f3f4f6;
          border-color: rgba(0, 0, 0, 0.1);
        }

        .password-strength {
          height: 4px;
          border-radius: 2px;
          margin-top: 8px;
          transition: all 0.3s ease;
        }

        .password-strength.weak {
          background: #ef4444;
          width: 33%;
        }

        .password-strength.medium {
          background: #f59e0b;
          width: 66%;
        }

        .password-strength.strong {
          background: #10b981;
          width: 100%;
        }
      `}</style>

        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Header with Back Button */}
            <div className="flex items-start gap-4 mb-8">
              <Button variant="ghost" size="icon" asChild className="hover:bg-gray-100 mt-1 flex-shrink-0">
                <Link to="/profile">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex-1">
                <h1 className="page-title mb-1">Security Settings</h1>
                <p className="page-subtitle">Manage your password, two-factor authentication, and active sessions</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Change Password */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-5 h-5 text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                  </div>
                  <p className="text-sm text-gray-600">Update your password regularly to keep your account secure</p>
                </div>
                <div className="settings-card-content space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="settings-label">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="border-gray-200 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="settings-label">New Password</label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        className="border-gray-200 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      At least 8 characters, mix of uppercase, lowercase, and numbers
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="settings-label">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        className="border-gray-200 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleUpdatePassword}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-5 h-5 text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
                  </div>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <div className="settings-card-content space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-blue-900">Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}</div>
                        <div className="text-sm text-blue-700 mt-1">
                          {twoFactorEnabled
                            ? 'Your account is protected with 2FA. You will need to verify with your authenticator app.'
                            : 'Enable 2FA to add an extra layer of security to your account.'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        setTwoFactorEnabled(checked);
                        toast.success(checked ? '2FA enabled' : '2FA disabled');
                      }}
                    />
                  </div>

                  {twoFactorEnabled && (
                    <div className="space-y-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="text-sm font-medium text-amber-900">
                        📱 Authenticator App Required
                      </div>
                      <div className="text-sm text-amber-700">
                        Use an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy to scan the QR code.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Sessions */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="flex items-center gap-2 mb-1">
                    <LogOut className="w-5 h-5 text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
                  </div>
                  <p className="text-sm text-gray-600">Manage devices that have access to your account</p>
                </div>
                <div className="settings-card-content space-y-3">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="session-item flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {session.device}
                          {session.isCurrent && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Last active: {session.lastActive}
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLogoutSession(session.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </Button>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-100 flex justify-center">
                    <Button
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-50"
                      onClick={handleLogoutAllSessions}
                    >
                      Logout All Other Sessions
                    </Button>
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div className="settings-card bg-gradient-to-r from-blue-50 to-blue-50">
                <div className="settings-card-header border-b border-blue-100">
                  <h2 className="text-lg font-semibold text-blue-900">🔒 Security Tips</h2>
                </div>
                <div className="settings-card-content">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Use a unique password that you don't use elsewhere</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Enable two-factor authentication for extra security</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Review active sessions regularly and logout unused devices</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Never share your password or authenticator codes with anyone</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default SecuritySettingsPage;