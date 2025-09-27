import { Link } from 'react-router-dom';
import { centsToCurrency } from '@harvestlink/shared';
import { MapPinIcon } from './icons/MapPinIcon';

type FarmerCardProps = {
  id: string;
  name: string;
  story: string;
  photoUrl: string;
  distanceKm?: number;
  featuredProductName: string;
  featuredPriceCents: number;
};

const storyTagline = (story: string) => {
  const sentence = story.split('. ')[0];
  return sentence.length > 110 ? `${sentence.slice(0, 110)}…` : sentence;
};

export const FarmerCard = ({
  id,
  name,
  story,
  photoUrl,
  distanceKm,
  featuredProductName,
  featuredPriceCents,
}: FarmerCardProps) => {
  return (
    <Link
      to={`/farm/${id}`}
      className="card-hover flex flex-col rounded-2xl bg-white p-5 shadow-card focus:outline-none focus:ring-2 focus:ring-brand-primary"
    >
      <div className="mb-4 flex items-center gap-3">
        <img
          src={photoUrl}
          alt={`${name} portrait`}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-playfair text-xl text-brand-text">{name}</h3>
          <p className="text-sm text-brand-text/70">{storyTagline(story)}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between text-sm text-brand-text/80">
        <div className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4 text-brand-accent" />
          <span>{distanceKm ? `${distanceKm.toFixed(1)} km away` : 'Distance pending'}</span>
        </div>
        <div className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary">
          {featuredProductName} · {centsToCurrency(featuredPriceCents)}
        </div>
      </div>
    </Link>
  );
};
