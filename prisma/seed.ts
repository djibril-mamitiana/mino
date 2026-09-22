import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({
      data: { slug: "cookies-classiques", name: "Cookies classiques", order: 1 },
    }),
    prisma.category.create({
      data: { slug: "cookies-gourmands", name: "Cookies gourmands", order: 2 },
    }),
    prisma.category.create({
      data: { slug: "patisseries", name: "Pâtisseries", order: 3 },
    }),
    prisma.category.create({
      data: { slug: "coffrets-cadeaux", name: "Coffrets cadeaux", order: 4 },
    }),
  ]);

  const [classiques, gourmands, patisseries, coffrets] = categories;

  const products = [
    {
      slug: "cookie-pepites-chocolat",
      name: "Cookie pépites de chocolat",
      description:
        "Le grand classique : pâte moelleuse, pépites de chocolat noir fondantes et une pointe de fleur de sel.",
      priceCents: 350,
      emoji: "🍪",
      colorFrom: "#f5c37c",
      colorTo: "#c9863c",
      categoryId: classiques.id,
      featured: true,
    },
    {
      slug: "cookie-beurre-noisette",
      name: "Cookie beurre & noisette",
      description:
        "Un cookie riche en éclats de noisettes torréfiées, sur une base de beurre demi-sel.",
      priceCents: 380,
      emoji: "🌰",
      colorFrom: "#e6c088",
      colorTo: "#a9723f",
      categoryId: classiques.id,
      featured: false,
    },
    {
      slug: "cookie-double-chocolat",
      name: "Cookie double chocolat",
      description:
        "Pâte cacaotée intense parsemée de pépites de chocolat au lait, pour les amateurs de gourmandise.",
      priceCents: 390,
      emoji: "🍫",
      colorFrom: "#c69a6d",
      colorTo: "#7b4a2b",
      categoryId: gourmands.id,
      featured: true,
    },
    {
      slug: "cookie-caramel-beurre-sale",
      name: "Cookie caramel beurre salé",
      description:
        "Un cœur coulant de caramel au beurre salé enrobé d'une pâte croustifondante.",
      priceCents: 420,
      emoji: "🧈",
      colorFrom: "#f2c879",
      colorTo: "#b97a2e",
      categoryId: gourmands.id,
      featured: true,
    },
    {
      slug: "cookie-pistache-framboise",
      name: "Cookie pistache & framboise",
      description:
        "Une alliance surprenante entre la pistache torréfiée et des éclats de framboise acidulée.",
      priceCents: 430,
      emoji: "🍇",
      colorFrom: "#c7d99a",
      colorTo: "#7f9a4e",
      categoryId: gourmands.id,
      featured: false,
    },
    {
      slug: "cookie-vegan-flocons-avoine",
      name: "Cookie vegan flocons d'avoine",
      description:
        "Recette 100% végétale à base de flocons d'avoine, raisins secs et cannelle.",
      priceCents: 400,
      emoji: "🌾",
      colorFrom: "#e3d4a3",
      colorTo: "#a08a52",
      categoryId: gourmands.id,
      featured: false,
    },
    {
      slug: "muffin-myrtille",
      name: "Muffin à la myrtille",
      description:
        "Moelleux muffin garni de myrtilles fraîches, saupoudré de sucre perlé.",
      priceCents: 400,
      emoji: "🫐",
      colorFrom: "#b7c6e6",
      colorTo: "#5b6fa8",
      categoryId: patisseries.id,
      featured: false,
    },
    {
      slug: "brownie-noix-pecan",
      name: "Brownie noix de pécan",
      description:
        "Brownie dense et fondant, généreusement garni de noix de pécan grillées.",
      priceCents: 450,
      emoji: "🟫",
      colorFrom: "#a97c50",
      colorTo: "#5c3a1e",
      categoryId: patisseries.id,
      featured: true,
    },
    {
      slug: "coffret-decouverte",
      name: "Coffret Découverte (6 cookies)",
      description:
        "Un assortiment de 6 cookies signature pour découvrir tous nos parfums en un seul coffret.",
      priceCents: 1800,
      emoji: "🎁",
      colorFrom: "#f4b6c2",
      colorTo: "#c9718a",
      categoryId: coffrets.id,
      featured: true,
    },
    {
      slug: "coffret-prestige",
      name: "Coffret Prestige (12 pièces)",
      description:
        "Notre plus belle sélection : 12 cookies et pâtisseries dans un écrin élégant, parfait pour offrir.",
      priceCents: 3200,
      emoji: "🎀",
      colorFrom: "#e3b8e0",
      colorTo: "#9a5c96",
      categoryId: coffrets.id,
      featured: true,
    },
  ];

  await prisma.product.createMany({ data: products });

  await prisma.store.createMany({
    data: [
      {
        name: "Boutique Paris — Rue de Rivoli",
        address: "24 rue de Rivoli",
        city: "Paris",
        postalCode: "75004",
        phone: "01 23 45 67 89",
        hours: "Lun–Dim : 9h – 19h30",
        order: 1,
      },
      {
        name: "Boutique Lyon — Presqu'île",
        address: "8 rue de la République",
        city: "Lyon",
        postalCode: "69002",
        phone: "04 23 45 67 89",
        hours: "Mar–Dim : 9h – 19h",
        order: 2,
      },
      {
        name: "Boutique Bordeaux — Centre",
        address: "15 rue Sainte-Catherine",
        city: "Bordeaux",
        postalCode: "33000",
        phone: "05 23 45 67 89",
        hours: "Mar–Dim : 9h30 – 19h",
        order: 3,
      },
    ],
  });

  console.log(`Créé : ${categories.length} catégories, ${products.length} produits, 3 boutiques.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
