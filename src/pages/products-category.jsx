import { Helmet } from 'react-helmet-async';

import ProductCategoryTable from 'src/ourComponents/Product-Category/categoryTable';

// import { ProductsView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function ProductCategoryPage() {
  return (
    <>
      <Helmet>
        <title> Products Category | Versatile </title>
      </Helmet>

      {/* <ProductsView /> */}

    {/* <CategoryCreationForm/> */}
    <ProductCategoryTable/>
    </>
  );
}
