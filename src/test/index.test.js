process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../model/user/user');
const Questions = require('../model/question/questions');

const { user } = require('./dummyuser');
const user_1 = user[0];
const question = {
  _id: mongoose.Types.ObjectId(),
  title: 'javascript',
  description: 'Array of aarray',
  owner: user_1._id
};

beforeEach(async () => {
  await User.deleteMany();
  await User.create(user_1);
});
beforeAll(async () => {
  await Questions.create(question);
});

describe('Sign up user', () => {
  test('it should throw an error if email exist', async () => {
    await request(app)
      .post('/v1/signup')
      .send({
        email: 'sunmonuoluwoleAyo@gmail.com',
        password: 'wolexhh',
        username: 'wolex',
        lat: 3.5266233999999996,
        long: 6.439401999999999
      })

      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('Email already registered.');
      });
  });
  test('it should throw an error if user location is not provided during signup', async () => {
    await request(app)
      .post('/v1/signup')
      .send({
        email: 'sunmonuoluwdsole@yahoo.com',
        password: 'wolexhh',
        username: 'boss'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('user Lat and lng is required');
      });
  });

  test('it should signup a user succesfuly', async () => {
    await request(app)
      .post('/v1/signup')
      .send({
        email: 'sunmonuoluwdsole@yahoo.com',
        password: 'wolexhh',
        username: 'boss',
        lat: 3.5266233999999996,
        long: 6.439401999999999
      })
      .expect(200);
  });
});

describe('Login user', () => {
  test('it should throw an error if username or password is not provided', async () => {
    await request(app)
      .post('/v1/login')
      .send({
        email: 'sunmonuoluwdsole@yahoo.com'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('Email and password is required');
      });
  });
  test('it should throw an error if user does not exist', async () => {
    await request(app)
      .post('/v1/login')
      .send({
        email: 'sunmonuolsole@rack.com',
        password: 'oluwa'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('User does not exist.');
      });
  });
  test('it should throw an error if password is incorrect', async () => {
    await request(app)
      .post('/v1/login')
      .send({
        email: 'sunmonuoluwoleAyo@gmail.com',
        password: 'wolex'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('Incorrect Password');
      });
  });

  test('it should login a user succesfuly', async () => {
    await request(app)
      .post('/v1/login')
      .send({
        email: 'sunmonuoluwoleAyo@gmail.com',
        password: 'wolexhh'
      })
      .expect(201);
  });
  test('it should not logout a user wihout auth token', async () => {
    await request(app)
      .post('/v1/logout')
      .expect(401);
  });
  test('it should logout succesfully', async () => {
    await request(app)
      .post('/v1/logout')
      .set('Authorization', `Bearer ${user_1.tokens[0].token}`)
      .expect(200);
  });
});

describe('Search User', () => {
  test('it should throw an error autorization is not provided', async () => {
    await request(app)
      .get('/v1/user/search')
      .set('Authoruzation', '')
      .expect(401);
  });
  test('it should throw an error if user location is not provided', async () => {
    await request(app)
      .get('/v1/user/search')
      .set('Authorization', `Bearer ${user_1.tokens[0].token}`)
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('lat and long is required');
      });
  });
  test('it should get a user', async () => {
    await request(app)
      .get('/v1/user/search?&lat= 6.439401999999999&long=3.5266233999999996')
      .set('Authorization', `Bearer ${user_1.tokens[0].token}`)
      .expect(200)
      .then(response => {
        expect(response.body.data[0].email).toBe('sunmonuoluwoleAyo@gmail.com');
      });
  });
});

describe('Questions', () => {
  test('it should throw an error if user does not provide title or description  ', async () => {
    await request(app)
      .post('/v1/add/question')
      .set('Authorization', `Bearer ${user_1.tokens[0].token}`)
      .send({
        title: 'Why me'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe(
          'Title and description are required'
        );
      });
  });
  test('user should add question succesfully', async () => {
    await request(app)
      .post('/v1/add/question')
      .set('Authorization', `Bearer ${user_1.tokens[0].token}`)
      .send({
        title: 'Why me',
        description: 'oluwaoshe',
        owner: user_1._id
      })
      .expect(200);
  });

  test('same user should not be able to downvote or upvote', async () => {
    await request(app)
      .post(`/v1/vote/question/${question._id}`)
      .set('Authorization', `Bearer ${user_1.tokens[0].token}`)
      .send({
        vote: false
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('you cannot Vote for yourself');
      });
  });

  test('user should only be able to edit title and description in update', async () => {
    await request(app)
      .put(`/v1/update/question/${question._id}`)
      .set('Authorization', `Bearer ${user_1.tokens[0].token}`)
      .send({
        title: 'why',
        description: 'my God of',
        owner: 'ded'
      })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('invalid request body');
      });
  });

  test('user should only be able to edit succesfully', async () => {
    await request(app)
      .put(`/v1/update/question/${question._id}`)
      .set('Authorization', `Bearer ${user_1.tokens[0].token}`)
      .send({
        title: 'why',
        description: 'my God of'
      })
      .expect(200)
      .then(response => {
        expect(response.body.data.description).toBe('my God of');
      });
  });
});
