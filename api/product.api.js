import http from 'k6/http';
import { ENV } from '../config/env.config.js';

export function createProduct(token, title, price) {
    const payload = JSON.stringify({ title, price });
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        tags: { name: 'create_product_endpoint' }
    };

    return http.post(`${ENV.BASE_URL}/products/add`, payload, params);
}