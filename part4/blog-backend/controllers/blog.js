const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})


blogRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({ title, author, url, likes, user: user._id })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async(request,response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if(!blog){
    return response.status(404).json({ error: 'missing blog'})
  }

  if(blog.user.toString() !== user._id.toString()){
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request,response) => {
  const likes  = request.body.likes

  const blog = await Blog.findById(request.params.id)

  if(!blog){
    return response.status(404).end()
  }

  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)

})

module.exports = blogRouter