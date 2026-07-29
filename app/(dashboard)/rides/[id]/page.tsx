import RideDetailsPage from "@/components/ride/RideDetailsPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
//   const { id } = await params;

  // Pass the ID to your RideDetailsPage component to fetch real data
  return <RideDetailsPage />;
}