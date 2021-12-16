const habitController = require('../../../controllers/habit')
const Habit = require('../../../models/Habit')

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }))
const mockRes = { status: mockStatus }

describe('habit controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('create', () => {
        test('it creates Habits with a 201 status code', async () => {
            let testHabit = {
                habit_id: 2, habit: 'test Habit', goal: 800, units: 'test', streak: 8 
            }
            jest.spyOn(Habit, 'create')
            .mockResolvedValue(new Habit (testHabit));

            const mockReq = { body: testHabit }
            await habitController.create(mockReq, mockRes);
            expect(mockStatus.toHaveBeenCalledWith(201));
            expert(mockJson).toHaveBeenCalledWith(new Habit(testHabit));
        })
    });

    // describe('displayAll', () => {
    //     test('displays all user habits and returns the 200 status', async () => {
    //         jest.spyOn(Habit, 'allUserHabit')
    //         .mockResolvedValue
    //     })
    // })

    describe('destroy', () => {
        test('it returns a 204 status code successful deletion', async () => {
            jest.spyOn(Habit.prototype, 'destroy')
                .mockResolvedValue('Deleted');
            
            const mockReq = { params: { id: 1} }
            await habitController.destroy(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(204);
        })
    })
})