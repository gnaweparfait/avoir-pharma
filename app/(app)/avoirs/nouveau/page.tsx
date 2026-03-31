"use client";

import { useRouter } from "next/navigation";
import { AvoirForm } from "@/components/avoirs/AvoirForm";
import { PageHeader } from "@/components/avoirs/PageHeader";
import { downloadAvoirTicketPdf } from "@/lib/pdf/avoir-ticket";
import type { AvoirDTO } from "@/lib/types/avoir";

export default function NouvelAvoirPage() {
  const router = useRouter();

  function handleCreateSuccess(avoir: AvoirDTO) {
    void downloadAvoirTicketPdf(avoir).finally(() => {
      router.push("/avoirs");
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageHeader
        title="Créer un avoir"
        description="Le code est généré automatiquement. Un ticket PDF (petit format) sera téléchargé après création pour impression."
        crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Avoirs", href: "/avoirs" },
          { label: "Nouvel avoir" },
        ]}
      />
      <AvoirForm
        mode="create"
        onSuccess={handleCreateSuccess}
        cancelHref="/avoirs"
      />
    </div>
  );
}
