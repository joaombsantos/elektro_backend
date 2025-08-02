import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { addFavorite, removeFavoriteParams, userFavoriteParams } from "../schemas/FavoritesSchemas";

const prisma = new PrismaClient();

export class FavoritesController {

    public static async add(request: Request, response: Response) {
        try {
            const { userId } = userFavoriteParams.parse(request.params);
            const { productId } = addFavorite.parse(request.body);

            const newFavorite = await prisma.favorite.create({
                data: { userId, productId },
                include: { product: true }
            });

            return response.status(201).json(newFavorite);
        } catch (error: any) {
            if (error instanceof ZodError) {
                return response.status(400).json({ message: "Dados de entrada inválidos", errors: error.flatten().fieldErrors });
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return response.status(409).json({ message: "Este produto já está na lista de favoritos." });
            }
            return response.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    public static async list(request: Request, response: Response) {
        try {
            const { userId } = userFavoriteParams.parse(request.params);

            const favorites = await prisma.favorite.findMany({
                where: { 
                    userId 
                },
                orderBy: { 
                    createdAt: 'desc' 
                },
                include: { 
                    product: true
                },
            });

            const favoriteProducts = favorites.map(fav => fav.product);
            return response.status(200).json(favoriteProducts);
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    public static async remove(request: Request, response: Response) {
        try {
            const { userId, productId } = removeFavoriteParams.parse(request.params);

            await prisma.favorite.delete({
                where: {
                    userId_productId: { userId, productId },
                },
            });

            return response.status(204).send();
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }
}