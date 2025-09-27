import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useToastStore } from '../store/toastStore';

export const CheckoutStatusPage = () => {
  const { state } = useParams();
  const [params] = useSearchParams();
  const pushToast = useToastStore((store) => store.push);
  const orderId = params.get('orderId');

  useEffect(() => {
    if (state === 'success') {
      pushToast({
        title: 'Payment confirmed',
        description: 'Your HarvestLink order is on its way to the community hub.',
        type: 'success',
      });
    } else if (state === 'cancel') {
      pushToast({
        title: 'Checkout canceled',
        description: 'Feel free to resume when you are ready.',
        type: 'info',
      });
    }
  }, [state, pushToast]);

  if (state === 'success') {
    return (
      <div className="space-y-4">
        <h1 className="font-playfair text-3xl text-brand-text">Order confirmed</h1>
        <p className="text-brand-text/70">
          Thank you for supporting local farmers. You will receive an email with hub pickup details shortly.
        </p>
        {orderId && <p className="text-sm text-brand-text/60">Order ID: {orderId}</p>}
      </div>
    );
  }

  if (state === 'cancel') {
    return (
      <div className="space-y-4">
        <h1 className="font-playfair text-3xl text-brand-text">Checkout paused</h1>
        <p className="text-brand-text/70">
          Your cart is saved. When you are ready, revisit the farm page to continue supporting them.
        </p>
      </div>
    );
  }

  return <p className="text-brand-text/70">Status unknown.</p>;
};
