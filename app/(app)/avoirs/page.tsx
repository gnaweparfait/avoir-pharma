import { AvoirList } from "@/components/avoirs/AvoirList";
import { PageHeader } from "@/components/avoirs/PageHeader";

export default function AvoirsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6">
      <PageHeader
        title="Avoirs"
        description="Consultez, filtrez et imprimez les avoirs clients. Utilisez le bouton « Nouvel avoir » dans la barre du haut pour en enregistrer un."
      />
      <AvoirList />
    </div>
  );
}
