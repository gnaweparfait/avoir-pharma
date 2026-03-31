import { ModifierAvoirClient } from "@/components/avoirs/ModifierAvoirClient";

export default async function ModifierAvoirPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ModifierAvoirClient id={id} />;
}
