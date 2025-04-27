import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App, { loader as rootLoader } from './App';
import ErrorPage from './routes/ErrorPage';
import Store from './routes/Store';
import reportWebVitals from './reportWebVitals';
import StoreContent from './components/store/StoreContent';
import DollProduct from './components/store/DollProduct';
import WishListPage from './routes/WishListPage';
// import CartListPage from './routes/CartListPage';
import CheckOutPage from './components/checkOut/CheckOutPage';

import LazyCartPage from './components/cart/LazyCartPage';
import AccountPage from './routes/AccountPage';
import OrdersContent from './components/account/OrdersContent';
import OrderView from './components/account/OrderView';
import ConfirmationPage from './components/checkOut/ConfirmationPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  }, {
    path: "/דף הבית",
    element: <App />,
    errorElement: <ErrorPage />,
  }, {
    path: "/חנות",
    element: <Store />,
    loader: rootLoader,
    children: [
      {
        path: "/חנות/:category",
        element: <StoreContent />,
      },
      {
        path: "/חנות/:category/page/:page",
        element: <StoreContent />,
      },
      {
        path: "/חנות/:category/:product",
        element: <DollProduct />,
        loader: rootLoader,
      },
    ],
  }, {
    path: "/WishList",
    element: <WishListPage />,
    loader: rootLoader,
  }, {
    path: "/Cart",
    element: (
      <Suspense fallback={<div>Loading Cart List Page...</div>}>
        <LazyCartPage />
      </Suspense>
    ),
    loader: rootLoader,
  }, {
    path: "/Check-out",
    element: <CheckOutPage />,
    loader: rootLoader,
  }, {
    path: "/החשבון שלי",
    element: <AccountPage />,
    loader: rootLoader,
    children: [
      {
        path: "/החשבון שלי/הזמנות",
        element: <OrdersContent />,
      },
      {
        path: "/החשבון שלי/הזמנות/:orderNumber",
        element: <OrderView />,
      },
    ]
  }, {
    path: "/confirmation-page",
    element: <ConfirmationPage />,
    errorElement: <ErrorPage />,
  }

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
    // {/* <App /> */}
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
