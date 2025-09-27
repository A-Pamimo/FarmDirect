import { FormEvent, useState } from 'react';

interface PostalCodePickerProps {
  initialValue?: string;
  onSubmit: (postalCode: string) => void;
  demoHints?: string[];
}

export const PostalCodePicker = ({ initialValue = '', onSubmit, demoHints = [] }: PostalCodePickerProps) => {
  const [postalCode, setPostalCode] = useState(initialValue);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!postalCode) return;
    onSubmit(postalCode.trim());
  };

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex items-center rounded-full bg-white p-2 shadow-soft focus-within:ring-2 focus-within:ring-brand-primary"
      >
        <input
          type="text"
          value={postalCode}
          onChange={(event) => setPostalCode(event.target.value)}
          placeholder="Enter your postal code"
          className="w-full rounded-full px-4 py-2 text-base text-brand-text outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
        >
          Find farms
        </button>
      </form>
      {demoHints.length > 0 && (
        <p className="mt-2 text-center text-xs text-brand-text/60">
          Try: {demoHints.join(' · ')}
        </p>
      )}
    </div>
  );
};
