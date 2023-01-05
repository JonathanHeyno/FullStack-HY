import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog

  beforeAll(() => {
    blog = {
      title: 'How to build a house',
      url: 'www.bauhaus.de',
      author: 'Alfons Spander',
      likes: 0,
      user: {
        username: 'aatami',
        name: 'Aatami Aave',
        id: '63a498dbc5bc883bd6a5f081'
      },
      id: '63b471ce41e0a56b35cc86fd'
    }
  })


  test('renders only title and author', () => {
    render(<Blog blog={blog}/>)

    const element = screen.getByText('How to build a house Alfons Spander')
    expect(element).toBeDefined()
  })


  test('additional blog information shown after clicking view -button', async () => {
    let container

    container = render(
      <Blog blog={blog}/>
    ).container

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.fullContent')
    expect(div).not.toHaveStyle('display: none')
  })


  test('clicking like -button twice calls event handler twice', async () => {
    const mockHandler = jest.fn()

    render(
      <Blog blog={blog} addLike={mockHandler} />
    )

    const user = userEvent.setup()
    const button1 = screen.getByText('view')
    await user.click(button1)

    const element = screen.getByText('like')

    await user.click(element)
    await user.click(element)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})