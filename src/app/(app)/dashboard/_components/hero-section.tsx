import { Text } from "@/components/retroui/Text";

interface HeroSectionProps {
  userName: string;
}

const HeroSection = (props: HeroSectionProps) => {
  const { userName } = props;

  return (
    <div className="mb-6">
      <Text as={"p"} className="mb-2 text-4xl font-semibold md:text-5xl">
        WELCOME BACK,{" "}
        <span className="font-head text-foreground text-shadow-accent text-shadow-[4px_4px_0rem]">
          {userName.toUpperCase()}!
        </span>
      </Text>
      <Text as={"p"} className="text-lg text-gray-700">
        Continue where you left off or start a new learning session.
      </Text>
    </div>
  );
};

export default HeroSection;
