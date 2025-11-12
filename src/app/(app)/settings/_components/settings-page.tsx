// app/settings/_components/settings-page.tsx
"use client";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { Text } from "@/components/retroui/Text";
import type { User } from "better-auth";
import { Lock, Mail, Sun, User as UserIcon } from "lucide-react";
import React, { useState } from "react";
import { PasswordChangeForm } from "./password-change-form";
import { ProfileImageUpload } from "./profile-image-upload";
import { ThemeToggle } from "./theme-toggle";

interface SettingsPageProps {
  user: User;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const [name, setName] = useState(user.name || "");
  const [isSavingName, setIsSavingName] = useState(false);

  const handleSaveName = async () => {
    setIsSavingName(true);
    // Add your API call here
    // await api.user.updateName.mutate({ name });
    setTimeout(() => setIsSavingName(false), 1000); // Mock delay
  };

  return (
    <div className="min-h-screen bg-cyan-100">
      {/* Header */}

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        {/* Profile Section */}
        <Card className="border-2 bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-yellow-400">
              <UserIcon className="h-5 w-5" strokeWidth={3} />
            </div>
            <Text as="h2" className="text-2xl font-black">
              PROFILE
            </Text>
          </div>

          <div className="space-y-6">
            {/* Profile Image */}
            <div>
              <Text as="p" className="mb-3 block text-sm font-bold uppercase">
                Profile Picture
              </Text>
              <ProfileImageUpload
                currentImage={user.image}
                userName={user.name}
              />
            </div>

            {/* Name */}
            <div>
              <Text as="p" className="mb-3 block text-sm font-bold uppercase">
                Full Name
              </Text>
              <div className="flex gap-3">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveName}
                  disabled={isSavingName || name === user.name}
                  variant="default"
                >
                  {isSavingName ? "SAVING..." : "SAVE"}
                </Button>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <Text
                as="p"
                className="mb-3 flex items-center gap-2 text-sm font-bold uppercase"
              >
                <Mail className="h-4 w-4" strokeWidth={3} />
                Email Address
              </Text>
              <Input
                type="email"
                value={user.email}
                disabled
                className="cursor-not-allowed bg-gray-100"
              />
              <Text as="p" className="mt-2 text-xs font-bold text-gray-600">
                Email cannot be changed
              </Text>
            </div>
          </div>
        </Card>

        {/* Security Section - Only show if not OAuth user */}
        {!user.email && (
          <Card className="border-2 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-pink-400">
                <Lock className="h-5 w-5" strokeWidth={3} />
              </div>
              <Text as="h2" className="text-2xl font-black">
                SECURITY
              </Text>
            </div>

            <PasswordChangeForm />
          </Card>
        )}

        {/* OAuth Notice */}
        {user.email && (
          <Card className="border-2 bg-blue-100 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-blue-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div>
                <Text as="h4" className="mb-1 font-black">
                  SIGNED IN WITH GOOGLE
                </Text>
                <Text as="p" className="text-sm font-bold text-gray-700">
                  Your account is secured by Google. Password changes are
                  managed through your Google account settings.
                </Text>
              </div>
            </div>
          </Card>
        )}

        {/* Appearance Section */}
        <Card className="border-2 bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-green-400">
              <Sun className="h-5 w-5" strokeWidth={3} />
            </div>
            <Text as="h2" className="text-2xl font-black">
              APPEARANCE
            </Text>
          </div>

          <ThemeToggle />
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-red-500 bg-red-100 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Text as="h2" className="text-xl font-black text-red-700">
              DANGER ZONE
            </Text>
          </div>
          <Text as="p" className="mb-4 text-sm font-bold text-gray-700">
            Once you delete your account, there is no going back. All your data
            will be permanently removed.
          </Text>
          <Button
            variant="outline"
            className="border-red-500 bg-white text-red-700 hover:bg-red-50"
          >
            DELETE ACCOUNT
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
