import Product from "@/models/Product";
import { NotFoundError, Unauthorized } from "@/response/error.response";
import mongoose from "mongoose";


class productService {
    static createProduct = async (product) => {
        const productCreated = await Product.create(product);
        return productCreated;
    };

    static getAllProducts = async () => {
        const products = await Product.find();
        return products;
    }

    static getProduct = async (id) => {
        return Product.findById(id);
    }

    static updateProduct = async (id, userId, productDto) => {
        const product = await Product.findOne({ _id: id });
        if (!product) throw new NotFoundError(`No product with id: ${id}`);
        if (product.user.toString() !== userId)
            throw new Unauthorized(`Don't permision update this product`);

        await Product.updateOne({ _id: id }, productDto);
        return product;
    }

    static deleteProduct = async (id, userId) => {
        const product = await Product.findOne({ _id: id });
        if (!product) throw new NotFoundError(`No product with id: ${id}`);
        if (product.user.toString() !== userId)
            throw new Unauthorized(`Don't permision delete this product`);
        await product.deleteOne({ _id: id });
        return 'deteted';
    }
};

export default productService;