import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CourseTable } from "../components/CourseTable";

const queryClient = new QueryClient();

export const TableProvider = () => (
  <QueryClientProvider client={queryClient}>
    <CourseTable />
  </QueryClientProvider>
);
