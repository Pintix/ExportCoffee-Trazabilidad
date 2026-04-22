const PocketBase = require('pocketbase/cjs');
const fs = require('fs');

async function init() {
    const pb = new PocketBase('http://127.0.0.1:8090');

    const email = process.argv[2] || 'admin@exportcoffee.com';
    const password = process.argv[3] || 'admin12345678';

    console.log(`Intentando autenticar como ${email}...`);

    try {
        // Autenticar como administrador
        await pb.admins.authWithPassword(email, password);
        console.log('Autenticación exitosa.');

        // Leer el esquema
        const schema = JSON.parse(fs.readFileSync('./pb_schema.json', 'utf8'));

        console.log('Importando colecciones...');

        for (const collection of schema) {
            try {
                await pb.collections.create(collection);
                console.log(`Colección '${collection.name}' creada.`);
            } catch (err) {
                if (err.status === 400) {
                    console.log(`Colección '${collection.name}' ya existe, omitiendo.`);
                } else {
                    throw err;
                }
            }
        }

        console.log('¡Inicialización completada con éxito!');
    } catch (err) {
        console.error('Error durante la inicialización:', err.message);
        console.log('\nRECORDATORIO: Primero debes crear tu cuenta de admin en http://localhost:8090/_/');
    }
}

init();
