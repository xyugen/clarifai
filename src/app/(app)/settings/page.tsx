import { getSession } from "@/server/better-auth/server";
import { redirect } from "next/navigation";
import DangerZone from "./_components/danger-zone";
import ProfileSection from "./_components/profile-section";
import SecuritySection from "./_components/security";
import SettingsHeader from "./_components/settings-header";

const Page = async () => {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-cyan-100 dark:bg-cyan-950">
      <SettingsHeader />

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <ProfileSection />

        <SecuritySection />

        <DangerZone />
      </div>
    </div>
  );
};

export default Page;
