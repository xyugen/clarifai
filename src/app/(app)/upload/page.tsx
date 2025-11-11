import { Text } from "@/components/retroui/Text";
import type { Metadata } from "next";
import FileUploadArea from "./_components/file-upload-area";

export const metadata: Metadata = {
  title: "Upload Lesson",
};

const Page = () => {
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-4xl md:text-5xl">
          UPLOAD YOUR{" "}
          <span className="bg-primary inline-block border-4 border-black px-3 py-1 shadow-lg">
            LESSON
          </span>
        </h1>
        <Text className="text-lg text-gray-700 md:text-xl">
          Drop your PDF and let <span className="font-bold">ClarifAI</span>{" "}
          generate smart, open-ended questions.
        </Text>
      </div>

      <FileUploadArea />
    </div>
  );
};

export default Page;
