import { PrismaClient } from "@prisma/client";
import {fakerPT_BR} from "@faker-js/faker"

export async function productSeeder(prisma: PrismaClient, numProducts: number){
    const products = [];

  for (let i = 0; i < numProducts; i++) {
    products.push({
      name: fakerPT_BR.commerce.product(),
      description: fakerPT_BR.commerce.productDescription(),
      price: parseFloat(fakerPT_BR.commerce.price({ min: 10, max: 8000 })),
      category: fakerPT_BR.commerce.department(),
      stockQuantity: fakerPT_BR.number.int({ min: 0, max: 200 }),
      photoUrl: fakerPT_BR.image.urlLoremFlickr({ category: 'technics' }),
    });
  }

  console.log(`Inserindo ${products.length} produtos no banco de dados...`);

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
    
}