const PocketBase = require('pocketbase/cjs');

async function reset() {
    const pb = new PocketBase('http://pb:8080');
    try {
        await pb.collection('_superusers').authWithPassword('admin@exportcoffee.com', 'admin12345678');
        
        console.log('Borrando colecciones antiguas...');
        const collections = ['procesos', 'lotes', 'caficultores'];
        for (const name of collections) {
            try {
                await pb.collections.delete(name);
                console.log(`Colección '${name}' borrada.`);
            } catch (e) {}
        }

        console.log('Creando colección: caficultores');
        const caficultores = await pb.collections.create({
            name: "caficultores",
            type: "base",
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: "",
            fields: [
                { name: "nombre", type: "text", required: true },
                { name: "finca", type: "text", required: true },
                { name: "region", type: "text", required: true }
            ]
        });

        console.log('Creando colección: lotes');
        const lotes = await pb.collections.create({
            name: "lotes",
            type: "base",
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: "",
            fields: [
                { 
                    name: "caficultor", 
                    type: "relation", 
                    required: true, 
                    options: { collectionId: caficultores.id, maxSelect: 1, cascadeDelete: true } 
                },
                { name: "variedad", type: "text", required: true },
                { name: "altura", type: "number", required: true },
                { name: "peso_inicial", type: "number", required: true },
                { name: "fecha_cosecha", type: "date", required: true }
            ]
        });

        console.log('Creando colección: procesos');
        await pb.collections.create({
            name: "procesos",
            type: "base",
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: "",
            fields: [
                { 
                    name: "lote", 
                    type: "relation", 
                    required: true, 
                    options: { collectionId: lotes.id, maxSelect: 1, cascadeDelete: true } 
                },
                { name: "tipo", type: "text", required: true },
                { name: "sub_tipo", type: "text", required: true },
                { name: "temperatura", type: "number" },
                { name: "humedad", type: "number" },
                { name: "notas", type: "text" }
            ]
        });

        console.log('¡Reset completado y estructura correcta!');
    } catch (err) {
        console.error('Error:', err.message);
        if (err.data) {
           console.error('Detalles:', JSON.stringify(err.data, null, 2));
        }
    }
}

reset();
