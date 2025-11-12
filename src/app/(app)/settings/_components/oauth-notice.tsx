import { Google } from "@/assets/icons/google";

const OAuthNotice = () => {
  return (
    <div className="border-2 bg-blue-100 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-white">
          <Google />
        </div>
        <div>
          <h4 className="mb-1">SIGNED IN WITH GOOGLE</h4>
          <p className="text-sm text-gray-700">
            Your account is secured by Google. Password changes are managed
            through your Google account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthNotice;
