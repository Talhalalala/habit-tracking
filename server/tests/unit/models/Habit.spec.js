const Habit = require('../../../models/Habit')
const pg = require('pg')
jest.mock('pg')

const db = require('../../../db_config/config')

describe('Habit', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with habits on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [ {}, {}, {} ] })
            const all = await Habit.allUserHabits(1)
            expect(all).toHaveLength(3)
        })
    })

    describe('one habit', () => {
        test('it resolves with singular habit on successful db query', async () => {
            habitData = { habit_id: 0 }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [ habitData ] })
            const one = await Habit.OneUserHabit(1)
            expect(one).toBeInstanceOf(Habit)
        })
    })

    describe('create', () => {
        test('it resolves with habit on successful db query', async () => {
            let HabitData = { habit_id: 1,
                id: 1,
                habit: 'habit',
                goal: 100,
                units: 'units',
                streak: 2 }
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ HabitData ] });
            const result = await Habit.create('New Author');
            expect(result).toBeInstanceOf(Habit)
        })
    });

    describe('destroy', () => {
        test('it resolves with message on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ id: 1 });
            let HabitData = new Habit({ habit_id: 1, id: 1, habit: 'habit', goal: 100, units: 'units', streak: 2 })
            const result = await HabitData.destroy
            expect(result).toBe('Habit 1 was deleted')
        })
    });





})
