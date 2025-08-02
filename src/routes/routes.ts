import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { ProductController } from "../controllers/ProductController";
import { FavoritesController } from "../controllers/FavoritesController";
import { CartController } from "../controllers/CartController";
import { OrderController } from "../controllers/OrderController";
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

// Rotas para Favoritos
router.get("/favorites/user/:userId", FavoritesController.list);
router.post("/favorites/user/:userId", FavoritesController.add);
router.delete("/favorites/user/:userId/product/:productId", FavoritesController.remove);

// Rotas para Carrinhos

router.get("/cart/user/:userId", CartController.list);
router.post("/cart/user/:userId", CartController.addItem);
router.patch("/cart/user/:userId/product/:productId", CartController.updateQuantity);
router.delete("/cart/user/:userId/product/:productId", CartController.removeItem);
router.delete("/cart/user/:userId", CartController.clearCart);

// Rotas para Pedidos

router.get("/orders/user/:userId", OrderController.list);
router.post("/orders/user/:userId", OrderController.create);
router.get("/orders/:orderId", OrderController.show);

export default router;