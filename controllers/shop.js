
const Product = require("../models/product");
const Order = require('../models/order');


const getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",

            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
};

const getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All products",
                path: "/products",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
};

const getProduct = (req, res, next) => {
    const producId = req.params.productId;

    Product.findById(producId)
        .then((product) => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })

};

const getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            res.render("shop/cart", {
                pageTitle: "Your Cart",
                path: "/cart",
                products: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log("Error :", err);
        })

};

const postCart = (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })

};

const deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .removeFromCart(productId)
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
};

const postOrder = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } }
            });
            console.log(user.cart.items);
            const order = new Order({
                products: products,

                user: {
                    email: req.user.email,
                    userId: req.user
                }
            })
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('orders')
        })

        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });

}


const getOrders = (req, res, next) => {
    Order
        .find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render("shop/orders", {
                pageTitle: "Your Orders",
                path: "/orders",
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });

};


module.exports = {
    getIndex,
    getProducts,
    getProduct,
    getCart,
    postCart,
    getOrders,
    deleteCartItem,
    postOrder
};
