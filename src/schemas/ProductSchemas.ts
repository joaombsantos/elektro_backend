import { z } from "zod";

const product = z.object({
    name: z
        .string({message: "O nome deve ser uma string"}),

    photoUrl: z
        .string({message: "A URL deve ser uma string"})
        .url({message: "A URL da foto de perfil deve ser válida."})
        .optional(),

    price: z
        .number({ message: "O preço deve ser um número." })
        .nonnegative({message: "O preço não pode ser negativo."}),

    category: z
        .string({message: "A categoria deve ser uma string"}),

    stockQuantity: z
        .number({message: "A quantidade em estoque deve ser um número."})
        .int({message: "A quantidade em estoque deve ser um número inteiro."})
        .nonnegative({message: "O preço não pode ser negativo."}),

    description: z
        .string("A descrição deve ser um string.")
        .optional(),
});

export const createProduct = product;

export const updateProduct = product.partial();

export const productParams = z.object({
    productId: z
        .string()
        .uuid({message: "O ID do produto na URL deve ser um UUID válido."})
});