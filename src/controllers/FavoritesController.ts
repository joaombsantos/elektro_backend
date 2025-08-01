import { Prisma, PrismaClient } from "../generated/prisma";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class FavoritesController{
    
    public static async create(request: Request, response: Response){
        try{

            response.status(201).json();
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

    public static async read(request: Request, response: Response){
        try{

            response.status(200).json();
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

    public static async readAll(request: Request, response: Response){
        try{

            response.status(200).json();
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

    public static async update(request: Request, response: Response){
        try{

            response.status(200).json();
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

    public static async delete(request: Request, response: Response){
        try{

            response.status(200).json();
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

}