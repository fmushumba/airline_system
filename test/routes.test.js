import request from 'supertest';
import express from 'express';
import app from '../index.js';
import { client, stripe } from '../index.js' // Ensure this points to the file where your Express app is exported
import { Chai as chai } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import User from '../server/models/user.js';  // Adjust path as necessary

// Configure chai to use chaiHttp for handling HTTP requests
chai.use(chaiHttp);

describe('Route Tests', function () {
    it('GET / should render the home page', function (done) {
        request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', /html/, done);
    });

    it('GET /support should redirect when not authenticated', function (done) {
        request(app)
            .get('/support')
            .expect(302)
            .expect('Location', /sign_in_form/, done);
    });

    it('GET /sign_in_form should render the sign-in form when not authenticated', function (done) {
        request(app)
            .get('/sign_in_form')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/sign up/, done);
    });
});

describe('User Registration', () => {
    afterEach(() => {
        // Restore original methods after each test
        sinon.restore();
    });

    it('should register a user successfully', async () => {
        const user = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123'
        };

        // Stub the User model methods to simulate successful registration
        sinon.stub(User.prototype, 'setFirstName').returns(false);
        sinon.stub(User.prototype, 'setLastName').returns(false);
        sinon.stub(User.prototype, 'setEmail').returns(false);
        sinon.stub(User.prototype, 'setPassword').resolves(false);
        sinon.stub(User.prototype, 'save').resolves({});

        const res = await chai.request(app)
            .post('/register')
            .send(user);

        expect(res).to.have.status(200);
        expect(res).to.redirect; // Check redirection
    });

    it('should return an error if the first name is invalid', async () => {
        const user = {
            firstName: '',  // Invalid first name
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123'
        };


        sinon.stub(User.prototype, 'setFirstName').returns('Invalid first name');

        const res = await chai.request(app)
            .post('/register')
            .send(user);

        expect(res).to.have.status(400);
        expect(res.body.error).to.deep.include({
            code: 400,
            type: 'first name',
            message: 'Invalid first name'
        });
    });
});

describe('Integration Tests for Express App', function () {
    before(async () => {
        // Optional: connect to a test database
        // Setup any required stubs for external services
        sinon.stub(stripe.charges, 'create').resolves({ id: '12345', amount: 1000 });
    });

    after(() => {
        sinon.restore();  // Restore all stubs
    });

    it('should authenticate user successfully and redirect to support page', async () => {
        // Mock the database response or the authentication middleware as needed
        sinon.stub(User, 'findOne').resolves(new User({ email: 'test@example.com', password: bcrypt.hashSync('password', 10) }));

        const res = await request.post('/login').send({ email: 'test@example.com', password: 'password' });
        expect(res).to.have.status(200);
        expect(res).to.redirectTo('/support');
    });

    it('should handle user registration and interact with the database', async () => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'securepassword123'
        };

        const res = await request.post('/register').send(userData);
        expect(res).to.have.status(200);
        expect(res).to.redirectTo('/sign_in_form');
        // Verify that user data is saved to the database
    });

    it('GET / should render the home page', async () => {
        const res = await request.get('/');
        expect(res).to.have.status(200);
        expect(res.text).to.include('<html>');
    });
});
