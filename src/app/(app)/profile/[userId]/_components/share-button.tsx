"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

const ShareButton = () => {
  const handleCopyProfileLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy profile link.");
      return;
    }
  };

  return (
    <button className="cursor-pointer" onClick={handleCopyProfileLink}>
      <Share2 className="stroke-foreground size-5" />
    </button>
  );
};

export default ShareButton;
