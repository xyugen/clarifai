import { api } from "@/trpc/server";
import { BookOpen, NotebookPen, Target, Zap } from "lucide-react";
import StatsCard from "./stats-card";

const StatsSection = async () => {
  const stats = await api.lesson.getUserStats();

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-3xl font-black">YOUR STATS</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard
          label="SESSIONS"
          value={stats.sessions.toString()}
          icon={BookOpen}
          color="bg-pink-300"
        />

        <StatsCard
          label="QUESTIONS ANSWERED"
          value={stats.answeredCount.toString()}
          icon={NotebookPen}
          color="bg-blue-300"
        />

        <StatsCard
          label="STREAK"
          value={stats.streak.toString()}
          icon={Zap}
          color="bg-yellow-300"
        />

        <StatsCard
          label="CLARITY SCORE"
          value={`${stats.clarity}%`}
          icon={Target}
          color="bg-green-300"
        />
      </div>
    </section>
  );
};

export default StatsSection;
