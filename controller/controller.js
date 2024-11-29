const express = require('express');

class ApiController {
    constructor(db) {
        this.app = express();
        this.db = db;
        this.producerService = new (require('../service/producers'))(db);
        this.routes();
    }

    routes() {
        this.app.get('/premios', async (req, res) => {
            try {
                const aggregate = await this.producerService.getAggregate();
                res.json(aggregate);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }

    start(port) {
        this.server = this.app.listen(port, () => {
            console.log(`API iniciada e respondendo em http://localhost:${port}`)
        });
    }

    getServer() {
        return this.server;
    }

    getApp() {
        return this.app;
    }
}

module.exports = ApiController;
