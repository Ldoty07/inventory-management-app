import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

import AddProduct from "./AddProduct";

function ProductCard({ productID, name, categoryID, categories, amountAvailable, description, products, setProducts, setCategories, setMsgIsVisible, setMsgText }) {
    const [deleteIsVisible, setDeleteIsVisible] = useState(false);
    const [editIsVisible, setEditIsVisible] = useState(false);

    const category = categories.find(
        category => category.category_id == categoryID
    );

    const categoryName = category
        ? category.category_name
        : "Unknown Category";

    async function deleteProduct(id) {
        const { data, error } = await supabase.from('Products').delete().eq('product_id', id).select();
        if (error) {
            console.error(error);
            setMsgIsVisible(true);
            setMsgText(`The database returned an error: ${error}`);
        }

        if (!error && data) {
            const updatedRow = data[0];
            setProducts(products.filter(product => product.product_id != updatedRow.product_id));
            setMsgIsVisible(true);
            setMsgText("Product deleted successfully.");
        }
    }

    return (
        <div className="productCard">
            <h3>{name}</h3>
            <p>{categoryName}</p>
            <p>Available: {amountAvailable}</p>
            <p>{description}</p>

            <button
                className="btn"
                onClick={() => setEditIsVisible(true)}
            >Edit</button>
            <button
                className="btn"
                onClick={() => setDeleteIsVisible(true)}
            >Delete</button>

            <div className={editIsVisible ? 'msgVisible' : 'msgHidden'}>
                <AddProduct
                    productID={productID}
                    categoryID={categoryID}
                    categories={categories}
                    products={products}
                    setProducts={setProducts}
                    setCategories={setCategories}
                    setEditIsVisible={setEditIsVisible}
                    setMsgIsVisible={setMsgIsVisible}
                    setMsgText={setMsgText}
                />
            </div>

            <div className={deleteIsVisible ? 'msgVisible' : 'msgHidden'}>
                <p>Are you sure you want to delete {name}?</p>
                <button
                    className="btn"
                    onClick={() => deleteProduct(productID)}
                >Yes</button>
                <button
                    className="btn"
                    onClick={() => setDeleteIsVisible(false)}
                >No</button>
            </div>
        </div>
    )
}

export default ProductCard;
