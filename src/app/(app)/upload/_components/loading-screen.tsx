import { Card } from "@/components/retroui/Card";
import { Loader } from "@/components/retroui/Loader";
import { Text } from "@/components/retroui/Text";
import { Upload } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyan-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 size-32 rotate-12 animate-pulse border-4 border-black bg-yellow-400 opacity-20 md:left-1/4"></div>
        <div className="animation-delay-300 absolute right-1/4 bottom-1/4 size-24 -rotate-12 animate-pulse border-4 border-black bg-pink-400 opacity-20"></div>
        <div className="animation-delay-600 absolute top-1/3 right-1/6 size-20 rotate-45 animate-pulse border-4 border-black bg-blue-400 opacity-20 md:right-1/3"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Animated Upload Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Card className="bg-primary flex size-32 animate-bounce items-center justify-center border-4 p-4">
              <Upload className="size-16" strokeWidth={3} />
            </Card>
            {/* Rotating accent square */}
            <div className="absolute -top-2 -right-2 size-8 animate-spin border-2 border-black bg-pink-400"></div>
          </div>
        </div>

        {/* Text */}
        <div className="mb-4">
          <Text as={"h2"}>UPLOADING FILE</Text>
          <Text className="text-gray-700">
            Hang tight! We&lsquo;re processing your PDF...
          </Text>
        </div>

        {/* Progress Animation */}
        <div className="flex justify-center gap-2">
          <Loader variant={"secondary"} size={"lg"} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
