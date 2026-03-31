/** Representation d’un avoir après sérialisation JSON (Prisma -> API) */
export type AvoirDTO = {
  id: number;
  code: string;
  nom: string;
  prenom: string;
  telephone: string;
  montant: number;
  dateCreation: string;
  dateExpiration: string;
  utilise: boolean;
};
