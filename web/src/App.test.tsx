import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import App from './App';
import { COPY } from './copy';

describe('App', () => {
  it('renders copy and hero image', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: COPY.HERO.headline });
    expect(heading).toBeInTheDocument();

    const img = screen.getByRole('img', { name: /Driving genie/i });
    expect(img).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}CA-Plate-Genie.gif`
    );
  });
});
