import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";

const user = z.object({
    name: z
        .string({message: "O nome deve ser uma string"})
        .min(8, {message: "O nome deve ter no mínimo 8 caracteres"}),
    
    email: z
        .email({message: "O email deve ser válido"}),
    
    password: z
        .string({message: "A senha deve ser uma string"})
        .min(8, {message: "A senha deve ter pelo menos 8 caracteres"})
        .regex(/[A-Z]/, {message: "A senha deve ter conter pelo menos uma letra maiúscula"})
        .regex(/[0-9]/, {message: "A senha deve ter conter pelo menos um número"})
        .regex(/[^a-zA-Z0-9]/, {message: "A senha conter um caractere especial"}),
    
    cpf: z
        .string()
        .refine(cpf.isValid, {message: "CPF inválido"}),

    phoneNumber: z
        .string("O número de telefone deve ser uma string"),

    address: z
        .string()
        .optional(),

    profilePictureUrl: z
        .string()
        .url({ message: "A URL da foto de perfil deve ser válida." })
        .optional(),
});

export const createUser = user;

export const updateUser = user.partial()

export const userParams = z.object({
    userId: z
        .string()
        .uuid({ message: "O ID do usuário na URL deve ser um UUID válido." }),
})