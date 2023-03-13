import { expect } from 'chai';
import supertest from 'supertest';
import app from '../index.js';
import chai from 'chai';

import chaiHttp from 'chai-http';
chai.use(chaiHttp);

const request = supertest(app);

describe('Server', () => {
    it('should listen on the correct port', async () => {
        const res = await request.get('/metrics');
        expect(res.statusCode).to.equal(200);
    });
});

describe('GET /metrics', () => {
    it('should return the correct content type', async () => {
        const res = await request.get('/metrics');
        expect(res.headers['content-type']).to.include('text/plain');
    });

    it('should return a 404 status code for non-existent routes', async () => {
        const res = await request.get('/nonexistent');
        expect(res.statusCode).to.equal(404);
    });

});

