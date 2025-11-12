"use client";

import { Card } from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { Text } from "@/components/retroui/Text";
import { Label } from "@/components/ui/label";
import { authClient } from "@/server/better-auth/client";
import { Mail, UserIcon } from "lucide-react";
import NameForm from "./name-form";
import { ProfileImageUpload } from "./profile-image-upload";

const ProfileSection = () => {
  const { data, isPending } = authClient.useSession();

  const user = data?.user;

  if (!user || isPending) {
    return <ProfileSectionLoading />;
  }

  return (
    <Card className="bg-background w-full border-2 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center border-2 border-black bg-yellow-300">
          <UserIcon className="size-5" />
        </div>
        <Text as="h2" className="text-2xl">
          PROFILE
        </Text>
      </div>

      <div className="space-y-6">
        {/* Profile Image */}
        <div>
          <Text as="p" className="mb-3 block text-sm uppercase">
            Profile Picture
          </Text>
          <ProfileImageUpload currentImage={user.image} userName={user.name} />
        </div>

        <NameForm currentName={user.name} />

        {/* Email (Read-only) */}
        <div>
          <Label
            htmlFor="email"
            className="mb-3 flex items-center gap-2 text-sm uppercase"
          >
            <Mail className="size-4" />
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={user.email}
            disabled
            className="cursor-not-allowed bg-gray-100"
          />
          <Text as="p" className="mt-2 text-xs text-gray-600">
            Email cannot be changed
          </Text>
        </div>
      </div>
    </Card>
  );
};

const ProfileSectionLoading = () => {
  return (
    <Card className="bg-background w-full animate-pulse border-2 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center border-2 border-black bg-yellow-300">
          <UserIcon className="size-5" />
        </div>
        <div className="h-6 w-32 bg-gray-300"></div>
      </div>

      <div className="space-y-6">
        {/* Profile Image */}
        <div>
          <div className="mb-3 h-4 w-32 bg-gray-300"></div>
          <div className="h-24 w-24 bg-gray-200"></div>
        </div>

        <div>
          <div className="mb-3 h-4 w-32 bg-gray-300"></div>
          <div className="h-10 w-full bg-gray-200"></div>
        </div>

        {/* Email (Read-only) */}
        <div>
          <div className="mb-3 h-4 w-48 bg-gray-300"></div>
          <div className="h-10 w-full bg-gray-200"></div>
          <div className="mt-2 h-3 w-64 bg-gray-300"></div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;
