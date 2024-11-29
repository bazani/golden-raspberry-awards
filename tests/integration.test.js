const request = require('supertest');
const path = require('path');

const Database = require('../database/initDb');
const ApiController = require('../controller/controller');
const loadCsvToDatabase = require('../database/loadCsv');


let api;
let db;

beforeAll(async () => {
    const dbInstance = new Database();
    await dbInstance.initialize();
    db = dbInstance.getConnection();

    const csvPath = path.join(__dirname, '../movielist.csv');
    await loadCsvToDatabase(db, csvPath);

    api = new ApiController(db);
});

describe('API Integration Tests', () => {
  it('should return the producers with the smallest and largest intervals', async () => {
    const response = await request(api.getApp()).get('/premios');

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    expect(response.body.min[0]).toHaveProperty('producer');
    expect(response.body.min[0]).toHaveProperty('interval');
    expect(response.body.min[0]).toHaveProperty('previousWin');
    expect(response.body.min[0]).toHaveProperty('followingWin');
  });
});

afterAll(async () => {
    if (db) await db.close();
});
