import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createUser, updateUser, userParams } from "../schemas/UserSchemas";
import auth from "../config/auth";

const prisma = new PrismaClient();

export class UserController {

    public static async signUp(request: Request, response: Response) {
        try {
            const { name, cpf, phoneNumber, email, password } = createUser.parse(request.body);

            const { hash, salt } = auth.generatePassword(password);

            const createdUser = await prisma.user.create({
                data: {
                    name,
                    cpf,
                    phoneNumber,
                    email,
                    hash,
                    salt,
                },
            });

            response.status(201).json(createdUser);
        } catch (error: any) {
            response.status(500).json({ message: error.message });
        }
    }

    public static async signIn(request: Request, response: Response) {
        try {
            const { email, password } = request.body;
            if (!email || !password) {
                return response.status(400).json({ message: "Preencha os campos email e senha." });
            }

            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                return response.status(404).json({ message: "User not found." });
            }

            if (!auth.checkPassword(password, user.hash, user.salt)) {
                return response.status(401).json({ message: "Senha invalida." });
            }

            const token = auth.generateJWT(user);

            response.status(201).json({ token: token });
        } catch (error: any) {
            response.status(500).json({
                message: error.message,
            });
        }
    }

    public static async getMyData(request: Request, response: Response) {
        try {
            const { userId } = userParams.parse(request.params);

            if (!userId) {
                return response.status(401).json({ message: "Usuário não autenticado." });
            }

            const foundUser = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

            if (!foundUser) {
                return response.status(404).json({ message: "Usuário não encontrado." });
            }

            const { hash, salt, ...userData } = foundUser;

            response.status(200).json(userData);
        } catch (error: any) {
            response.status(500).json({
                message: error.message,
            });
        }
    }

    public static async readAll(request: Request, response: Response) {
        try {
            const foundUsers = await prisma.user.findMany({});

            response.status(200).json(foundUsers);
        } catch (error: any) {
            response.status(500).json({ message: error.message });
        }
    }

    public static async update(request: Request, response: Response) {
        try {
            const { userId } = userParams.parse(request.params);
            if (!userId) {
                return response.status(401).json({ message: "Usuário não autenticado." });
            }

            const data = updateUser.parse(request.body);

            const updatedUser = await prisma.user.update({
                where: {
                    id: userId,
                },
                data: data,
            });

            response.status(200).json(updatedUser);
        } catch (error: any) {
            response.status(500).json({ message: error.message });
        }
    }

    public static async delete(request: Request, response: Response) {
        try {
            const { userId } = userParams.parse(request.params);

            if (!userId) {
                return response.status(401).json({ message: "Usuário não autenticado." });
            }

            const deletedUser = await prisma.user.delete({
                where: {
                    id: userId,
                },
            });

            response.status(200).json(deletedUser);
        } catch (error: any) {
            response.status(500).json({ message: error.message });
        }
    }

    public static async updatePhoto(request: Request, response: Response) {
        try {
            const { userId } = userParams.parse(request.params);
            const file = request.file;

            const image = file ? `/uploads/photos/${file.filename}` : undefined

            const userUpdate = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    profilePictureUrl: image
                }
            });

            response.status(200).json(userUpdate)
        } catch (error: any) {
            response.status(500).json({ message: error.message });
        }
    }
}
