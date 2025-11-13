"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { api } from "@/trpc/react";
import type { TRPCError } from "@trpc/server";
import { ArrowRight, CheckCircle2, FileText, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";
import LoadingScreen from "../../../upload/_components/loading-screen";

const FlashcardFileUploadArea = () => {
  const router = useRouter();

  const fileUploadMutation = api.ai.generateFlashcardsFromPDF.useMutation();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    setLoading(true);

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      await fileUploadMutation
        .mutateAsync(formData)
        .then((res) => {
          toast.success("Flashcards generated successfully!");
          router.push(`${PageRoutes.FLASHCARDS}/${res.flashcardSetId}`);
        })
        .catch((error: TRPCError) => {
          setLoading(false);
          toast.error(error.message);
        });
      setFile(null);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        toast.error("Failed to generate flashcards");
      }
    }
  };

  return (
    <>
      {(fileUploadMutation.isPending || loading) && <LoadingScreen />}

      {!file ? (
        <FileUpload
          maxFiles={1}
          maxFileSizeInMB={5}
          onFilesSelected={(selected) => {
            const selectedFile = selected[0];
            if (selectedFile) setFile(selectedFile);
          }}
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-black">
            YOUR UPLOADED FILE
          </h2>

          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <FileText className="hidden size-6 text-gray-700 md:block" />
              <div>
                <Text className="text-base font-bold md:text-lg">
                  {file.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-green-600" />
              <Button
                variant="default"
                size="sm"
                className="bg-red-100 font-sans text-red-600 hover:bg-red-200"
                onClick={handleClear}
                disabled={fileUploadMutation.isPending && loading}
              >
                <Trash2 className="mr-1 size-4" /> Clear
              </Button>
            </div>
          </Card>

          <div className="mt-4 text-center">
            <Button
              size="md"
              onClick={handleUpload}
              disabled={fileUploadMutation.isPending && loading}
            >
              Generate Flashcards <ArrowRight className="ml-2 size-5" />
            </Button>
            <p className="mt-2 text-sm text-gray-600 italic">
              Proceed to generate flashcards from your PDF.
            </p>
          </div>
        </div>
      )}

      {/* Info Card */}
      {!file && (
        <Card className="mt-10 w-full border-2 border-black bg-purple-300 p-6 shadow-none">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-black">💡 How it works</h3>
              <p className="text-base">
                Upload your study materials — notes, slides, or textbooks — and
                let
                <span className="mx-1 font-bold">ClarifAI</span> extract key
                terminologies and concepts into easy-to-study flashcards.
              </p>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default FlashcardFileUploadArea;
