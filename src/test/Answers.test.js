process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Answers = require('../model/answer/answers');
const Questions = require('../model/question/questions');
const { user } = require('./dummyuser');
const user_2 = user[1];

const question = {
  _id: mongoose.Types.ObjectId(),
  title: 'Docker',
  description: 'What is the user',
  owner: user_2._id
};
const answer = {
  question: question._id,
  _id: mongoose.Types.ObjectId(),
  title: 'Docker',
  description: 'for contenarization',
  owner: user_2._id
};

describe('Answers', () => {
  beforeAll(async () => {
    await Questions.create(question);
    await Answers.create(answer);
  });

  test('it should require content for search', async () => {
    await request(app)
      .get('/v1/answers/search')
      .expect(400)

      .then(response => {
        expect(response.body.message).toBe('Please add content to search');
      });
  });

  test('it should get content if search criteria that matches answers', async () => {
    await request(app)
      .get('/v1/answers/search?q=con')
      .expect(200)

      .then(response => {
        expect(response.body.data[0].description).toBe('for contenarization');
      });
  });
});
