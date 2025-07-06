import { useState, useEffect } from 'react';
import { getDetailProductById } from '../services/APIService';

export const useProductDetails = (productIds) => {
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productIds || productIds.length === 0) return;

        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const productPromises = productIds.map(async (id) => {
                    // Skip if already loaded
                    if (products[id]) return { id, data: products[id] };

                    try {
                        const response = await getDetailProductById(id);
                        return { id, data: response.data.productDto };
                    } catch (err) {
                        console.error(`Failed to fetch product ${id}:`, err);
                        return { id, data: null };
                    }
                });

                const results = await Promise.all(productPromises);

                const newProducts = results.reduce((acc, { id, data }) => {
                    if (data) {
                        acc[id] = data;
                    }
                    return acc;
                }, { ...products });

                setProducts(newProducts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productIds]);

    return { products, loading, error };
};
