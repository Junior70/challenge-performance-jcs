export const ENV = {
    BASE_URL: 'https://dummyjson.com',
    TARGET_TPS: __ENV.TPS ? parseInt(__ENV.TPS) : 50,
    TEST_TYPE: __ENV.TYPE || 'load_test'
};