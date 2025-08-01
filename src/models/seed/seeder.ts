import { PrismaClient } from "@prisma/client";
import { productSeeder } from "./ProductSeeder";

const prisma = new PrismaClient

async function main(){
    prisma.$connect();
    
    productSeeder(prisma, 40)
}

main()
    .then(async () => {
        prisma.$disconnect();
    })
    .catch(async (e: any) => {
        console.log(e);
        prisma.$disconnect();
    })