/**
 * 
 * @returns array of products
 */
async function getAllProducts() {
    const response = await fetch(`https://fakestoreapi.com/products`);
    if (!response.ok) {
        throw new Error(response.status);
    }

    const products = await response.json();
    return products;
}

/**
 * 
 * @param {Number} id 
 * @returns Product
 */
async function getProduct(id) {
    response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) {
        throw new Error(response.status);
    }

    const product = await response.json();
    return product;
}

module.exports = {
    getAllProducts,
    getProduct,
};