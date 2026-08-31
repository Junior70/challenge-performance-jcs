import { check } from 'k6';
import exec from 'k6/execution';
import { ENV } from './config/env.config.js';
import { login } from './api/auth.api.js';
import { createProduct } from './api/product.api.js';
import { loadScenario } from './scenarios/load.scenario.js';
import { generateReports } from './reports/config-report.js';

// Exportamos las opciones definidas en la capa de escenarios
export const options = loadScenario;

export function setup() {
    const loginRes = login('emilys', 'emilyspass');

    if (loginRes.status !== 200) {
        console.error(`[SETUP] Falla crítica en autenticación. Status: ${loginRes.status}`);
        throw new Error('Abortando prueba: Login fallido.');
    }

    return { token: loginRes.json('token') };
}

export default function (data) {
    const iterationId = exec.scenario.iterationInTest;
    const uniqueTitle = `Producto_${iterationId}_${Date.now()}`;

    const res = createProduct(data.token, uniqueTitle, 149.99);

    check(res, {
        'Status es 200 o 201': (r) => r.status === 200 || r.status === 201,
        'Contiene ID': (r) => r.json('id') !== undefined,
    });
}

// Hook de ciclo de vida de k6 para generar reportes al finalizar la prueba
export function handleSummary(data) {
    console.log('Generando reportes personalizados...');
    // Pasamos la data cruda de k6 y el tipo de prueba a tu script
    return generateReports(data, ENV.TEST_TYPE);
}