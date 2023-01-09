import React from "react";
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { exact } from "prop-types";

const blog = {
    title: 'test blog',
    author: 'test author',
    url: 'www.test.com',
    user: {name: 'tester'},
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