import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";

interface EmptyStateProps {
  searchQuery: string;
}

export const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  return (
    <Card className="border-2 bg-white p-12 text-center">
      <Text as="p" className="text-xl font-bold text-gray-600">
        {searchQuery
          ? "No lessons found matching your search"
          : "No lessons yet. Upload your first PDF to get started!"}
      </Text>
    </Card>
  );
};
