import { Text } from "@/components/retroui/Text";
import {
  Bot,
  ChartNoAxesCombined,
  MessageSquareDiff,
  Upload,
} from "lucide-react";

const Branding = () => {
  return (
    <section className="hidden max-w-lg lg:block">
      <Text
        as="h1"
        className="mb-6 text-5xl leading-tight font-black md:text-6xl"
      >
        Welcome to{" "}
        <span className="bg-primary inline-block -rotate-1 border-4 border-black px-4 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          ClarifAI
        </span>
      </Text>

      <Text as="p" className="mb-8 text-lg text-gray-800 xl:text-2xl">
        Your AI-powered study companion that makes learning actually stick.
      </Text>

      {/* Feature Pills */}
      <div className="space-y-4">
        {[
          {
            icon: <Upload />,
            iconBg: "bg-blue-300",
            text: "Upload any PDF lesson",
          },
          {
            icon: <Bot />,
            iconBg: "bg-green-300",
            text: "Get AI-generated questions",
          },
          {
            icon: <MessageSquareDiff />,
            iconBg: "bg-yellow-300",
            text: "Receive smart feedback",
          },
          {
            icon: <ChartNoAxesCombined />,
            iconBg: "bg-red-300",
            text: "Track your progress",
          },
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center border-4 border-black ${feature.iconBg} text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
            >
              {feature.icon}
            </div>
            <span className="text-lg">{feature.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Branding;
