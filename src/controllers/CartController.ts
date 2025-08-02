import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { cartItemSchema, cartParams, updateCart } from "../schemas/CartSchemas";

const prisma = new PrismaClient();

export class CartController {

    public static async addItem(request: Request, response: Response) {
        try {
            const { userId } = cartParams.parse(request.params);
            const { productId, quantity } = cartItemSchema.parse(request.body);

            const cartItem = await prisma.cartItem.upsert({
                where: {
                    userId_productId: { 
                        userId, productId 
                    }
                },
                update: {
                    quantity: { 
                        increment: quantity 
                    }
                },
                create: {
                    userId,
                    productId,
                    quantity
                }
            });

            response.status(200).json(cartItem);
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    public static async list(request: Request, response: Response) {
        try {
            const { userId } = cartParams.parse(request.params);

            const cartItems = await prisma.cartItem.findMany({
                where: { 
                    userId 
                },
                orderBy: { 
                    addedAt: 'desc' 
                },
                include: { 
                    product: true 
                }
            });

            response.status(200).json(cartItems);
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    public static async updateQuantity(request: Request, response: Response) {
        try {
            const { userId, productId } = cartParams.parse(request.params);
            const { quantity } = updateCart.parse(request.body);

            const updatedItem = await prisma.cartItem.update({
                where: {
                    userId_productId: { 
                        userId, 
                        productId 
                    }
                },
                data: {
                    quantity: quantity
                }
            });

            response.status(200).json(updatedItem);
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    public static async removeItem(request: Request, response: Response) {
        try {
            const { userId, productId } = cartParams.parse(request.params);

            await prisma.cartItem.delete({
                where: {
                    userId_productId: { 
                        userId, 
                        productId 
                    },
                }
            });

            response.status(204).send();
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    public static async clearCart(request: Request, response: Response) {
        try {
            const { userId } = cartParams.parse(request.params);

            await prisma.cartItem.deleteMany({
                where: { 
                    userId 
                }
            });

            response.status(204).send();
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }
}