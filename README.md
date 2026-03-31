# AvoirPharma

Application Next.js (App Router) + Prisma + PostgreSQL pour gérer les **avoirs** d’une pharmacie.

## Fonctionnalités

1. **Vérification d’avoir (code OU QR)**  
   - Champ : entrer le **code** (ou scanner le **QR**)
   - Résultat clair :
     - ✅ **Avoir valide**
     - ❌ **Avoir expiré**
     - ❌ **Déjà utilisé**
   - Bouton (si valide) : **Marquer comme utilisé**

2. **Ticket professionnel (PDF petit format)**
   - Ticket type reçu (format **80x180 mm**) prêt à imprimer
   - Contenu :
     - Nom pharmacie
     - Adresse / téléphone
     - Nom client
     - Montant
     - Code unique
     - Date + heure
     - Expiration
     - Mention **“Valable 3 jours”**
     - **QR code** pointant vers la page de vérification

3. **QR code (TRÈS IMPORTANT)**
   - Scannez → ouverture directe de l’avoir à vérifier
   - Moins d’erreurs et plus rapide au comptoir

4. **Dashboard simple**
   - Total avoirs
   - Avoirs actifs
   - Expirés
   - Utilisés

5. **Recherche rapide**
   - Recherche instantanée sur :
     - code
     - nom
     - téléphone

## Authentification (admin unique)

Accès réservé à **un seul compte ADMIN** :
- Login : `email` + `mot de passe`
- Seuls les utilisateurs avec `role = ADMIN` peuvent accéder aux pages protégées.
- Route de connexion : `/connexion`

## Pages & routes

- `/connexion` : connexion admin
- `/` : Accueil (interface pro)
- `/avoirs` : liste + recherche + actions (modifier, supprimer, ticket PDF)
- `/avoirs/nouveau` : création (téléphone +221, date, ticket PDF auto)
- `/avoirs/[id]/modifier` : édition
- `/verifier` : vérification code/QR + marquer utilisé
- `/dashboard` : stats

## Prérequis

- Node.js
- PostgreSQL en local

## Installation & configuration

1. Installer les dépendances

```bash
npm install
```

2. Configurer `.env`

Copier le modèle :

```bash
copy .env.example .env
```

Puis renseigner :

- `DATABASE_URL`
- `AUTH_SECRET` (min. 32 caractères)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` (min. 8 caractères)

3. Mettre la base à jour + créer l’admin

```bash
npm run db:setup
```

Si Windows bloque parfois sur Prisma (verrou Windows EPERM), utiliser :

```bash
npm run db:generate:force
```

## Lancer l’application

```bash
npm run dev
```

Puis ouvrir :
- `http://localhost:3000/connexion`

## Scripts utiles

- `npm run dev` : démarrage dev
- `npm run build` : build prod
- `npm run db:setup` : migrations + generate + seed admin
- `npm run db:seed` : refaire seulement le seed admin

## Notes d’impression

Le ticket PDF est généré en **80x180 mm**. Pour une imprimante thermique, sélectionner le format reçu/thermique correspondant dans la boîte d’impression du navigateur.
