import type { SVGProps } from 'react';

export const MapPinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21c-4.2-4.4-7-7.3-7-11a7 7 0 1 1 14 0c0 3.7-2.8 6.6-7 11Z"
    />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
