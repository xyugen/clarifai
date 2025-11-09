"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { api } from "@/trpc/react";
import { ArrowRight, CheckCircle2, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import LoadingScreen from "./loading-screen";

const FileUploadArea = () => {
  const fileUploadMutation = api.ai.parsePDF.useMutation();

  const [file, setFile] = useState<File | null>(null);

  const handleClear = () => setFile(null);

  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      fileUploadMutation.mutate(formData);
      setFile(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to import PDF");
      }
    }
  };

  return (
    <>
      {fileUploadMutation.isPending && <LoadingScreen />}

      {!file ? (
        <FileUpload
          maxFiles={1}
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
              <FileText className="size-6 text-gray-700" />
              <div>
                <p className="text-lg font-bold">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-green-600" />
              <Button
                variant="outline"
                size="sm"
                className="bg-red-100 font-sans text-red-600 hover:bg-red-200"
                onClick={handleClear}
                disabled={fileUploadMutation.isPending}
              >
                <Trash2 className="mr-1 size-4" /> Clear
              </Button>
            </div>
          </Card>

          <div className="mt-4 text-center">
            <Button size="md" onClick={handleUpload}>
              Continue <ArrowRight className="ml-2 size-5" />
            </Button>
            <p className="mt-2 text-sm text-gray-600 italic">
              Proceed to generate questions and start learning.
            </p>
          </div>
        </div>
      )}

      {/* Info Card */}
      {!file && (
        <Card className="mt-10 w-full border-2 border-black bg-yellow-300 p-6 shadow-none">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-black">💡 First time here?</h3>
              <p className="text-base">
                Upload your study materials — notes, slides, or textbooks — and
                let
                <span className="mx-1 font-bold">ClarifAI</span> challenge you
                with comprehension questions and feedback powered by AI.
              </p>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default FileUploadArea;
