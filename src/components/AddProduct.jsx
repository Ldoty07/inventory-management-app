import { useState } from "react"
import { supabase } from "../lib/supabaseClient";

function AddProduct({ productID, categories, products, setProducts, setCategories, setEditIsVisible, setMsgIsVisible, setMsgText }) {
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newProductName, setNewProductName] = useState("");
    const [newProductQuantity, setNewProductQuantity] = useState(0);

    const product = {
            product_id: productID,
            product_name: newProductName,
            category_id: "",
            quantity_available: newProductQuantity,
            description: ""
        };
    
        async function addCategory(newCategory) {
            const category = categories.find(
                category => category.category_name == newCategory
            );
    
            if (category) {
                product.category_id = category.category_id;
            } else {
                setMsgIsVisible(false);
                setMsgText("");

                const { data, error } = await supabase.from('Categories').upsert({'category_name': newCategory}).select();
                if (error) {
                    console.error(error);
                    setMsgIsVisible(true);
                    setMsgText(`The database returned an error: ${error}`);
                }
    
                if (!error && data) {
                    const updatedRow = data[0];
                    setCategories((categories) =>
                        categories.map((category) => (category.category_id === updatedRow.category_id ? updatedRow : category))
                    );
                    product.category_id = updatedRow.category_id;
                }
            }
        }
    
        async function updateProduct() {
            setMsgIsVisible(false);
            setMsgText("");

            await addCategory(newCategoryName);

            if (!product.product_id) {
                const { data, error } = await supabase
                    .from('Products')
                    .insert({
                        product_name: product.product_name,
                        category_id: product.category_id,
                        quantity_available: product.quantity_available,
                        description: product.description})
                    .select();
                if (error) {
                    console.error(error);
                    setMsgIsVisible(true);
                    setMsgText(`The database returned an error: ${error}`);
                }

                if (!error && data) {
                    const updatedRow = data[0];
                    setProducts([...products, updatedRow]);
                    setMsgIsVisible(true);
                    setMsgText("Product added successfully.");
                }
            } else {
                const { data, error } = await supabase.from('Products').upsert(product, { onConflict: 'product_id' }).select();
                if (error) {
                    console.error(error);
                    setMsgIsVisible(true);
                    setMsgText(`The database returned an error: ${error}`);
                }
        
                if (!error && data) {
                    const updatedRow = data[0];
                    setProducts((products) =>
                        products.map((product) => (product.product_id === updatedRow.product_id ? updatedRow : product))
                    );
                    setMsgIsVisible(true);
                    setMsgText("Product updated successfully.");
                }
            }

            setEditIsVisible(false);
        }

    return (
        <div>
            <p>Product Name:</p>
            <input
                type="text"
                required
                onChange={(event) => setNewProductName(event.target.value)}
            />
            <p>Category:</p>
            <input
                type="text"
                required
                onChange={(event) => setNewCategoryName(event.target.value)}
            />
            <p>Amount:</p>
            <input 
                type="text"
                required
                onChange={(event) => setNewProductQuantity(event.target.value)}
            />
            <p>Description:</p>
            <input
                type="text"
                required
                onChange={(event) => product.description = event.target.value}
            />
            <br></br>
            <br></br>
            <button
                className="btn"
                onClick={updateProduct}
            >{productID ? "Update" : "Add"}</button>
        </div>
    )
}

export default AddProduct
