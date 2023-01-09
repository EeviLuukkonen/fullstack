import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'test blog',
  author: 'test author',
  url: 'www.test.com',
  user: { name: 'tester' },
  likes: 0
}

const mockHandler = jest.fn()

test('renders content', () => {
  render(
    <Blog
      blog={blog}
      handleLike={mockHandler}
      handleRemove={mockHandler}
      showRemove={true}
    />
  )

  const element = screen.getByText('test blog test author')

  expect(element).toBeDefined()
})

test('clicking view button renders url, user and likes', async () => {
  render(
    <Blog
      blog={blog}
      handleLike={mockHandler}
      handleRemove={mockHandler}
      showRemove={true}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText(blog.url, { exact: false })
  screen.getByText(blog.user.name, { exact: false })
  screen.getByText(blog.likes, { exact: false })
})

test('clicking like button twice calls event handler twice', async () => {
  render(
    <Blog
      blog={blog}
      handleLike={mockHandler}
      handleRemove={mockHandler}
      showRemove={true}
    />
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
