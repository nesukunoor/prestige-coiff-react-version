import { drizzle } from "drizzle-orm/mysql2";
import { products, services } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("Seeding database...");

  await db.insert(products).values([
    {
      name: "Shampooing Fortifiant Premium",
      description: "Shampooing revitalisant pour cheveux normaux à secs, enrichi en vitamines",
      price: 24990,
      category: "Shampoing",
      stock: 50,
      inStock: true,
      featured: true,
    },
    {
      name: "Cire Coiffante Professionnelle",
      description: "Tenue forte et fini mat naturel, parfaite pour tous les styles",
      price: 22500,
      category: "Coiffage",
      stock: 35,
      inStock: true,
      featured: true,
    },
    {
      name: "Huile à Barbe Premium",
      description: "Nourrit et assouplit la barbe, senteur boisée élégante",
      price: 29990,
      category: "Barbe",
      stock: 20,
      inStock: true,
      featured: true,
    },
    {
      name: "Baume Après-Rasage",
      description: "Apaisant et hydratant pour une peau douce après le rasage",
      price: 19990,
      category: "Soin",
      stock: 30,
      inStock: true,
      featured: true,
    },
  ]);

  await db.insert(services).values([
    {
      name: "Coupe Classique",
      description: "Coupe traditionnelle avec finitions précises et soignées",
      price: 25000,
      duration: 30,
      active: true,
    },
    {
      name: "Coupe Précision + Styling",
      description: "Coupe technique moderne avec styling personnalisé",
      price: 35000,
      duration: 45,
      active: true,
    },
    {
      name: "Taille de Barbe",
      description: "Modelage et entretien professionnel de la barbe",
      price: 20000,
      duration: 25,
      active: true,
    },
  ]);

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
