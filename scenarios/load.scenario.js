import { ENV } from '../config/env.config.js';

export const loadScenario = {
    scenarios: {
        creacion_constante: {
            executor: 'constant-arrival-rate',
            rate: ENV.TARGET_TPS,
            timeUnit: '1s',
            duration: '1m',
            preAllocatedVUs: 50,
            maxVUs: 200,
        },
    },
    thresholds: {
        'http_req_duration{name:create_product_endpoint}': ['p(95)<2000'],
        'http_req_duration{name:login_endpoint}': ['p(95)<1000'],
        'http_req_failed': ['rate<0.01'],
    },
};