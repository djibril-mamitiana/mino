# La Biscuiterie Dorée

Site e-commerce fictif de cookies &amp; pâtisseries artisanales — inspiré dans sa
structure (accueil, boutique produits, coffrets cadeaux, boutiques physiques,
histoire, contact, panier, espace équipe) de sites de vente en ligne de
gourmandises, mais avec sa propre identité, ses propres textes et son propre
produit (cookies, pas chocolat).

Stack : **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Prisma ·
Neon Postgres**.

## Fonctionnalités

- Vitrine publique : accueil, catalogue produits filtrable par catégorie,
  fiche produit, coffrets cadeaux, boutiques physiques, notre histoire,
  contact.
- Panier (persisté dans le navigateur) et tunnel de commande qui enregistre
  la commande en base (aucun paiement réel n'est effectué).
- Espace équipe protégé par mot de passe (`/admin`) :
  - tableau de bord (produits, commandes, chiffre d'affaires),
  - gestion des produits (créer / modifier / supprimer / masquer),
  - gestion des commandes (suivi du statut).

## Démarrer en local

```bash
npm install
npm run db:seed   # (re)peuple la base avec des catégories/produits/boutiques de démo
npm run dev
```

Le site est disponible sur http://localhost:3000, l'espace équipe sur
http://localhost:3000/admin.

## Variables d'environnement

Copiez `.env.example` vers `.env` et renseignez :

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | URL de connexion Postgres (Neon) |
| `ADMIN_PASSWORD` | Mot de passe pour accéder à `/admin` |
| `ADMIN_SESSION_SECRET` | Chaîne aléatoire longue utilisée pour signer le cookie de session admin |

**Important** : changez `ADMIN_PASSWORD` et `ADMIN_SESSION_SECRET` avant tout
déploiement public — les valeurs par défaut du dépôt sont uniquement pour le
développement local.

## Base de données

Le schéma est défini dans [`prisma/schema.prisma`](prisma/schema.prisma).

```bash
npx prisma db push     # synchronise le schéma avec la base
npm run db:seed        # réinitialise et repeuple les données de démo
npx prisma studio       # explorer la base dans une interface graphique
```

## Déployer sur Vercel

1. Poussez ce dépôt sur GitHub (ou un autre fournisseur Git).
2. Importez le projet sur [vercel.com/new](https://vercel.com/new).
3. Renseignez les variables d'environnement `DATABASE_URL`,
   `ADMIN_PASSWORD` et `ADMIN_SESSION_SECRET` dans les paramètres du projet
   Vercel (Project Settings → Environment Variables).
4. Déployez. Le build (`next build`) exécute automatiquement
   `prisma generate` (via `postinstall`) ; le schéma doit déjà être poussé
   sur la base Neon avec `npx prisma db push` avant le premier déploiement
   (déjà fait pour la base fournie).

## Avertissement

Projet de démonstration : aucun paiement réel n'est traité, et les contenus
(textes, recettes, adresses de boutiques) sont fictifs.
