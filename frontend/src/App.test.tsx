import { act } from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders App component correctly', () => {
  act(() => {
    render(<App />);
  })
  const app = screen.getByTitle('app');
  expect(app).toBeInTheDocument();
});
