const express = require('express');

class ApiController {
    constructor(db) {
        this.app = express();
        this.db = db;
        this.routes();
    }

    routes() {
        this.app.get('/premios', (req, res) => {
            this.db.all(`SELECT * FROM premios`, [], (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json(rows);
                }
            });
        });
    }

    start(port) {
        this.app.listen(port, () => {
            console.log(`API iniciada e respondendo em http://localhost:${port}`)
        });
    }
}

module.exports = ApiController;