import type { Hub } from '@harvestlink/shared';

interface MiniMapProps {
  hubs: Array<Hub & { count?: number }>;
}

export const MiniMap = ({ hubs }: MiniMapProps) => {
  return (
    <div className="relative h-64 w-full rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/20">
      {hubs.map((hub, index) => (
        <div
          key={hub.id}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-xs"
          style={{
            left: `${30 + index * 25}%`,
            top: `${40 + (index % 2) * 20}%`,
          }}
        >
          <span className="rounded-full bg-white px-2 py-1 font-semibold text-brand-primary shadow-soft">
            {hub.name}
          </span>
          {hub.count !== undefined && (
            <span className="mt-1 rounded-full bg-brand-primary/20 px-2 py-0.5 text-brand-primary">
              {hub.count} orders
            </span>
          )}
        </div>
      ))}
      <div className="absolute inset-0 rounded-2xl border border-dashed border-brand-primary/40"></div>
    </div>
  );
};
