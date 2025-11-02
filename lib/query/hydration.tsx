import {
  dehydrate,
  HydrationBoundary,
  type QueryClient,
} from "@tanstack/react-query";

export const HydrateClient = (props: {
  children: React.ReactNode;
  client: QueryClient;
}) => {
  return (
    <HydrationBoundary state={dehydrate(props.client)}>
      {props.children}
    </HydrationBoundary>
  );
};
