const PocketBase = require('pocketbase/cjs');
const fs = require('fs');

async function init() {
    const pb = new PocketBase('http://pb:8080');

    const email = process.argv[2] || 'admin@exportcoffee.com';
    const password = process.argv[3] || 'admin12345678';

    console.log(`Intentando autenticar como ${email}...`);

    try {
        // Autenticar como superusuario (PocketBase 0.30+)
        await pb.collection('_superusers').authWithPassword(email, password);
        console.log('Autenticación exitosa.');

        // Leer el esquema
        const schema = JSON.parse(fs.readFileSync('./pb_schema.json', 'utf8'));

        console.log('Importando colecciones...');

        for (const collection of schema) {
            try {
                // Forzar reglas públicas para desarrollo
                collection.listRule = "";
                collection.viewRule = "";
                collection.createRule = "";
                collection.updateRule = "";
                collection.deleteRule = "";

                try {
                    await pb.collections.create(collection);
                    console.log(`Colección '${collection.name}' creada.`);
                } catch (err) {
                    if (err.status === 400) {
                        // Si ya existe, actualizar las reglas
                        await pb.collections.update(collection.name, {
                            listRule: "",
                            viewRule: "",
                            createRule: "",
                            updateRule: "",
                            deleteRule: ""
                        });
                        console.log(`Colección '${collection.name}' ya existía, reglas actualizadas a públicas.`);
                    } else {
                        throw err;
                    }
                }
            } catch (err) {
                console.error(`Error con colección ${collection.name}:`, err.message);
            }
        }

        console.log('¡Inicialización completada con éxito!');
    } catch (err) {
        console.error('Error durante la inicialización:', err.message);
        console.log('\nRECORDATORIO: Primero debes crear tu cuenta de admin en http://localhost:8090/_/');
    }
}

init();
