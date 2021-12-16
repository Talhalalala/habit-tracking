const Habit = require('../../../models/Habit')
const pg = require('pg')
jest.mock('pg')

const db = require('../../../db_config/config')

describe('Habit', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('all', )
})