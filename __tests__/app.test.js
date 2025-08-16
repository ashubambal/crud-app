const request = require('supertest');
const { app, db } = require('../app');

beforeAll((done) => {
  // Ensure the test table exists before running tests
  const sql = `
    CREATE TABLE IF NOT EXISTS items(
      id INT AUTO_INCREMENT,
      name VARCHAR(255),
      PRIMARY KEY(id)
    )
  `;
  db.query(sql, (err) => {
    if (err) throw err;
    done();
  });
});

afterAll((done) => {
  // Clean up database after tests
  db.query('DROP TABLE IF EXISTS items', (err) => {
    if (err) throw err;
    db.end(); // Close MySQL connection
    done();
  });
});

describe('CRUD API Endpoints', () => {
  let createdItemId;

  test('POST /addItem - should add a new item', async () => {
    const response = await request(app)
      .post('/addItem')
      .send({ name: 'Test Item' });
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Item added...');
  });

  test('GET /getItems - should get all items', async () => {
    const response = await request(app).get('/getItems');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    createdItemId = response.body[0].id;
  });

  test('GET /getItem/:id - should get item by ID', async () => {
    const response = await request(app).get(`/getItem/${createdItemId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe('Test Item');
  });

  test('PUT /updateItem/:id - should update item name', async () => {
    const response = await request(app)
      .put(`/updateItem/${createdItemId}`)
      .send({ name: 'Updated Item' });
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Item updated...');
  });

  test('GET /search/:name - should find item by name', async () => {
    const response = await request(app).get('/search/Updated');
    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe('Updated Item');
  });

  test('GET /countItems - should return total items', async () => {
    const response = await request(app).get('/countItems');
    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBeGreaterThan(0);
  });

  test('DELETE /deleteItem/:id - should delete an item', async () => {
    const response = await request(app).delete(`/deleteItem/${createdItemId}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Item deleted...');
  });
});
