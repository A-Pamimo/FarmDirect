import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { FarmerCard } from '../components/FarmerCard';

describe('FarmerCard', () => {
  it('shows farmer name and distance', () => {
    render(
      <MemoryRouter>
        <FarmerCard
          id="farm-123"
          name="Test Farm"
          story="Regenerative farm with deep roots."
          photoUrl="/image.jpg"
          distanceKm={12.3}
          featuredProductName="Veggie Box"
          featuredPriceCents={2500}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Farm')).toBeInTheDocument();
    expect(screen.getByText(/12.3 km away/)).toBeInTheDocument();
  });
});
