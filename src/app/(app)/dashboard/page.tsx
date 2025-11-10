import { Button } from "@/components/retroui/Button";
import { auth } from "@/server/better-auth";
import { ArrowRight, BookOpen, Clock, Target, Zap } from "lucide-react";
import { headers } from "next/headers";
import HeroSection from "./_components/hero-section";
import QuickActionCards from "./_components/quick-action-cards";
import SessionsTable from "./_components/sessions-table";
import StatsCard from "./_components/stats-card";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userName = session?.user.name ?? "User";

  const stats = [
    { label: "SESSIONS", value: "24", icon: BookOpen, color: "bg-pink-300" },
    { label: "HOURS LEARNED", value: "48", icon: Clock, color: "bg-blue-300" },
    { label: "STREAK", value: "7 days", icon: Zap, color: "bg-yellow-200" },
    { label: "ACCURACY", value: "89%", icon: Target, color: "bg-green-300" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <HeroSection userName={userName} />
        <QuickActionCards />
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-black">YOUR STATS</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <StatsCard
              key={i}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      {/* Recent Study Sessions */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black md:text-3xl">RECENT SESSIONS</h2>

        <Button
          variant="outline"
          className="bg-background items-center justify-center gap-2 md:flex"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <SessionsTable />

      <Button
        variant="outline"
        className="mt-4 flex w-full items-center justify-center gap-2 md:hidden"
      >
        <span>VIEW ALL</span>
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
};

export default Page;
