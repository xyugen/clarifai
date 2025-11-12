import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { Settings } from "lucide-react";

const SettingsHeader = () => {
  return (
    <div className="border-b-2 border-black bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-start gap-4">
          <Card className="flex size-16 shrink-0 items-center justify-center bg-purple-300 hover:shadow-md">
            <Settings className="size-8" />
          </Card>
          <div className="flex-1">
            <Text as="h1" className="mb-2 text-4xl md:text-5xl">
              SETTINGS
            </Text>
            <Text as="p" className="text-lg text-gray-600">
              Manage your account preferences
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
