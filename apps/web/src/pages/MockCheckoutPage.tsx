import { useSearchParams, useNavigate } from 'react-router-dom';

export const MockCheckoutPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get('orderId');

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-soft">
      <h1 className="font-playfair text-3xl text-brand-text">Demo checkout</h1>
      <p className="text-brand-text/70">
        Stripe test mode is disabled for this demo environment. Click confirm below to simulate a successful
        payment. Impact counters and notifications will trigger automatically.
      </p>
      {orderId && <p className="text-sm text-brand-text/60">Order ID: {orderId}</p>}
      <button
        onClick={() => navigate(`/checkout/success?orderId=${orderId ?? ''}`)}
        className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:bg-brand-primary/90"
      >
        Confirm mock payment
      </button>
    </div>
  );
};
