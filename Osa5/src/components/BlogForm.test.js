import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls createBlog with correct attributes', async () => {
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()


  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const createButton = screen.getByText('create')


  await user.type(titleInput, 'testing title...')
  await user.type(authorInput, 'testing author...')
  await user.type(urlInput, 'testing url...')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing url...')
  expect(createBlog.mock.calls[0][0].likes).toBe(0)
})

