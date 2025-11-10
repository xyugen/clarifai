import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { memo } from "react";

interface StatsOverviewProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    totalQuestions: number;
  };
}

export const StatsOverview = memo(({ stats }: StatsOverviewProps) => {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        value={stats.total}
        label="TOTAL LESSONS"
        bgColor="bg-yellow-300"
      />
      <StatCard
        value={stats.completed}
        label="COMPLETED"
        bgColor="bg-green-300"
      />
      <StatCard
        value={stats.inProgress}
        label="IN PROGRESS"
        bgColor="bg-blue-300"
      />
      <StatCard
        value={stats.totalQuestions}
        label="QUESTIONS"
        bgColor="bg-pink-300"
      />
    </div>
  );
});

StatsOverview.displayName = "StatsOverview";

const StatCard = memo(
  ({
    value,
    label,
    bgColor,
  }: {
    value: number;
    label: string;
    bgColor: string;
  }) => (
    <Card className={`border-2 ${bgColor} p-4 text-center`}>
      <Text as="p" className="mb-1 text-3xl">
        {value}
      </Text>
      <Text as="p" className="text-sm">
        {label}
      </Text>
    </Card>
  ),
);

StatCard.displayName = "StatCard";
