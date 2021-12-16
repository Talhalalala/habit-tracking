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

    describe('increase habit streak counter', () => {
        test('it increases habit streak counter on successful db query with habit_id', async () => {
            let habitData = {habit_id: 0, user_id: 0, habit: 'habit', goal: 10, units: 'units', streak: 1}
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ habitData ] });
            const result = await Habit_Data.increaseStreak(0);
            expect(result.rows[0].streak).toBe(1)
        })
    });

    describe('homepage info', () => {
        test('it sends relevant homepage information on successful db query with user_id', async () => {
            let homepageData1 = {habit_id: 1, user_id: 0, habit: 'running', goal: 100, units: 'steps', streak: 1, habit_data_id: null, 
        habit_date: null, habit_amount: null, habit_achieved: null}
            let homepageData2 = {habit_id: 2, user_id: 0, habit: 'drink water', goal: 6, units: 'cups', streak: 3, habit_data_id: null, 
        habit_date: null, habit_amount: null, habit_achieved: null}
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [ homepageData1, homepageData2 ] });
            const result = await Habit_Data.homepage(0);
            expect(result[0].user_id).toBe(0)
            expect(result[1].user_id).toBe(0)
        })
    });

    describe('singular habit history', () => {
        test('it sends a list of the entire history of a habit on successful db query with habit_id', async () => {
            let historicalData1 = {habit_id: 1, user_id: 0, habit: 'running', goal: 100, units: 'steps', streak: 1, habit_data_id: 1, 
        habit_date: '2021-12-14', habit_amount: 200, habit_achieved: true}
            let historicalData2 = {habit_id: 1, user_id: 0, habit: 'running', goal: 100, units: 'steps', streak: 2, habit_data_id: 2, 
        habit_date: '2021-12-15', habit_amount: 150, habit_achieved: true}
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [ historicalData2, historicalData1 ] })
            const result = await Habit_Data.readHistoricalHabitData(1)
            expect(result[0].habit_id).toBe(1)
            expect(result[1].habit_id).toBe(1)
            expect(result[0].date).toBe('2021-12-15')
            expect(result[1].date).toBe('2021-12-14')
        })
    })

    describe('todays history singular habit', () => {
        test('it sends any data logged today on a given habit on successful db query', async () => {
            let today = new Date().toISOString().slice(0, 10)
            let historicalData1 = {habit_id: 1, user_id: 0, habit: 'running', goal: 100, units: 'steps', streak: 1, habit_data_id: 1, 
        habit_date: today, habit_amount: 200, habit_achieved: true}
        jest.spyOn(db, 'query')
            .mockResolvedValueOnce({ rows: [ historicalData1 ] })
        const result = await Habit_Data.readOneHabitData(1)
        expect(result.habit_id).toBe(1)
        expect(result.date).toBe(today)
        })

        test('it sends any data logged today on a given habit on successful db query', async () => {
        jest.spyOn(db, 'query')
            .mockResolvedValueOnce({ rows: [ ] })
        const result = await Habit_Data.readOneHabitData(1)
        expect(result.length).toBe(0)
        })
    })



})