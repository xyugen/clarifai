"use client";

import { Input } from "@/components/retroui/Input";
import { Search } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { EmptyState } from "./empty-state";
import { MonthGroup } from "./month-group";
import { PageHeader } from "./page-header";
import { StatsOverview } from "./stats-overview";

interface Topic {
  id: string;
  title: string;
  lastActivity: Date;
  totalQuestions: number;
  answeredCount: number;
  progress: number;
}

interface PastLessonsProps {
  topics: Topic[];
}

const PastLessonsPage = ({ topics }: PastLessonsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchQuery(e.target.value);
    });
  };

  // Filter topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const query = searchQuery.toLowerCase();
    return topics.filter((topic) => topic.title.toLowerCase().includes(query));
  }, [topics, searchQuery]);

  // Group topics by month
  // Group topics by month
  const groupedTopics = useMemo(() => {
    const groups: Record<string, Topic[]> = {};

    filteredTopics.forEach((topic) => {
      const date = new Date(topic.lastActivity);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      groups[monthYear] ??= [];
      groups[monthYear].push(topic);
    });

    return Object.entries(groups).sort((a, b) => {
      const dateA = new Date(groups[a[0]]?.[0]?.lastActivity ?? 0);
      const dateB = new Date(groups[b[0]]?.[0]?.lastActivity ?? 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredTopics]);

  const stats = useMemo(
    () => ({
      total: topics.length,
      completed: topics.filter((t) => t.progress === 100).length,
      inProgress: topics.filter((t) => t.progress > 0 && t.progress < 100)
        .length,
      totalQuestions: topics.reduce((sum, t) => sum + t.totalQuestions, 0),
    }),
    [topics],
  );

  return (
    <div>
      <PageHeader>
        <div className="relative max-w-2xl">
          <div className="absolute top-1/2 left-4 -translate-y-1/2">
            <Search className="h-5 w-5" strokeWidth={3} />
          </div>
          <Input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="focus:ring-primary w-full py-3 pr-4 pl-12 text-lg font-bold focus:ring-4 focus:outline-none"
          />
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <StatsOverview stats={stats} />

        {groupedTopics.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <div className="space-y-8" style={{ opacity: isPending ? 0.6 : 1 }}>
            {groupedTopics.map(([monthYear, monthTopics]) => (
              <MonthGroup
                key={monthYear}
                monthYear={monthYear}
                topics={monthTopics}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastLessonsPage;
