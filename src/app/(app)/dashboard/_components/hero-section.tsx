import { Text } from "@/components/retroui/Text";

interface HeroSectionProps {
  userName: string;
  hasSessions?: boolean;
}

const HeroSection = ({ userName, hasSessions }: HeroSectionProps) => {
  return (
    <div className="mb-6">
      <Text as={"p"} className="mb-2 text-4xl font-semibold md:text-5xl">
        {hasSessions ? "WELCOME BACK" : "WELCOME"},{" "}
        <span className="font-head text-foreground text-shadow-accent text-shadow-[4px_4px_0rem]">
          {userName.toUpperCase()}!
        </span>
      </Text>
      <Text as={"p"} className="text-lg text-gray-700">
        {hasSessions
          ? "Continue where you left off or start a new learning session."
          : "Let's get started on your learning journey!"}
      </Text>
    </div>
  );
};

export default HeroSection;
