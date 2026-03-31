import { z } from "zod";

/** Sénégal : +221 suivi de 9 chiffres (mobile) */
export const telephoneSenegalSchema = z
  .string()
  .min(1, "Le numéro de téléphone est requis")
  .transform((s) => s.replace(/\s/g, ""))
  .refine((s) => /^\+221\d{9}$/.test(s), {
    message: "Numéro invalide : +221 suivi de 9 chiffres",
  });

/** Création : code et date générés côté serveur si absents */
export const createAvoirSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  telephone: telephoneSenegalSchema,
  montant: z.coerce.number().positive("Le montant doit être positif"),
  dateExpiration: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Date d’expiration invalide",
    }),
});

/** Mise à jour complète / partielle */
export const avoirSchema = z.object({
  code: z.string().min(1),
  nom: z.string().min(1),
  prenom: z.string().min(1),
  telephone: telephoneSenegalSchema,
  montant: z.coerce.number().positive(),
  dateExpiration: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date invalide",
  }),
  utilise: z.boolean().optional(),
});