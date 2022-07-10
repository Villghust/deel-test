const request = require('supertest');

const app = require('../src/app');

const { Profile, Contract, Job } = require('../src/model');

describe('Contracts', () => {
    describe('GET /contracts/:id', () => {
        beforeEach(async () => {
            await Profile.sync({ force: true });
            await Contract.sync({ force: true });
            await Job.sync({ force: true });

            await Promise.all([
                Profile.create({
                    id: 1,
                    firstName: 'Harry',
                    lastName: 'Potter',
                    profession: 'Wizard',
                    balance: 1150,
                    type: 'client',
                }),
                Profile.create({
                    id: 5,
                    firstName: 'John',
                    lastName: 'Lenon',
                    profession: 'Musician',
                    balance: 64,
                    type: 'contractor',
                }),
                Contract.create({
                    id: 1,
                    terms: 'bla bla bla',
                    status: 'terminated',
                    ClientId: 1,
                    ContractorId: 5,
                }),
            ]);
        });

        it('should return 401 when profile_id header mismatch with client or contractor', async () => {
            await request(app)
                .get('/contracts/1')
                .set('profile_id', '199')
                .expect(401);
        });

        it('should return 401 when profile_id header is not given', async () => {
            await request(app).get('/contracts/1').expect(401);
        });

        it('should return 404 when contract not found', async () => {
            await request(app)
                .get('/contracts/199')
                .set('profile_id', '5')
                .expect(404);
        });

        it('should return the contract when profile_id header matches with client', async () => {
            const { statusCode, body } = await request(app)
                .get('/contracts/1')
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject({
                id: 1,
                terms: 'bla bla bla',
                status: 'terminated',
                ClientId: 1,
                ContractorId: 5,
            });
        });

        it('should return the contract when profile_id header matches with contractor', async () => {
            const { statusCode, body } = await request(app)
                .get('/contracts/1')
                .set('profile_id', '5');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject({
                id: 1,
                terms: 'bla bla bla',
                status: 'terminated',
                ClientId: 1,
                ContractorId: 5,
            });
        });
    });

    describe('GET /contracts', () => {
        beforeEach(async () => {
            await Profile.sync({ force: true });
            await Contract.sync({ force: true });
            await Job.sync({ force: true });

            await Promise.all([
                Profile.create({
                    id: 1,
                    firstName: 'Harry',
                    lastName: 'Potter',
                    profession: 'Wizard',
                    balance: 1150,
                    type: 'client',
                }),
                Profile.create({
                    id: 5,
                    firstName: 'John',
                    lastName: 'Lenon',
                    profession: 'Musician',
                    balance: 64,
                    type: 'contractor',
                }),
                Contract.create({
                    id: 1,
                    terms: 'bla bla bla',
                    status: 'terminated',
                    ClientId: 1,
                    ContractorId: 5,
                }),
                Contract.create({
                    id: 2,
                    terms: 'bla bla bla 2',
                    status: 'in_progress',
                    ClientId: 1,
                    ContractorId: 5,
                }),
                Contract.create({
                    id: 3,
                    terms: 'bla bla bla 3',
                    status: 'new',
                    ClientId: 1,
                    ContractorId: 5,
                }),
            ]);
        });

        it('should return not terminated contracts for the client', async () => {
            const { statusCode, body } = await request(app)
                .get('/contracts')
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toHaveLength(2);
            expect(body).toContainEqual(
                expect.objectContaining({
                    id: 2,
                    terms: 'bla bla bla 2',
                    status: 'in_progress',
                    ClientId: 1,
                    ContractorId: 5,
                })
            );
            expect(body).toContainEqual(
                expect.objectContaining({
                    id: 3,
                    terms: 'bla bla bla 3',
                    status: 'new',
                    ClientId: 1,
                    ContractorId: 5,
                })
            );
        });
    });
});
