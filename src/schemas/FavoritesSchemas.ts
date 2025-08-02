import { z } from "zod";

export const addFavorite = z.object({
  productId: z
    .string({ message: "O ID do produto deve ser uma String." })
    .uuid({ message: "O ID do produto deve ser um UUID válido." }),
});

export const userFavoriteParams = z.object({
  userId: z
    .string({ message: "O ID do usuário deve ser uma String." })
    .uuid({ message: "O ID do usuário na URL deve ser um UUID válido." }),
});

export const removeFavoriteParams = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
});