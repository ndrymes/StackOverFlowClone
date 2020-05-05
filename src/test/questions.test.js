const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Questions = require('../model/question/questions');
const { user } = require('./dummyuser');
const user_1 = user[0];

beforeAll(async () => {
  await Questions.create(question);
});
const question = {
  _id: mongoose.Types.ObjectId(),
  title: 'javascript',
  description: 'Array of aarray',
  owner: user_1._id
};

describe('View Questions', () => {
  test('it should throw error for invalidIdType', async () => {
    await request(app)
      .get('/v1/question/5eaedb5e0f0ecb1c45e')
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('invalid Id type');
      });
  });
  test('it should throw question not found for invalid questionId', async () => {
    await request(app)
      .get('/v1/question/5eaedb5e0f0ecb1c45ef1d7a')
      .expect(404)
      .then(response => {
        expect(response.body.message).toBe('question not found');
      });
  });
  test('it should get question succesfully', async () => {
    await request(app)
      .get(`/v1/question/${question._id}`)
      .expect(200)
      .then(response => {
        expect(response.body.data.question.description).toBe('Array of aarray');
      });
  });

  test('it should throw an error if content to search is not provided', async () => {
    await request(app)
      .get('/v1/questions/search')
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('Please add content to search');
      });
  });

  test('it should get content if search criteria matches', async () => {
    await request(app)
      .get('/v1/questions/search?q=jav')
      .expect(200)
      .then(response => {
        expect(response.body.data[0].title).toBe('javascript');
      });
  });
});
