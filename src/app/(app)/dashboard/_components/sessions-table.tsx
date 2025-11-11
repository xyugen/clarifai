import DeleteTopicButton from "@/components/delete-topic-button";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Progress } from "@/components/retroui/Progress";
import { Table } from "@/components/retroui/Table";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { formatDistance } from "date-fns";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import type React from "react";

interface SessionsTableProps {
  recentSessions: Array<{
    id: string;
    title: string;
    progress: number;
    answeredCount: number;
    totalQuestions: number;
    lastActivity: Date;
  }>;
}

const SessionsTable: React.FC<SessionsTableProps> = async ({
  recentSessions,
}) => {
  return (
    <>
      {/* Desktop Table View */}
      <Table className="mx-auto mb-6 hidden md:block">
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-screen">TOPIC</Table.Head>
            <Table.Head className="w-64">PROGRESS</Table.Head>
            <Table.Head className="w-64">LAST ACTIVITY</Table.Head>
            <Table.Head className="w-64">ACTIONS</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body className="bg-background">
          {recentSessions.reverse().map((item) => {
            const completed = item.answeredCount >= item.totalQuestions;
            const lastActivity = formatDistance(item.lastActivity, new Date(), {
              addSuffix: true,
            });

            return (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Text as={"p"}>{item.title}</Text>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-2">
                    <Progress
                      className={`${completed && "*:bg-green-300"}`}
                      value={item.progress}
                    />
                    <span>{item.progress}%</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text as={"p"}>{lastActivity}</Text>
                </Table.Cell>
                <Table.Cell className="flex flex-row items-center gap-2">
                  <Link href={`${PageRoutes.STUDY}/${item.id}`}>
                    <Button
                      className="h-8"
                      variant={completed ? "outline" : "default"}
                      size="sm"
                    >
                      <span>{completed ? "REVIEW" : "RESUME"}</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                  <DeleteTopicButton topicId={item.id} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {/* Mobile Card View */}
      <Card className="w-full divide-y-4 divide-black shadow-none hover:shadow-none md:hidden">
        {recentSessions.map((item) => {
          const completed = item.answeredCount >= item.totalQuestions;
          const lastActivity = formatDistance(item.lastActivity, new Date(), {
            addSuffix: true,
          });

          return (
            <div key={item.id} className="bg-white p-4">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center border-2 border-black bg-blue-300">
                  <FileText className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-600">
                    {item.answeredCount}/{item.totalQuestions} answered
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <div className="mb-1 flex justify-between">
                  <span className="text-xs">PROGRESS</span>
                  <span className="text-xs">{item.progress}%</span>
                </div>
                <Progress
                  className={`${completed && "*:bg-green-300"}`}
                  value={item.progress}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{lastActivity}</span>
                <div className="flex items-center gap-2">
                  <DeleteTopicButton topicId={item.id} />
                  <Link href={`${PageRoutes.STUDY}/${item.id}`}>
                    <Button
                      variant={completed ? "outline" : "default"}
                      size="sm"
                    >
                      {completed ? "REVIEW" : "RESUME"} →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </Card>
    </>
  );
};

export default SessionsTable;
