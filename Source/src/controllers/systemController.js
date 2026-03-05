const crypto = require('crypto');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const Admin = require('../models/adminModel');
const Bill = require('../models/billModel');
const Customer = require('../models/customerModel');
const ProductBill = require('../models/productBillModel');
const Product = require('../models/productModel');
const Staff = require('../models/staffModel');

const getProductSystem = async (req, res) => {
    try {
        const productsInSession = req.session.products || [];
        const p = await Product.find();
        res.render('system/productSystem', { products: productsInSession, listProduct: p });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postAddProduct = async (req, res) => {
    const { productCode } = req.body;

    try {
        const product = await Product.findOne({ code_product: productCode });

        if (!product) {
            req.flash('error', 'Product does not exist');
            return res.redirect('/system/'); 
        }

        if (!req.session.products) {
            req.session.products = [];
        }

        const existingProductIndex = req.session.products.findIndex(
            (item) => item._id.toString() === product._id.toString()
        );

        if (existingProductIndex !== -1) {
            req.session.products[existingProductIndex].quantity += 1;
        } else {
            const productWithQuantity = Object.assign({}, product.toObject(), { quantity: 1 });
            req.session.products.push(productWithQuantity);
        }

        req.flash('success', 'Added product to cart');
        return res.redirect('/system/'); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postAddProduct1 = async (req, res) => {
    const { searchTerm } = req.body;

    try {
        const product = await Product.findOne({ name_product: searchTerm });

        if (!product) {
            req.flash('error', 'Product does not exist');
            return res.redirect('/system/'); 
        }

        if (!req.session.products) {
            req.session.products = [];
        }

        const existingProductIndex = req.session.products.findIndex(
            (item) => item._id.toString() === product._id.toString()
        );

        if (existingProductIndex !== -1) {
            req.session.products[existingProductIndex].quantity += 1;
        } else {
            const productWithQuantity = Object.assign({}, product.toObject(), { quantity: 1 });
            req.session.products.push(productWithQuantity);
        }

        req.flash('success', 'Added product to cart');
        return res.redirect('/system/'); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const postSetQuantityProduct = async (req, res) => {
    const { productCode, quantity } = req.body;

    try {
        const productIndex = req.session.products.findIndex(prod => prod.code_product === productCode);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Please try again' });
        }

        req.session.products[productIndex].quantity = quantity;

        res.status(200).json({ message: 'Done' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteDeleteProduct = async (req, res) => {
    const productCode = req.params.id;

    try {
        const productIndex = req.session.products.findIndex(prod => prod.code_product === productCode);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Please try again' });
        }

        req.session.products = req.session.products.filter(product => product.code_product !== productCode);

        res.status(200).json({ message: 'Done' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPaymentSystem = async (req, res) => {
    try {
        const productsInSession = req.session.products || [];

        let totalProduct = 0;
        let totalMoney = 0;

        productsInSession.forEach(product => {
            totalProduct += parseFloat(product.quantity);
            totalMoney += parseFloat(product.price_sell_product) * parseFloat(product.quantity);
        });

        res.render('system/paymentSystem', { products: productsInSession, totalProduct, totalMoney });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const generatePDF = async (productsInSession, newBill, customer) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];
        
        doc.on('data', buffer => buffers.push(buffer));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        
        doc.fontSize(16).text('Bill Information', { align: 'center' }).moveDown(0.5);
        
        doc.fontSize(14).text('Customer Information:');
        doc.fontSize(12).text(`Name: ${customer.name_customer}`);
        doc.text(`Phone: ${customer.phone_customer}`);
        doc.text(`Address: ${customer.address_customer}`).moveDown();

        doc.fontSize(14).text('Bill Details:');
        doc.fontSize(12).text(`Total Money: ${newBill.total_money_bill}`);
        doc.text(`Total Products: ${newBill.total_product_bill}`);
        doc.text(`Money Given: ${newBill.money_give_bill}`);
        doc.text(`Money Back: ${newBill.money_back_bill}`).moveDown();

        doc.fontSize(14).text('Products:');
        productsInSession.forEach((product, index) => {
            doc.fontSize(12).text(`Code Product ${index + 1}: ${product.code_product}, Name Product: ${product.name_product}, Quantity: ${product.quantity}`);
        });

        doc.end();
    });
};

const postPaymentSystem = async (req, res) => {
    try {
        const productsInSession = req.session.products || [];
        const staff = req.session.staff;

        const {
            nameCustomer,
            phoneCustomer,
            addressCustomer,
            moneyGive,
            moneyBack,
            totalProduct,
            totalMoney,
        } = req.body;


        let customer = await Customer.findOne({ phone_customer: phoneCustomer });
    
        if (!customer) {
            customer = new Customer({
                phone_customer: phoneCustomer,
                name_customer: nameCustomer,
                address_customer: addressCustomer
            });
            await customer.save();
        }

        const newBill = new Bill({
            total_money_bill: totalMoney,
            total_product_bill: totalProduct,
            money_give_bill: moneyGive,
            money_back_bill: moneyBack,
            date_bill: new Date(),
            customer: customer,
            staff: staff,
        });

        await newBill.save();

        productsInSession.forEach(async product => {
            const productBill = new ProductBill({
                bill: newBill,
                product: product,
                quantity_product_bill: product.quantity,
            });

            await productBill.save();
        });

        req.session.products = null;

        const pdfBuffer = await generatePDF(productsInSession, newBill, customer);
        const base64PDF = pdfBuffer.toString('base64');

        res.status(201).json({ message: 'Done', bill: newBill, pdfBase64: base64PDF });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postClearProduct = async (req, res) => {
    try {
        req.session.products = null;

        req.flash('success', 'Cart cleared successfully');
        res.redirect('/system/');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getProductSystem,
    postAddProduct,
    getPaymentSystem,
    postPaymentSystem,
    postClearProduct,
    postAddProduct1,
    postSetQuantityProduct,
    deleteDeleteProduct,
};