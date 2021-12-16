const User = require('../../../models/User')
const pg = require('pg')
jest.mock('pg')

const db = require('../../../db_config/config')

describe('User', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with all users on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [ {}, {} ]})
            const all = await User.all
            expect(all).toHaveLength(2)
        })
    })

    describe('create', () => {
        test('it resolves with user on successful db query', async () => {
            let userData = { id: 0, username: 'New User', email: 'newEmail@email.com', hpassword: 'test' }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ userData ] });
            const result = await User.create('New User', 'newEmail@email.com', 'test');
            expect(result).toBeInstanceOf(User)
        })
    });

    describe('find by email', () => {
        test('it resolves with user on successful db query with email', async () => {
            let userData = { id: 0, username: 'New User', email: 'newEmail@email.com', hpassword: 'test' }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ userData ] });
            const result = await User.findByEmail('newEmail@email.com');
            expect(result).toBeInstanceOf(User)
        })
    });

    describe('find by user id', () => {
        test('it resolves with user on successful db query with user id', async () => {
            let userData = { id: 0, username: 'New User', email: 'newEmail@email.com', hpassword: 'test' }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ userData ] });
            const result = await User.findById(0);
            expect(result).toBeInstanceOf(User)
        })
    });

    describe('destroy', () => {
        test('it resolves with id on successful db delete query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{ id: 0 }] });
            let testUser = new User({ user_id: 0, username: 'New User', email: 'newEmail@email.com', hpassword: 'test' })
            const result = await testUser.destroy;
            expect(result).toBe('User 0 was deleted')
        })
    });
})