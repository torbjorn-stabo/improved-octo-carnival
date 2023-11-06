const { application } = require('express');
const Product = require('./../models/productModel');
const API = require('../api/products')

/*
 * How to handle the 'minimum number of HTTP calls' here? Warming up the cache/database by fetching
 * all the products here is the most straightforward way. This way we only make one call to the API
 * and store the result in our database. This way getProduct() calls should have to call the API next
 * to never.
 * But this leads to the question how to handle if the API database changes contents. If we only call
 * the API once from getAllProducts() we'll never receive any such updates. Judging from Postman there
 * is an Etag and maxage header in the API response for getProducts(), perhaps that could be used.
 * Another option would be to have a cronjob updating the database on regular intervals, and add
 * caching for getProducts() as well.
 * For now the code is doing the obvious thing, fetch from the local database first and only then from
 * the API if there was a local miss.
 */

/*
 * TODO: Refactor out all res.status(...).json(...) blocks? They are slightly varying though, which
 * might make things more tricky. But it would probably make the code look more clean.
 */

/**
 * Fetch data about all products from API, store them in the database and return the data to
 * the user.
 */
async function getAllProducts(req, res) {
    try {
        products = await API.getAllProducts();
    } catch (err) {
        return res.status(404).json({
            status: 'fail',
            message: err.message,
        });        
    }

    /*
     * Save API data in database
     */

    let saves = [];
    for (const product of products) {
        saves.push(
            Product.findOneAndUpdate(
                {id: product.id},
                product,
                {upsert: true}
            )
        );
    }
    await Promise.all(saves);

    /*
     * Build the query
     */

    let query = Product.find()
                        .select('image title price category'); // Fields to return

    /*
     * Filter 
     */

    const filter = {};
    if ('category' in req.query) {
        filter['category'] = req.query.category;
    }

    if ('minPrice' in req.query) {
        if (!filter['price']) {
            filter['price'] = {};
        }

        filter['price']['$gte'] = req.query.minPrice;
    }
    if ('maxPrice' in req.query) {
        if (!filter['price']) {
            filter['price'] = {};
        }
        
        filter['price']['$lte'] = req.query.maxPrice;
    }

    query = Product.find(filter);

    /*
     * Pagination
     */

    const pageNum = req.query.pageNum || 1;
    let pageSize = req.query.pageSize || 8;
    if (pageSize<1 || pageSize>8) {
        pageSize = 8;
    }

    query = query.skip(pageSize * (pageNum - 1)).limit(pageSize);

    /*
     * Fetch the data from the database
     */

    try {
        var products = await query;
    } catch (err) {
        return res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { 
          products
        }
    });
}

/**
 * Return data about the single product identified by the id parameter.
 * The cached version is used if it exists, otherwise data is fetched from the API.
 * The product object is then returned to the user.
 */
async function getProduct(req, res) {
    const id = req.params.id;

    /*
     * Fetch from database
     */

    try {
        var product = await Product.findOne({ id })
                                    .select('image title price category description'); // Fields to return
    } catch (err) {
        return res.status(404).json({
            status: 'fail',
            message: err,
        });
    }

    /*
     * If the db was a miss, fetch from API
     */

    if (product === null) {
        console.log('getProduct(): Fetching from API');

        try {
            product = await API.getProduct(id);
        } catch (err) {
            return res.status(404).json({
                status: 'fail',
                message: err,
            });
        }

        await Product.create(product);
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
}

exports.getProduct = getProduct;
exports.getAllProducts = getAllProducts;
