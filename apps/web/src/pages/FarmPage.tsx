import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { centsToCurrency } from '@harvestlink/shared';
import { fetchFarm, createCustomer, createOrder } from '../lib/api';
import type { Farm } from '@harvestlink/shared';
import { useDiscoverStore } from '../store/discoverStore';
import { useToastStore } from '../store/toastStore';

interface CustomerDetails {
  id?: string;
  name: string;
  email: string;
  postalCode: string;
}

const testimonialMap: Record<string, { quote: string; author: string }[]> = {
  'f1f1f1f1-1111-4111-8111-aaaaaaaaaaaa': [
    { quote: 'Sarah remembers every family who visits the farm — her tomatoes taste like stories.', author: 'Amrita P.' },
    { quote: 'The soil-first approach makes every crate a flavour bomb.', author: 'Chef Lyle' },
  ],
  'f2f2f2f2-2222-4222-8222-bbbbbbbbbbbb': [
    { quote: 'Riverbend greens last twice as long in our fridge. Worth every dollar.', author: 'The Jin Family' },
    { quote: 'Packaging is compostable and deliveries are always on time.', author: 'Nadia K.' },
  ],
  'f3f3f3f3-3333-4333-8333-cccccccccccc': [
    { quote: 'Prairie Roots keeps our bakery stocked with regenerative grains.', author: 'Little Field Bakery' },
  ],
};

export const FarmPage = () => {
  const { id } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [customer, setCustomer] = useState<CustomerDetails>(() => {
    if (typeof window === 'undefined') {
      return { name: '', email: '', postalCode: '' };
    }
    try {
      const stored = window.localStorage.getItem('harvestlink:customer');
      return stored ? JSON.parse(stored) : { name: '', email: '', postalCode: '' };
    } catch (error) {
      console.warn('Failed to parse saved customer', error);
      return { name: '', email: '', postalCode: '' };
    }
  });
  const { postalCode } = useDiscoverStore();
  const pushToast = useToastStore((state) => state.push);

  useEffect(() => {
    if (postalCode && !customer.postalCode) {
      setCustomer((prev) => ({ ...prev, postalCode }));
    }
  }, [postalCode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('harvestlink:customer', JSON.stringify(customer));
    }
  }, [customer]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const result = await fetchFarm(id);
        setFarm(result);
      } catch (error) {
        pushToast({ title: 'Farm not found', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, pushToast]);

  const testimonials = useMemo(() => (id ? testimonialMap[id] ?? [] : []), [id]);

  const handleCheckout = async () => {
    if (!farm || !id) return;
    if (!customer.name || !customer.email || !customer.postalCode) {
      pushToast({ title: 'Add your details before checkout', type: 'error' });
      return;
    }
    setProcessing(true);
    try {
      let customerId = customer.id;
      if (!customerId) {
        const created = await createCustomer({
          name: customer.name,
          email: customer.email,
          postalCode: customer.postalCode,
        });
        customerId = created.id;
        setCustomer((prev) => ({ ...prev, id: created.id }));
      }

      const order = await createOrder({ customerId, farmId: id });
      pushToast({ title: 'Redirecting to checkout…', type: 'info' });
      if (order.mock) {
        pushToast({ title: 'Demo checkout ready', type: 'success', description: 'Mock payment link opened.' });
      }
      window.location.href = order.checkoutUrl;
    } catch (error: any) {
      const message = error.response?.data?.error ?? 'Unable to start checkout.';
      pushToast({ title: 'Checkout failed', description: message, type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <p className="text-brand-text/70">Loading farm profile…</p>;
  }

  if (!farm) {
    return <p className="text-sm text-brand-error">Farm not found.</p>;
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <img
            src={farm.photoUrl}
            alt={`${farm.name} hero`}
            className="h-72 w-full rounded-2xl object-cover shadow-soft"
          />
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-card md:col-span-2">
          <div>
            <h1 className="font-playfair text-3xl text-brand-text">{farm.name}</h1>
            <p className="mt-4 text-brand-text/70">{farm.story}</p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-brand-primary/10 p-4 text-brand-text">
              <p className="text-sm uppercase tracking-wide text-brand-primary">Featured product</p>
              <h2 className="mt-2 text-xl font-semibold text-brand-text">{farm.featuredProductName}</h2>
              <p className="text-brand-text/70">{centsToCurrency(farm.featuredPriceCents)}</p>
              <p className="mt-3 text-xs text-brand-text/60">2-step checkout via Stripe. Batch delivery to your nearest hub.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-brand-text/60">Your name</label>
              <input
                type="text"
                value={customer.name}
                onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-full border border-brand-text/10 px-4 py-2 text-sm"
              />
              <label className="block text-xs font-semibold uppercase text-brand-text/60">Email</label>
              <input
                type="email"
                value={customer.email}
                onChange={(event) => setCustomer((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-full border border-brand-text/10 px-4 py-2 text-sm"
              />
              <label className="block text-xs font-semibold uppercase text-brand-text/60">Postal code</label>
              <input
                type="text"
                value={customer.postalCode}
                onChange={(event) => setCustomer((prev) => ({ ...prev, postalCode: event.target.value }))}
                className="w-full rounded-full border border-brand-text/10 px-4 py-2 text-sm"
              />
            </div>
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {processing ? 'Preparing checkout…' : 'Support this farmer'}
            </button>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-text">What neighbours say</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.quote} className="rounded-2xl bg-brand-bg p-4 text-sm text-brand-text/80">
                “{testimonial.quote}”
                <cite className="mt-2 block text-xs font-semibold text-brand-text">— {testimonial.author}</cite>
              </blockquote>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
