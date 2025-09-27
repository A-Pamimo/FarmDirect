import { useEffect, useMemo, useState } from 'react';
import { centsToCurrency } from '@harvestlink/shared';

type ImpactTickerProps = {
  orders: number;
  kg: number;
  co2: number;
  marginCents: number;
};

const ease = (current: number, target: number) => current + (target - current) * 0.2;

export const ImpactTicker = ({ orders, kg, co2, marginCents }: ImpactTickerProps) => {
  const [display, setDisplay] = useState({ orders: 0, kg: 0, co2: 0, marginCents: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay((prev) => ({
        orders: ease(prev.orders, orders),
        kg: ease(prev.kg, kg),
        co2: ease(prev.co2, co2),
        marginCents: ease(prev.marginCents, marginCents),
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [orders, kg, co2, marginCents]);

  const items = useMemo(
    () => [
      { label: 'Orders moved', value: Math.round(display.orders).toLocaleString() },
      { label: 'Kg saved', value: display.kg.toFixed(1) },
      { label: 'CO₂ avoided (kg)', value: display.co2.toFixed(1) },
      { label: 'Farmer margin protected', value: centsToCurrency(Math.round(display.marginCents)) },
    ],
    [display]
  );

  return (
    <section className="mt-10 rounded-2xl bg-white p-4 shadow-soft md:p-6">
      <div className="grid gap-4 text-center sm:grid-cols-2 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-accent">{item.label}</div>
            <div className="text-2xl font-semibold text-brand-text">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
