import { useMemo, useState } from 'react';
import { FarmerCard } from '../components/FarmerCard';
import { PostalCodePicker } from '../components/PostalCodePicker';
import { fetchFarms } from '../lib/api';
import { useDiscoverStore } from '../store/discoverStore';
import { useToastStore } from '../store/toastStore';

export const DiscoverPage = () => {
  const { farms, postalCode, setResults } = useDiscoverStore();
  const pushToast = useToastStore((state) => state.push);
  const [currentPostal, setCurrentPostal] = useState(postalCode);
  const [distance, setDistance] = useState(30);
  const [tag, setTag] = useState('');
  const [product, setProduct] = useState('');
  const [sort, setSort] = useState<'distance' | 'product' | 'storytag'>('distance');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (
    code: string,
    radius: number,
    storyTag: string,
    productQuery: string,
    sortOption: 'distance' | 'product' | 'storytag'
  ) => {
    if (!code) {
      pushToast({ title: 'Postal code required', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetchFarms({
        near: code,
        radius_km: radius,
        sort: sortOption,
        tag: storyTag || undefined,
        product: productQuery || undefined,
      });
      setResults({ postalCode: code, farms: response.farms, origin: response.origin });
      setCurrentPostal(code);
    } catch (error: any) {
      const message = error.response?.data?.error ?? 'Unable to fetch farms.';
      pushToast({ title: 'Search failed', description: message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const products = useMemo(() => {
    const set = new Set<string>();
    farms.forEach((farm) => set.add(farm.featuredProductName));
    return Array.from(set.values());
  }, [farms]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-playfair text-3xl text-brand-text">Discover local farmer brands</h1>
          <p className="text-brand-text/70">Fine-tune by distance, values, and featured product focus.</p>
        </div>
        <PostalCodePicker
          initialValue={currentPostal}
          onSubmit={(code) => handleSearch(code, distance, tag, product, sort)}
          demoHints={['S7N 0W5', 'M5V 2T6', 'V6B 1A1']}
        />
      </div>

      <div className="grid gap-4 rounded-2xl bg-white p-4 shadow-soft md:grid-cols-4 md:p-6">
        <label className="flex flex-col text-xs font-semibold uppercase text-brand-text/60">
          Distance (km)
          <input
            type="range"
            min={5}
            max={80}
            value={distance}
            onChange={(event) => setDistance(Number(event.target.value))}
            className="mt-2"
          />
          <span className="mt-1 text-sm font-medium text-brand-text">{distance} km</span>
        </label>
        <label className="flex flex-col text-xs font-semibold uppercase text-brand-text/60">
          Story tag
          <input
            type="text"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            placeholder="e.g. regenerative"
            className="mt-2 rounded-full border border-brand-text/10 px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col text-xs font-semibold uppercase text-brand-text/60">
          Featured product
          <select
            value={product}
            onChange={(event) => setProduct(event.target.value)}
            className="mt-2 rounded-full border border-brand-text/10 px-4 py-2 text-sm"
          >
            <option value="">Any</option>
            {products.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs font-semibold uppercase text-brand-text/60">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
            className="mt-2 rounded-full border border-brand-text/10 px-4 py-2 text-sm"
          >
            <option value="distance">Distance</option>
            <option value="product">Product</option>
            <option value="storytag">Story tag</option>
          </select>
        </label>
        <div className="md:col-span-4 text-right">
          <button
            onClick={() => handleSearch(currentPostal || postalCode, distance, tag, product, sort)}
            className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90"
          >
            Apply filters
          </button>
        </div>
      </div>

      {loading && <p className="text-brand-text/70">Searching…</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {farms.map((farm) => (
          <FarmerCard key={farm.id} {...farm} />
        ))}
      </div>

      {!loading && farms.length === 0 && (
        <p className="text-sm text-brand-text/60">No farms within your radius yet — try widening distance.</p>
      )}
    </div>
  );
};
