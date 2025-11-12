"use client";

import { Button } from "@/components/retroui/Button";
import { UploadButton } from "@/lib/uploadthing";
import { authClient } from "@/server/better-auth/client";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type { ClientUploadedFileData } from "uploadthing/types";

interface ProfileImageUploadProps {
  currentImage?: string | null;
  userName: string;
}

export const ProfileImageUpload = ({
  currentImage,
  userName,
}: ProfileImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUploadComplete = async (
    res: ClientUploadedFileData<{
      fileUrl: string;
      uploadedBy: string;
    }>[],
  ) => {
    setIsUploading(false);

    if (res.length > 0 && res[0]?.ufsUrl) {
      await authClient.updateUser({
        image: res[0].ufsUrl,
      });
    }

    toast.success("Image uploaded successfully");
  };

  const handleRemoveImage = async () => {
    setIsRemoving(true);
    try {
      await authClient.updateUser({
        image: null,
      });
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex items-start gap-6">
      <div className="relative">
        <div className="bg-primary flex h-24 w-24 items-center justify-center overflow-hidden border-2 border-black">
          {currentImage ? (
            <Image
              src={currentImage}
              alt="Profile"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-6xl">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </span>
          )}
        </div>
        {currentImage && (
          <button
            onClick={handleRemoveImage}
            disabled={isRemoving}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center border-2 border-black bg-red-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" strokeWidth={3} />
          </button>
        )}
      </div>

      <div className="w-fit">
        <label className="cursor-pointer">
          <UploadButton
            className="hidden"
            endpoint="profileImageUpload"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              console.error("Upload error:", error);
              toast.error("Failed to upload image");
            }}
            onUploadBegin={() => {
              setIsUploading(true);
            }}
          />

          <Button
            variant="outline"
            className="bg-background w-fit disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none disabled:hover:translate-0"
            disabled={isUploading}
            asChild
          >
            <span className="flex items-center gap-2">
              <Upload className="size-4" strokeWidth={3} />
              {isUploading ? "UPLOADING..." : "UPLOAD NEW"}
            </span>
          </Button>
        </label>
        <p className="mt-2 text-xs text-gray-600">JPG or PNG. Max 2MB.</p>
      </div>
    </div>
  );
};
