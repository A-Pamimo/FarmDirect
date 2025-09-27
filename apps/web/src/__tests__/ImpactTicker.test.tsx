import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ImpactTicker } from '../components/ImpactTicker';

describe('ImpactTicker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('animates impact values', () => {
    render(<ImpactTicker orders={10} kg={20} co2={40} marginCents={12345} />);
    vi.advanceTimersByTime(500);
    expect(screen.getByText(/Orders moved/i)).toBeInTheDocument();
    expect(screen.getByText(/CO₂ avoided/i)).toBeInTheDocument();
  });
});
