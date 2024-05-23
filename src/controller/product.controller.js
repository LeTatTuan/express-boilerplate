import { CREATED, SuccessResponse } from "@/response/success.response";
import productService from "@/services/product.service.js";

const productController = {
    createProduct: async (req, res) => {
        req.body.user = req.user?.userId;
        new CREATED({
            message: 'add a new product success',
            metadata: await productService.createProduct(req.body)
        }).send(res);
    },

    getAllProducts: async (req, res) => {
        new SuccessResponse({
            message: 'success get all products',
            metadata: await productService.getAllProducts()
        }).send(res);
    },

    getProduct: async (req, res) => {
        const productId = req.params?.id;
        new SuccessResponse({
            message: 'get a product success',
            metadata: await productService.getProduct(productId)
        }).send(res);
    },

    updateProduct: async (req, res) => {
        const productId = req.params?.id;
        const userId = req.user?.userId;
        const productDto = req.body;
        new SuccessResponse({
            message: 'update product success',
            metadata: await productService.updateProduct(productId, userId, productDto)
        }).send(res);
    },

    deleteProduct: async (req, res) => {
        const productId = req.params?.id;
        const userId = req.user?.userId;
        new SuccessResponse({
            message: 'delete product success',
            metadata: await productService.deleteProduct(productId, userId)
        }).send(res);
    }
}

export default productController;