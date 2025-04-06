import { Router, Request, Response, NextFunction } from "express";

const paigeRouter = Router();

// Simulated dataset (in production, will replace with db queries)
const products = Array.from({ length: 100}, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: i % 2 === 0 ? 'Category A' : 'Category B',
    price: Math.floor(Math.random() * 100) + 1,
}));

// GET /api/products - Paginate and filter products
paigeRouter.get('/products', (req: Request, res: Response, next: NextFunction) => {
    try {
        // Parse query params for pagination and filtering
        const page = parseInt(req.query.page as string, 10) || 1;
        const perPage = parseInt(req.query.perPage as string, 10) || 10;
        const category = req.query.category as string | undefined;

        // Filter products by category if provided
        let filteredProducts = products;
        if (category) {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }

        const total = filteredProducts.length;
        const totalPages = Math.ceil(total / perPage);
        const start = (page - 1) * perPage;
        const paginatedProducts = filteredProducts.slice(start, start + perPage);

        res.json({
            data: paginatedProducts,
            meta: {
                total,
                page,
                perPage,
                totalPages,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default paigeRouter;