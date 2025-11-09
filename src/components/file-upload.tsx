import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Text } from "./retroui/Text";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxFileSizeInMB?: number;
  className?: string;
}

const FileUpload = ({
  onFilesSelected,
  maxFiles = 1,
  maxFileSizeInMB = 2,
  className,
}: FileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSizeInMB * 1024 * 1024,
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        `cursor-pointer border-4 border-dashed border-black p-8 shadow-lg transition-all ${
          isDragActive
            ? "bg-primary translate-1 shadow-none"
            : "bg-white hover:bg-gray-100 active:translate-1 active:shadow-none"
        }`,
        className,
      )}
    >
      <input {...getInputProps()} />

      <div className="mt-6 flex flex-col items-center gap-2 text-center text-gray-700">
        <UploadCloud className="size-12 text-gray-600" />
        <Text className="text-lg">Drag and drop your file here</Text>
        <Text className="text-sm text-gray-500 italic">
          PDF only — one file at a time
          <br />
          <span className="font-semibold">Max: {maxFileSizeInMB} MB</span>
        </Text>
      </div>
    </div>
  );
};

export default FileUpload;
