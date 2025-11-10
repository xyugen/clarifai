import { Button } from "@/components/retroui/Button";
import { auth } from "@/server/better-auth";
import { api } from "@/trpc/server";
import { ArrowRight } from "lucide-react";
import { headers } from "next/headers";
import HeroSection from "./_components/hero-section";
import QuickActionCards from "./_components/quick-action-cards";
import SessionsTable from "./_components/sessions-table";
import StatsSection from "./_components/stats-section";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userName = session?.user.name ?? "User";

  const recentSessions = await api.lesson.getTopicsForUser({
    limit: 6,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="mb-8">
        <HeroSection userName={userName} />
        <QuickActionCards />
      </section>

      <StatsSection />

      {recentSessions.length > 0 && (
        <>
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

          <SessionsTable recentSessions={recentSessions} />
        </>
      )}

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
