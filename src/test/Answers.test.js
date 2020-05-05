process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../model/user/user');
const Answers = require('../model/answer/answers');
const Questions = require('../model/question/questions');
const { user } = require('./dummyuser');

const user_2 = user[1];
const question = {
  _id: mongoose.Types.ObjectId(),
  title: 'Docker',
  description: 'for containerization',
  owner: user_2._id
};

beforeEach(async () => {
  //await User.deleteMany();
  await User.create(user_2);
});
beforeAll(async () => {
  await Questions.create(question);
  //await Answers.create(question);
});

test('it should return error when answer is provided for invalid question', async () => {
  await request(app)
    .post('/v1/add/answer')
    .set('Authorization', `Bearer ${user_2.tokens[0].token}`)
    .expect(400)
    .send({
      title: 'waex',
      description: 'woleddd',
      questionId: '5eafd5f38b31f4474a6b531e'
    })
    .then(response => {
      expect(response.body.message).toBe('invalid request');
    });
});

test('it should return error when invalid Id Type is not provided', async () => {
  await request(app)
    .post('/v1/add/answer')
    .set('Authorization', `Bearer ${user_2.tokens[0].token}`)
    .expect(400)
    .send({
      title: 'waex',
      description: 'woleddd',
      questionId: 'QUE598'
    })
    .then(response => {
      expect(response.body.message).toBe('invalid questionId');
    });
});

test('it should succesfully add question', async () => {
  await request(app)
    .post('/v1/add/answer')
    .set('Authorization', `Bearer ${user_2.tokens[0].token}`)
    .expect(200)
    .send({
      title: 'Socialism',
      description: 'The way of men',
      questionId: question._id
    })
    .then(response => {
      expect(response.body.data.title).toBe('Socialism');
    });
});
