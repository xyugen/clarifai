import { Card } from "@/components/retroui/Card";
import React from "react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const StatsCard = (props: StatsCardProps) => {
  return (
    <Card className={`${props.color} p-6 text-center`}>
      <props.icon className="mx-auto mb-3 h-8 w-8" />
      <div className="mb-1 text-3xl font-black">{props.value}</div>
      <div className="text-sm font-bold">{props.label}</div>
    </Card>
  );
};

export default StatsCard;
