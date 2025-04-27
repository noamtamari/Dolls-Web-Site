import React from 'react';

const LazyCartPage = React.lazy(() => import('../../routes/CartListPage.jsx'));

export default LazyCartPage;
