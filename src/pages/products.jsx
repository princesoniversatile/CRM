import { Helmet } from 'react-helmet-async';

import DataTableProduct from 'src/ourComponents/Products/products';

// import { ProductsView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Products 1| Versatile </title>
      </Helmet>

      {/* <ProductsView /> */}
      <DataTableProduct/>
    </>
  );
}
