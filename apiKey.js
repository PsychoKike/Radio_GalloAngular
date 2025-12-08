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
app.post('/api/auth/login', (req, res) => {
    console.log('🔑 Intento de login recibido');
    
    // Asumiendo que el cuerpo (req.body) ya es el objeto { username, password, captcha }
    // En un sistema real, AQUI DEBERÍAS DESENCRIPTAR (si usas un cifrado híbrido)
    // Por ahora, usaremos req.body directamente, asumiendo que el cliente no lo está enviando encriptado aún.
    
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ ok: false, error: 'Faltan credenciales' });
    }

    try {
        // 1. Cargar la lista de locutores
        const locutores = leerBaseDeDatos();
        
        // 2. Buscar al locutor por el nombre de usuario
        const locutorEncontrado = locutores.find(
            locutor => locutor.username === username
        );

        // 3. Verificar si el locutor existe y si la contraseña es correcta
        if (!locutorEncontrado) {
            console.log(`❌ Login fallido: Usuario '${username}' no encontrado.`);
            // Usar un mensaje genérico por seguridad
            return res.status(401).json({ ok: false, error: 'Usuario o contraseña incorrectos.' });
        }

        // ⚠️ IMPORTANTE: En una aplicación real, la contraseña NUNCA debe guardarse
        // en texto plano. Debe usarse HASHING (ej: bcrypt).
        // Aquí comparamos texto plano, asumiendo que así lo guardaste con la ruta /api/locutores/guardar.
        if (locutorEncontrado.password !== password) {
            console.log(`❌ Login fallido: Contraseña incorrecta para ${username}.`);
            return res.status(401).json({ ok: false, error: 'Usuario o contraseña incorrectos.' });
        }
        
        // 4. Éxito: Generar y enviar un token
        // En una app real, usarías JWT (JSON Web Tokens)
        console.log(`✅ Login exitoso para el locutor: ${username}`);
        const token = `JWT_${username}_${Date.now()}`; // Token simple de ejemplo

        // Puedes agregar más datos si es necesario (ej: rol)
        return res.json({ 
            ok: true, 
            token: token,
            username: locutorEncontrado.username,
            rol: 'locutor' // Asignamos el rol fijo 'locutor'
        });

    } catch (error) {
        console.error('Error durante el proceso de login:', error);
        return res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
    }
});
// app.post('/auth/login', (req, res) => {
//     try {
//         // req.body.encrypted = lo que mande Angular
//         const decrypted = handleEncryptedRequest(req.body.encrypted);

//         console.log("Datos de login:", decrypted);

//         // Aquí validas usuario/contraseña
//         if (decrypted.username === "admin" && decrypted.password === "123") {
//             return res.json({
//                 ok: true,
//                 token: "TOKEN_DE_EJEMPLO"
//             });
//         }

//         return res.status(401).json({ ok: false, error: "Credenciales inválidas" });

//     } catch (error) {
//         return res.status(400).json({ ok: false, error: error.message });
//     }
// });
app.listen(3000, () => console.log("NODE corriendo en Ubuntu puerto 3000"));