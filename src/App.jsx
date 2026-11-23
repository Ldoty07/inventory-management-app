import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import './App.css';

import ProductCard from './components/ProductCard';
import AddProduct from './components/AddProduct';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productSearchName, setProductSearchName] = useState("");
  const [editIsVisible, setEditIsVisible] = useState(false);
  const [msgIsVisible, setMsgIsVisible] = useState(false);
  const [msgText, setMsgText] = useState("");

  useEffect(() => {
    getProducts();
    getCategories();
  }, [])

  async function getProducts() {
    const { data: productData, error: productError } = await supabase.from('Products').select();

    if (productError) {
      console.error(productError);
      setMsgIsVisible(true);
      setMsgText(`The database returned an error: ${productError}`);
      return;
    }

    setProducts(productData);
  }

  async function getCategories() {
    const { data: categoryData, error: categoryError } = await supabase.from('Categories').select();

    if (categoryError) {
      console.error(categoryError);
      setMsgIsVisible(true);
      setMsgText(`The database returned an error: ${categoryError}`);
      return;
    }

    setCategories(categoryData);
  }

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(productSearchName.toLowerCase())
  );

  return (
    <main id='container'>
      <h1>Available Products</h1>

      <div id='productSearch'>
        <input
          type='text'
          placeholder='Search products'
          onChange={(event) => setProductSearchName(event.target.value)}
        />

        <button
          className='btn'
          onClick={() => setEditIsVisible(true)}
        >Add a Product</button>
      </div>

      <div id='addProduct' className={editIsVisible ? 'msgVisible' : 'msgHidden'}>
        <h2>Add a product</h2>
        <AddProduct
          productID={false}
          categories={categories}
          products={products}
          setProducts={setProducts}
          setCategories={setCategories}
          setEditIsVisible={setEditIsVisible}
          setMsgIsVisible={setMsgIsVisible}
          setMsgText={setMsgText}
        />
      </div>

      <div className={msgIsVisible ? 'msgVisible' : 'msgHidden'}>
        <p>{msgText}</p>
      </div>

      <div id='productList'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard
                key={product.product_id}
                productID={product.product_id}
                name={product.product_name}
                categoryID={product.category_id}
                categories={categories}
                amountAvailable={product.quantity_available}
                description={product.description}
                products={products}
                setProducts={setProducts}
                setCategories={setCategories}
                setMsgIsVisible={setMsgIsVisible}
                setMsgText={setMsgText}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </main>
  )
}

export default App;
