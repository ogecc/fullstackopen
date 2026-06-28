const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with status 400 if username is missing', async () => {
    const newUser = { name: 'No Username', password: 'validpass' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error)
  })

  test('creation fails with status 400 if username is too short', async () => {
    const newUser = { username: 'ab', name: 'Short', password: 'validpass' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error)
  })

  test('creation fails with status 400 if username already taken', async () => {
    const newUser = { username: 'root', name: 'Superuser', password: 'validpass' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error)
  })

  test('creation fails with status 400 if password is missing', async () => {
    const newUser = { username: 'nopass', name: 'No Password' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error)
  })

  test('creation fails with status 400 if password is too short', async () => {
    const newUser = { username: 'newuser', name: 'Short Pass', password: 'ab' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error)
  })
})

after(async () => {
  await mongoose.connection.close()
})
