import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { FarmPage } from './pages/FarmPage';
import { FarmerDeliveriesPage } from './pages/FarmerDeliveriesPage';
import { CheckoutStatusPage } from './pages/CheckoutStatusPage';
import { MockCheckoutPage } from './pages/MockCheckoutPage';
import { AppLayout } from './components/AppLayout';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/discover', element: <DiscoverPage /> },
      { path: '/farm/:id', element: <FarmPage /> },
      { path: '/farmer/:id/deliveries', element: <FarmerDeliveriesPage /> },
      { path: '/checkout/:state', element: <CheckoutStatusPage /> },
      { path: '/mock-checkout', element: <MockCheckoutPage /> },
    ],
  },
]);
