const Product = require("../models/product");
const { validationResult } = require('express-validator');


const addProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

const postProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                imageUrl: imageUrl,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });

    product.save()
        .then((result) => {
            console.log("inserted");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
};

const editProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const productId = req.params.productId;

    Product.findById(productId)
        .then((product) => {
            if (!product) return res.redirect("/");

            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
};

const postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            hasError: true,
            product: {
                _id: productId,
                title: updatedTitle,
                price: updatedPrice,
                imageUrl: updatedImageUrl,
                description: updatedDescription
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(productId)
        .then(product => {
            console.log(product.userId);
            console.log(req.user._id);
            if (product.userId.toString() !== req.user._id.toString()) {
                console.log('true');
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save()
                .then(result => {
                    console.log('Updated Succussfuly');
                    res.redirect('/admin/products');
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })


};

const deleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteOne({ _id: productId, userId: req.user._id })
        .then((result) => {
            console.log("PRODUCT DESTROYED");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
    //Product.destroy({ where: { id: productId } })
};

const getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin products",
                path: "/admin/products",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
};

module.exports = {
    addProduct,
    postProduct,
    getProducts,
    editProduct,
    postEditProduct,
    deleteProduct,
};
