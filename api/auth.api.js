import http from 'k6/http';
import { ENV } from '../config/env.config.js';

export function login(username, password) {
    const payload = JSON.stringify({ username, password });
    const params = {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'login_endpoint' }
    };

    return http.post(`${ENV.BASE_URL}/auth/login`, payload, params);
}