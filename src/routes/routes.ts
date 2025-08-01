import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { ProductController } from "../controllers/ProductController";
import { photoUpload } from "../config/multer";
import { authenticate } from "../middlewares/authentication";

const router = Router();

// Rotas para usuários
router.get("/user", UserController.readAll);
router.post("/sign-up/", UserController.signUp);
router.post("/sign-in/", UserController.signIn);
router.get("/me/", authenticate, UserController.getMyData);
router.put("/user/", authenticate, UserController.update);
router.delete("/user/", authenticate, UserController.delete);
router.post("/userPhoto/:id", authenticate, photoUpload.single("image"), UserController.updatePhoto);

// Rotas para produtos
router.get("/products", ProductController.readAll);
router.post("/products", ProductController.create);
router.get("/products/:productId", ProductController.read);
router.put("/products/:productId", ProductController.update);
router.delete("/products/:productId", ProductController.delete);
router.post("/productsPhoto/:productId", photoUpload.single("image"), ProductController.updatePhoto);

export default router;