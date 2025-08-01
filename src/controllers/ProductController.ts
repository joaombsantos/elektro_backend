import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createProduct, updateProduct, productParams } from "../schemas/ProductSchemas";

const prisma = new PrismaClient();

export class ProductController{
    
    public static async create(request: Request, response: Response){
        try{
            const data = createProduct.parse(request.body);
                        
            const createdProduct = await prisma.product.create({
                data
            });

            response.status(201).json(createdProduct);
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

    public static async read(request: Request, response: Response){
        try{
            const { productId } = productParams.parse(request.params);

            const foundProduct = await prisma.product.findUnique({
                where: {
                    id: productId
                }
            });

            response.status(200).json(foundProduct);
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

    public static async readAll(request: Request, response: Response){
        try{
            const { category, minPrice, maxPrice} = request.query;

            const whereClause: Prisma.ProductWhereInput = {};
            
            if (category){
                whereClause.category = {
                    equals: String(category),
                    mode: 'insensitive'
                };
            }
            const priceFilter: Prisma.DecimalFilter = {};

            if (minPrice && !isNaN(Number(minPrice))) {
                priceFilter.gte = Number(minPrice);
            }
            if (maxPrice && !isNaN(Number(maxPrice))) {
                priceFilter.lte = Number(maxPrice);
            }
            if (Object.keys(priceFilter).length > 0) {
                whereClause.price = priceFilter;
            }
            
            const foundProducts = await prisma.product.findMany({
                where: whereClause
            });
            
            response.status(200).json(foundProducts);
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

    public static async update(request: Request, response: Response){
        try{
            const { productId } = productParams.parse(request.params);
            const data = updateProduct.parse(request.body)

            const updatedProduct = await prisma.product.update({
                where: {
                    id: productId
                },
                data
            });
            response.status(200).json(updatedProduct);
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

    public static async delete(request: Request, response: Response){
        try{
            const { productId } = productParams.parse(request.params);

            const deletedProduct = await prisma.product.delete({
                where: {
                    id: productId
                },
            });
            response.status(200).json(deletedProduct);
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }

    public static async updatePhoto(request: Request, response: Response){
        try{
            const { productId } = productParams.parse(request.params);
            const file = request.file;

            const image = file ? `/uploads/photos/${file.filename}` : undefined

            const productUpdate = await prisma.product.update({
                where: {
                    id: productId
                },
                data:{
                    photoUrl: image
                }
            });

            response.status(200).json(productUpdate)
        } catch(error:any){
            response.status(500).json({message:error.message});
        }
    }
}