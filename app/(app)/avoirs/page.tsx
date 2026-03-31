import { AvoirList } from "@/components/avoirs/AvoirList";
import { PageHeader } from "@/components/avoirs/PageHeader";

export default function AvoirsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Avoirs"
        description="Consultez, modifiez ou supprimez les avoirs. Utilisez le bouton « Nouvel avoir » dans la barre du haut pour en créer un."
      />
      <AvoirList />
    </div>
  );
}
