import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {
  jUnit,
  textSummary,
} from "https://jslib.k6.io/k6-summary/0.0.2/index.js";

export function generateReports(data, typeTest) {
  const type = typeTest.toUpperCase().replace(/_/g, " ");
  const basePath = `./reports/output`;

  // Fecha ajustada a Lima (UTC-5)
  const date = new Date();
  date.setHours(date.getHours() - 5);
  const limaDate = date.toISOString().replace("T", " ").substring(0, 19);
  const limaDateStr = date
    .toISOString()
    .replace("T", "_")
    .substring(0, 19)
    .replace(/:/g, "-");

  // Extracción segura de métricas
  const totalRequests = data.metrics.http_reqs?.values.count || 0;
  const rps = data.metrics.http_reqs?.values.rate || 0; // Requests per second
  const iterCount = data.metrics.iterations?.values.count || 0;
  const iterRate = data.metrics.iterations?.values.rate || 0;

  // Inyectamos la metadata en el JSON
  data.metadata_entorno = {
    fecha_reporte: limaDate,
  };

  // Evita errores visuales en los reportes
  delete data.metrics.dropped_iterations;

  const tituloReporte = `REPORTE DE RENDIMIENTO ${limaDate} - (${type})`;

  let htmlBencUk = htmlReport(data, { title: tituloReporte });

  const customCss = `
    <style>
        html { background-color: #ffffff !important; }
        body {
            margin: 0; padding: 0; zoom: 0.85;
            background: transparent !important;
            min-height: 100vh;
        }
        body::before {
            content: ""; position: fixed; top: 0; left: 0;
            width: 100%; height: 100%; z-index: -1;
            background-position: center !important; pointer-events: none; opacity: 1;
        }
        body > .container {
            position: relative; z-index: 10; background-color: #ffffff !important;
            margin: 50px auto !important; border-radius: 15px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
            max-width: 1400px !important; padding: 20px !important;
        }
        .navbar-brand { display: flex !important; align-items: center !important; }
        .navbar-brand::before {
            content: ""; display: inline-block; width: 180px; height: 40px;
            background-repeat: no-repeat; background-size: contain; margin-right: 15px;
        }
        footer { background: transparent !important; padding: 20px; }
    </style>
    </head>`;

  htmlBencUk = htmlBencUk
    .replace("</head>", customCss)
    .replace(
      /<footer[\s\S]*?<\/footer>/,
      '<footer class="footer"><div class="container text-center small">Reporte Generado K6</div></footer>',
    );

  // ====================================================================
  // C. SALIDAS DE CONSOLA
  // ====================================================================
  const resumenGlobal = textSummary(data, { indent: " ", enableColors: true });
  const mensajeCustom = `
  \n\n
  TEST FINALIZADO: ${type}\n
  Hora Reporte: ${limaDate}\n
 --------------------------------------------------
 A Nivel Técnico (Servidores):
    - Total HTTP Requests : ${totalRequests}
    - Promedio            : ${rps.toFixed(2)} req/s (RPS)

 A Nivel Negocio (Flujos Completados):
    - Total Iteraciones   : ${iterCount}
    - Promedio            : ${iterRate.toFixed(2)} iter/s
 --------------------------------------------------\n\n`;

  // ====================================================================
  // D. GUARDAR TODO EN EL DISCO
  // ====================================================================
  return {
    // 🔧 EL HTML CLÁSICO DE BENC-UK (Le agregamos _tecnico al nombre)
    [`${basePath}/results_${typeTest.toLowerCase()}_tecnico_${limaDateStr}.html`]:
      htmlBencUk,

    // FORMATOS ESTÁNDAR
    [`${basePath}/results_${typeTest.toLowerCase()}_${limaDateStr}.json`]:
      JSON.stringify(data, null, 2),
    [`${basePath}/summary_${typeTest.toLowerCase()}_${limaDateStr}.txt`]:
      textSummary(data, {
        indent: " ",
        enableColors: false,
      }),
    [`${basePath}/junit_${typeTest.toLowerCase()}_${limaDateStr}.xml`]:
      jUnit(data),
    stdout: resumenGlobal + mensajeCustom,
  };
}
