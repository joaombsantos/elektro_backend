import { z } from "zod";

export const userOrderParamsSchema = z.object({
  userId: z
  .string({ message: "O ID do usuário deve ser uma String." })
  .uuid({ message: "O ID de usuário na URL é inválido." }),
});

export const singleOrderParamsSchema = z.object({
  orderId: z
  .string({ message: "O ID do pedido deve ser uma String." })
  .uuid({ message: "O ID do pedido na URL é inválido." }),
});