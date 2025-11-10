"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Select } from "@/components/retroui/Select";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { api } from "@/trpc/react";
import { Label } from "@radix-ui/react-dropdown-menu";
import type { TRPCError } from "@trpc/server";
import { ArrowRight, CheckCircle2, FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import LoadingScreen from "./loading-screen";

const FileUploadArea = () => {
  const router = useRouter();

  const fileUploadMutation = api.ai.generateQuestionsFromPDF.useMutation();

  const [file, setFile] = useState<File | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState<string>("5");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setFile(null);
    setNumberOfQuestions("5");
    setDifficulty("medium");
  };

  const handleUpload = async () => {
    setLoading(true);

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("numQuestions", numberOfQuestions);
      formData.append("difficulty", difficulty);

      await fileUploadMutation
        .mutateAsync(formData)
        .then((res) => {
          toast.success("File uploaded successfully!");
          router.push(`${PageRoutes.STUDY}/${res.topicId}`);
        })
        .catch((error: TRPCError) => {
          setLoading(false);
          toast.error(error.message);
        });
      setFile(null);
      setNumberOfQuestions("5");
      setDifficulty("medium");
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        toast.error("Failed to import PDF");
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

          <div className="flex flex-col gap-4 sm:flex-row">
            <div>
              <Label className="mb-2 block">Number of Questions</Label>
              <Select
                defaultValue={numberOfQuestions}
                onValueChange={setNumberOfQuestions}
              >
                <Select.Trigger className="w-60 bg-white">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <Select.Item key={num} value={num.toString()}>
                        {num}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Difficulty of Questions</Label>
              <Select defaultValue={difficulty} onValueChange={setDifficulty}>
                <Select.Trigger className="w-60 bg-white">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {["easy", "medium", "hard"].map((level) => (
                      <Select.Item key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button
              size="md"
              onClick={handleUpload}
              disabled={fileUploadMutation.isPending && loading}
            >
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
