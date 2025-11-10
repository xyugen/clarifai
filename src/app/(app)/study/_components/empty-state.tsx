import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { TextLink } from "@/components/retroui/TextLink";
import { PageRoutes } from "@/constants/page-routes";

interface EmptyStateProps {
  searchQuery: string;
}

export const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  return (
    <Card className="w-full border-2 bg-white p-12 text-center">
      <Text as="p" className="text-xl text-gray-600">
        {searchQuery
          ? "No lessons found matching your search"
          : "No lessons yet. Upload your first PDF to get started!"}
      </Text>
      {!searchQuery && (
        <TextLink
          href={PageRoutes.UPLOAD}
          className="mt-4 inline-block font-bold"
        >
          Upload PDF
        </TextLink>
      )}
    </Card>
  );
};
