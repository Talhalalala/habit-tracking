const Habit_Data = require('../../../models/HabitData')
const pg = require('pg')
jest.mock('pg')

const db = require('../../../db_config/config')

describe('Habit_Data', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('everything', () => {
        test('it resolves with all habit history on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [ {}, {}, {} ] })
            const all = await Habit_Data.everything
            expect(all).toHaveLength(3)
        })
    })

    
})