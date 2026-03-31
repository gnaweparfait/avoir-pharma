import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { formatSenegalDisplay } from "@/lib/phone-sn";
import type { AvoirDTO } from "@/lib/types/avoir";
import { PHARMACY } from "@/lib/pharmacy";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatAmount(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

/**
 * Genere un petit ticket PDF (80x180 mm) pret a imprimer.
 */
export async function downloadAvoirTicketPdf(avoir: AvoirDTO) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 180],
  });

  const line = (y: number) => {
    pdf.setDrawColor(200);
    pdf.line(6, y, 74, y);
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(PHARMACY.name, 40, 12, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text("Ticket d'avoir client", 40, 17, { align: "center" });
  pdf.setFontSize(7);
  pdf.text(PHARMACY.address, 40, 24, { align: "center" });
  pdf.text(PHARMACY.phone, 40, 29, { align: "center" });

  line(35);

  let y = 43;
  const drawRow = (label: string, value: string) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.text(label, 7, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(value, 73, y, { align: "right" });
    y += 7;
  };

  drawRow("Code", avoir.code);
  drawRow("Nom", `${avoir.prenom} ${avoir.nom}`);
  drawRow("Telephone", formatSenegalDisplay(avoir.telephone));
  drawRow("Montant", formatAmount(avoir.montant));
  drawRow("Expiration", formatDate(avoir.dateExpiration));
  drawRow("Date+heure", formatDateTime(avoir.dateCreation));

  y += 1;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.text("Valable 3 jours", 40, y, { align: "center" });

  y += 7;
  line(y);
  y += 7;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("A presenter en caisse", 40, y, { align: "center" });
  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text("Document genere automatiquement", 40, y, { align: "center" });

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const verifyUrl = origin
    ? `${origin}/verifier?code=${encodeURIComponent(avoir.code)}`
    : `/verifier?code=${encodeURIComponent(avoir.code)}`;

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 0,
    width: 240,
    errorCorrectionLevel: "M",
  });

  pdf.addImage(qrDataUrl, "PNG", 48, 118, 26, 26);

  pdf.setFontSize(7);
  pdf.text("Scannez pour verifier", 40, 146, { align: "center" });

  pdf.save(`avoir-${avoir.code}.pdf`);
}
