const Database = require('./database/initDb');
const ApiController = require('./controller/controller');
const loadCsvToDatabase = require('./database/loadCsv');


const PORT = 3000;

async function startServer() {
    try {
        const dbInstance = new Database();
        await dbInstance.initialize();

        const db = dbInstance.getConnection();

        loadCsvToDatabase(db, './movielist.csv');
        const api = new ApiController(db);
        api.start(PORT);

    } catch(err) {
        console.error('Erro ao iniciar a aplicação:', err.message);
        process.exit(1);
    }
}

startServer();
