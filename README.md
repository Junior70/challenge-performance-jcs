# K6 Performance Test Project - API DummyJSON

Este proyecto contiene pruebas de rendimiento desarrolladas con **k6** para evaluar la capacidad, estabilidad y tiempos de respuesta del endpoint de creación de productos de DummyJSON:

```text
POST /products/add
```

Las pruebas se ejecutan bajo cargas controladas de:

* 50 TPS
* 100 TPS

---

## 1. Requisitos

Tener instalado:

* k6
* Git

Verificar la instalación de k6:

```bash
k6 version
```

Se recomienda utilizar **k6 v0.45.0 o superior**.

### Instalación en Windows

```bash
winget install k6
```

### Instalación en Mac

```bash
brew install k6
```

---

## 2. Descargar el proyecto

Clonar el repositorio:

```bash
git clone https://github.com/Junior70/challenge-performance-jcs
```

Ingresar al proyecto:

```bash
cd <nombre-del-proyecto>
```

---

## 3. Estructura del proyecto

```text
k6-performance-project/
│
├── api/
│   ├── auth.api.js
│   └── product.api.js
│
├── config/
│   └── env.config.js
│
├── reports/
│   ├── libs/
│   │   ├── k6-reporter.js
│   │   └── k6-summary.js
│   │
│   ├── output/
│   └── config-report.js
│
├── scenarios/
│   └── load.scenario.js
│
├── main.test.js
│
└── README.md
```

Los archivos dentro de `reports/libs/` son utilizados para generar los reportes de la ejecución.

---

# 4. Ejecución de las pruebas

Las pruebas reciben los parámetros de ejecución mediante variables de entorno.

La ejecución se realiza desde la raíz del proyecto.

## Prueba a 50 TPS

```bash
k6 run -e TPS=50 -e TYPE=50_TPS main.test.js
```

## Prueba a 100 TPS

```bash
k6 run -e TPS=100 -e TYPE=100_TPS main.test.js
```

---

# 5. Reportes

Al finalizar la ejecución, k6 genera automáticamente los reportes en:

```text
reports/output/
```

Para una ejecución de 50 TPS:

```text
reports/
└── output/
    ├── results-50_TPS.html
    ├── results-50_TPS.json
    ├── summary-50_TPS.txt
    └── junit.xml
```

Para una ejecución de 100 TPS:

```text
reports/
└── output/
    ├── results-100_TPS.html
    ├── results-100_TPS.json
    ├── summary-100_TPS.txt
    └── junit.xml
```

Los reportes contienen información como:

* Total de requests.
* Requests por segundo (RPS).
* Tiempo de respuesta.
* Porcentaje de errores.
* Iteraciones.
* Virtual Users (VUs).
* Thresholds.
* Cumplimiento de los SLAs.

---

# 6. Reporte HTML

El archivo:

```text
results-{TYPE}.html
```

contiene un dashboard de la ejecución que permite revisar visualmente los principales resultados de la prueba.

Ejemplo:

```text
results-50_TPS.html
```

o:

```text
results-100_TPS.html
```

---

# 7. Ejecución completa

### 50 TPS

```bash
k6 run -e TPS=50 -e TYPE=50_TPS main.test.js
```

Luego revisar:

```text
reports/output/results-50_TPS.html
```

### 100 TPS

```bash
k6 run -e TPS=100 -e TYPE=100_TPS main.test.js
```

Luego revisar:

```text
reports/output/results-100_TPS.html
```

---

# 8. Consideraciones

* La autenticación se realiza mediante `setup()` para evitar ejecutar el login en cada iteración.
* Se utiliza **Constant Arrival Rate** para controlar la cantidad de TPS.
* Los datos enviados al endpoint se generan de forma única para evitar duplicados.
* Se utilizan tags para identificar las métricas de cada endpoint.
* Los Thresholds permiten validar automáticamente el cumplimiento de los criterios de rendimiento.

---

## Resumen

```text
Clonar proyecto
      ↓
Instalar k6
      ↓
k6 version
      ↓
Ejecutar prueba
      ↓
50 TPS / 100 TPS
      ↓
Generación de reportes
      ↓
reports/output/
      ↓
Revisar results-{TYPE}.html
```
