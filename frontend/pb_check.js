const PocketBase = require('pocketbase/cjs');

async function check() {
    const pb = new PocketBase('http://pb:8080');
    try {
        await pb.collection('_superusers').authWithPassword('admin@exportcoffee.com', 'admin12345678');
        const records = await pb.collection('caficultores').getFullList();
        console.log('--- PRODUCTORES ENCONTRADOS ---');
        console.log(JSON.stringify(records, null, 2));
        console.log('-------------------------------');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

check();
