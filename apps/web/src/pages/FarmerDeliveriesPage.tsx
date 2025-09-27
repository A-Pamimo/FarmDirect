import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFarmerDeliveries } from '../lib/api';
import { MiniMap } from '../components/MiniMap';
import { useToastStore } from '../store/toastStore';

interface DeliveryGroup {
  hub: {
    id: string;
    name: string;
    address: string;
  };
  orders: Array<{
    orderId: string;
    customerName: string;
    quantityKg: number;
    status: string;
  }>;
}

export const FarmerDeliveriesPage = () => {
  const { id } = useParams();
  const [groups, setGroups] = useState<DeliveryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const pushToast = useToastStore((state) => state.push);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await fetchFarmerDeliveries(id);
        setGroups(data);
      } catch (error) {
        pushToast({ title: 'Unable to load deliveries', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, pushToast]);

  if (loading) {
    return <p className="text-brand-text/70">Loading delivery batches…</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <h1 className="font-playfair text-3xl text-brand-text">Batch deliveries by hub</h1>
        {groups.length === 0 && <p className="text-sm text-brand-text/60">No orders yet.</p>}
        {groups.map((group) => (
          <div key={group.hub.id} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-brand-text">{group.hub.name}</h2>
                <p className="text-sm text-brand-text/60">{group.hub.address}</p>
              </div>
              <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-semibold text-brand-primary">
                {group.orders.length} orders
              </span>
            </div>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-brand-text/60">
                <tr>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Quantity (kg)</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {group.orders.map((order) => (
                  <tr key={order.orderId} className="border-t border-brand-text/10">
                    <td className="py-2">{order.customerName}</td>
                    <td className="py-2">{order.quantityKg.toFixed(1)}</td>
                    <td className="py-2 capitalize text-brand-text/70">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>
      <section>
        <MiniMap
          hubs={groups.map((group) => ({ ...group.hub, count: group.orders.length }))}
        />
      </section>
    </div>
  );
};
