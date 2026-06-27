const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const listWithManyBlogs = [
        { title: 'Blog A', author: 'Author A', url: 'http://a.com', likes: 7 },
        { title: 'Blog B', author: 'Author B', url: 'http://b.com', likes: 3 },
        { title: 'Blog C', author: 'Author C', url: 'http://c.com', likes: 10 },
    ]

    test('empty list has 0 likes', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
    })

    test('when list has many blogs, returns sum of all likes', () => {
        assert.strictEqual(listHelper.totalLikes(listWithManyBlogs), 20)
    })
})