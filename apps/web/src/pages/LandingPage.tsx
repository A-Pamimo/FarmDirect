import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImpact } from '../hooks/useImpact';
import { PostalCodePicker } from '../components/PostalCodePicker';
import { ImpactTicker } from '../components/ImpactTicker';
import { FarmerCard } from '../components/FarmerCard';
import { fetchFarms } from '../lib/api';
import { useDiscoverStore } from '../store/discoverStore';
import { useToastStore } from '../store/toastStore';

export const LandingPage = () => {
  const { data: impact } = useImpact();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { farms, setResults } = useDiscoverStore();
  const pushToast = useToastStore((state) => state.push);
  const navigate = useNavigate();

  const handleSubmit = async (postalCode: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetchFarms({ near: postalCode, radius_km: 30, sort: 'distance' });
      setResults({ postalCode, farms: response.farms, origin: response.origin });
      if (response.farms.length === 0) {
        setError('No farms within your radius yet — try widening distance.');
      }
    } catch (err: any) {
      const message = err.response?.data?.error ?? 'Unable to fetch farms.';
      setError(message);
      pushToast({ title: 'Search failed', description: message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center text-center">
        <h1 className="max-w-3xl font-playfair text-4xl text-brand-text sm:text-5xl">
          Farmers are brands — not SKUs.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-brand-text/70">
          Discover local producers through their stories, values, and featured harvests. Batch logistics and
          transparent margins make supporting farmers effortless.
        </p>
        <div className="mt-8">
          <PostalCodePicker onSubmit={handleSubmit} demoHints={['S7N 0W5', 'M5V 2T6', 'V6B 1A1']} />
        </div>
        {impact && (
          <ImpactTicker
            orders={impact.ordersCount}
            kg={impact.kgSaved}
            co2={impact.co2AvoidedKg}
            marginCents={impact.farmerMarginProtectedCents}
          />
        )}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-inter text-xl font-semibold text-brand-text">Nearby farmer brands</h2>
          <button
            onClick={() => navigate('/discover')}
            className="text-sm font-medium text-brand-primary hover:underline"
          >
            Open full discovery
          </button>
        </div>
        {loading && <p className="text-brand-text/70">Loading nearby farms…</p>}
        {error && <p className="text-sm text-brand-error">{error}</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <FarmerCard key={farm.id} {...farm} />
          ))}
        </div>
        {!loading && farms.length === 0 && !error && (
          <p className="text-sm text-brand-text/60">Search to reveal farm brands near you.</p>
        )}
      </section>
    </div>
  );
};
