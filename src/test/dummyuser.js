const Jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userId_1 = mongoose.Types.ObjectId('5eb129c592a3ed5ca3eea21c');
const userId_2 = mongoose.Types.ObjectId('5eb177c7388312a25fcceb24');

const users = [
  {
    _id: userId_1,
    email: 'sunmonuoluwoleAyo@gmail.com',
    password: 'wolexhh',
    name: 'wolex',
    location: {
      coordinates: [6.439401999999999, 3.5266233999999996]
    },
    tokens: [
      {
        access: 'auth',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWIxMjljNTkyYTNlZDVjYTNlZWEyMWMiLCJpYXQiOjE1ODg2NjkyODN9.T8ODt01FqyFeVcJlVwTpJflN-meB5h92ZYgNE7Nwa_g'
      }
    ]
  },
  {
    _id: userId_2,
    email: 'Ayowonderland@softcom.com',
    password: '@$%^&234',
    name: 'ayorinde1',
    location: {
      coordinates: [6.439401999999999, 3.5266233999999996]
    },
    tokens: [
      {
        access: 'auth',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWIxNzdjNzM4ODMxMmEyNWZjY2ViMjQiLCJlbWFpbCI6IkF5b3dvbmRlcmxhbmRAc29mdGNvbS5jb20iLCJpYXQiOjE1ODg2ODg4Mzl9.YQ0d9C1Pof_ZwD2syyeSB-PZ2hrxq34j5SHoW1Bc3Jc'
      }
    ]
  }
];
exports.user = users;
