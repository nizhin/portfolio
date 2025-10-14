import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/Stars', () => ({
  __esModule: true,
  default: () => <div data-testid="stars-canvas" />,
}));

beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      media: '',
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
  }
});

test('renders primary navigation', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /quenton ni/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /projects/i })).toBeInTheDocument();
});
