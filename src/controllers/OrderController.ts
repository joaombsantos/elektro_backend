import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { singleOrderParamsSchema, userOrderParamsSchema } from "../schemas/OrderSchemas";

const prisma = new PrismaClient();

export class OrderController {

    public static async create(request: Request, response: Response) {
        try {
            const { userId } = userOrderParamsSchema.parse(request.params);

            const cartItems = await prisma.cartItem.findMany({
                where: { userId },
                include: { product: true },
            });

            if (cartItems.length === 0) {
                return response.status(400).json({ message: "O carrinho está vazio. Não é possível criar um pedido." });
            }

            const totalValue = cartItems.reduce((total, item) => {
                return total + (item.quantity * Number(item.product.price));
            }, 0);

            const createdOrder = await prisma.$transaction(async (tx) => {
                const order = await tx.order.create({
                    data: {
                        userId: userId,
                        totalValue: totalValue,
                        status: 'PENDING',
                    },
                });

                const orderItemsData = cartItems.map(item => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: Number(item.product.price),
                }));

                await tx.orderItem.createMany({
                    data: orderItemsData,
                });

                await tx.cartItem.deleteMany({
                    where: { userId },
                });

                return order;
            });

            const finalOrder = await prisma.order.findUnique({
                where: { id: createdOrder.id },
                include: { items: { include: { product: true } } },
            });

            response.status(201).json(finalOrder);
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    public static async list(request: Request, response: Response) {
        try {
            const { userId } = userOrderParamsSchema.parse(request.params);

            const orders = await prisma.order.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            response.status(200).json(orders);
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    public static async show(request: Request, response: Response) {
        try {
            const { orderId } = singleOrderParamsSchema.parse(request.params);

            const order = await prisma.order.findUnique({
                where: {
                    id: orderId
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            });

            if (!order) {
                return response.status(404).json({ message: "Pedido não encontrado." });
            }

            response.status(200).json(order);
        } catch (error: any) {
            response.status(500).json({ message: "Erro interno no servidor." });
        }
    }
}