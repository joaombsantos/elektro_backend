import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z
    .string({ message: "O ID do produto deve ser uma string." })
    .uuid({ message: "O ID do produto deve ser um UUID válido." }),
  
  quantity: z
    .number({ message: "A quantidade é obrigatória." })
    .int({ message: "A quantidade deve ser um número inteiro." })
    .positive({ message: "A quantidade deve ser um número positivo." }),
});

export const updateCart = z.object({
    quantity: z
        .number()
        .int()
        .positive()
});

export const cartParams = z.object({
  userId: z
  .string({ message: "O ID do usuário deve ser uma string." })
  .uuid({ message: "O ID de usuário na URL deve ser um UUID válido." }),
  productId: z
  .string({ message: "O ID do produto deve ser uma string." })
  .uuid({ message: "O ID de produto na URL deve ser um UUID válido." }),
});