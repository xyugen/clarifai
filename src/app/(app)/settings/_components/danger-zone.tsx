import { Text } from "@/components/retroui/Text";
import DeleteAccountButton from "./delete-account-button";

const DangerZone = () => {
  return (
    <div className="border-2 border-red-400 bg-red-100 p-6">
      <div className="mb-4 flex items-center gap-3">
        <Text as={"h3"} className="text-xl text-red-600">
          DANGER ZONE
        </Text>
      </div>
      <Text as={"p"} className="mb-4 text-sm text-gray-700">
        Once you delete your account, there is no going back. All your data will
        be permanently removed.
      </Text>
      <DeleteAccountButton />
    </div>
  );
};

export default DangerZone;
