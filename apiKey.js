// index.js o donde tengas tu endpoint de Express
require('dotenv').config(); // Asegúrate de usar una librería como dotenv para cargar el archivo .env

const { decryptHybrid } = require('./crypto_utils');

// 1. Cargar la llave privada desde el entorno.
// El .replace(/\\n/g, '\n') es esencial para que Node.js la interprete
// correctamente como una llave PEM con saltos de línea reales.
const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n'); 

// ... En tu ruta/getter ...

function handleEncryptedRequest(encryptedBody) {
    try {
        // 2. Usar la llave cargada para la desencriptación
        const decryptedData = decryptHybrid(encryptedBody, RSA_PRIVATE_KEY);
        
        console.log("Datos listos para procesar:", decryptedData);
        return decryptedData;
        
    } catch (error) {
        // Manejo de errores si la llave es incorrecta o los datos fueron alterados
        console.error("Fallo al desencriptar la petición:", error);
        throw new Error("Datos inválidos o no autorizados.");
    }
}