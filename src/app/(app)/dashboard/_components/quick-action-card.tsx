"use client";

import { Badge } from "@/components/retroui/Badge";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { ArrowRight } from "lucide-react";
import React from "react";

interface QuickActionCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badgeText: string;
  title: string;
  description: string;
  buttonText: string;
  bgColor?: string;
  badgeColor?: string;
  onClick: () => void;
}

const QuickActionCard = (props: QuickActionCardProps) => {
  return (
    <Card
      className={`flex cursor-pointer flex-col justify-between ${props.bgColor} transition-transform hover:-rotate-1`}
    >
      <Card.Header>
        <div className="mb-4 flex items-start justify-between">
          <props.icon className="size-10" />
          <Badge className={props.badgeColor}>{props.badgeText}</Badge>
        </div>
        <Card.Title>{props.title}</Card.Title>
        <Card.Description className="text-gray-700">{props.description}</Card.Description>
      </Card.Header>
      <Card.Content>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={props.onClick}
        >
          <span className="mr-2">{props.buttonText}</span>
          <ArrowRight />
        </Button>
      </Card.Content>
    </Card>
  );
};

export default QuickActionCard;
