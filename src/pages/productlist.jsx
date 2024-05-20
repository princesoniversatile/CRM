import { Helmet } from 'react-helmet-async';

import DataTableProduct from 'src/ourComponents/Products/products';

// import ProductList from 'src/ourComponents/product/product-list';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Products | Versatile </title>
      </Helmet>

      {/* <ProductList /> */}
      <DataTableProduct/>
    </>
  );
}
