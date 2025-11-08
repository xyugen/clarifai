import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Progress } from "@/components/retroui/Progress";
import { Table } from "@/components/retroui/Table";
import { Text } from "@/components/retroui/Text";
import {
  ArrowRight,
  BookOpen,
  Clock,
  FileText,
  Target,
  Zap,
} from "lucide-react";
import HeroSection from "./_components/hero-section";
import QuickActionCards from "./_components/quick-action-cards";
import StatsCard from "./_components/stats-card";
import TopNav from "./_components/top-nav";

const Page = () => {
  const userName = "Alex";

  const recentSessions = [
    {
      id: 1,
      fileName: "machine_learning_basics.pdf",
      topic: "Supervised Learning",
      lastActivity: "2 days ago",
      progress: 75,
      status: "in-progress",
    },
    {
      id: 2,
      fileName: "history_of_ai.pdf",
      topic: "Symbolic AI",
      lastActivity: "5 days ago",
      progress: 100,
      status: "completed",
    },
    {
      id: 3,
      fileName: "neural_networks.pdf",
      topic: "Deep Learning",
      lastActivity: "1 week ago",
      progress: 45,
      status: "in-progress",
    },
    {
      id: 4,
      fileName: "python_basics.pdf",
      topic: "Python Programming",
      lastActivity: "2 weeks ago",
      progress: 30,
      status: "in-progress",
    },
  ];

  const stats = [
    { label: "SESSIONS", value: "24", icon: BookOpen, color: "bg-pink-300" },
    { label: "HOURS LEARNED", value: "48", icon: Clock, color: "bg-blue-300" },
    { label: "STREAK", value: "7 days", icon: Zap, color: "bg-yellow-200" },
    { label: "ACCURACY", value: "89%", icon: Target, color: "bg-green-300" },
  ];

  return (
    <div className="min-h-screen bg-cyan-100 font-sans antialiased">
      <TopNav />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <HeroSection username={userName} />
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
          <h2 className="text-3xl font-black">RECENT SESSIONS</h2>

          <Button
            variant="outline"
            className="mt-4 items-center justify-center gap-2 md:flex"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Desktop Table View */}
        <Table className="mx-auto mb-6 hidden md:block">
          <Table.Header>
            <Table.Row>
              <Table.Head className="w-1/5">FILE</Table.Head>
              <Table.Head>TOPIC</Table.Head>
              <Table.Head>PROGRESS</Table.Head>
              <Table.Head className="w-[175px]">LAST ACTIVITY</Table.Head>
              <Table.Head className="w-[100px]">ACTIONS</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body className="bg-background">
            {recentSessions.map((session) => (
              <Table.Row key={session.id}>
                <Table.Cell>
                  <Text as={"p"} className="font-semibold">
                    {session.fileName}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text as={"p"}>{session.topic}</Text>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-2">
                    <Progress
                      className={`${session.status === "completed" && "*:bg-green-300"}`}
                      value={session.progress}
                    />
                    <span>{session.progress}%</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text as={"p"}>{session.lastActivity}</Text>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <Button
                    variant={
                      session.status === "completed" ? "outline" : "default"
                    }
                    size="sm"
                  >
                    <span>
                      {session.status === "completed" ? "REVIEW" : "RESUME"}
                    </span>
                    <ArrowRight className="size-4" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Mobile Card View */}
        <Card className="w-full divide-y-4 divide-black shadow-none hover:shadow-none md:hidden">
          {recentSessions.map((session) => (
            <div key={session.id} className="bg-white p-4">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-blue-400">
                  <FileText className="h-6 w-6" strokeWidth={3} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-black">
                    {session.fileName}
                  </h3>
                  <p className="text-xs font-bold text-gray-600">
                    {session.topic}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <div className="mb-1 flex justify-between">
                  <span className="text-xs font-bold">PROGRESS</span>
                  <span className="text-xs font-black">
                    {session.progress}%
                  </span>
                </div>
                <Progress
                  className={`${session.status === "completed" && "*:bg-green-300"}`}
                  value={session.progress}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">
                  {session.lastActivity}
                </span>
                <Button
                  variant={
                    session.status === "completed" ? "outline" : "default"
                  }
                  size="sm"
                >
                  {session.status === "completed" ? "REVIEW" : "RESUME"} →
                </Button>
              </div>
            </div>
          ))}
        </Card>

        <Button
          variant="outline"
          className="mt-4 flex w-full items-center justify-center gap-2 md:hidden"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default Page;
