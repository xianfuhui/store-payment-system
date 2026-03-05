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

// Thêm sản phẩm vào database
const postAddProduct = async (req, res) => {
    try {
        const {
            code_product,
            name_product,
            price_buy_product,
            price_sell_product,
        } = req.body;

        const productExist = await Product.findOne({ code_product: code_product });

        if(productExist) {
            return res.status(404).json({ message: 'Unable to add the product because the product code already exists in the database' });
        }

        const newProduct = new Product({
            code_product,
            name_product,
            price_buy_product,
            price_sell_product,
            day_add_product: new Date()
        });
        
        await newProduct.save();

        res.status(200).json({ message: 'Added product successfully', product: newProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Chỉnh sửa sản phẩm vào database
const putEditProduct = async (req, res) => {
    const productId = req.params.id;
    const {
        code_product,
        name_product,
        price_buy_product,
        price_sell_product,
    } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            code_product,
            name_product,
            price_buy_product,
            price_sell_product,
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Please try again' });
        }

        res.status(200).json({ message: 'Edit product successfully', product: updatedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Xóa sản phẩm vào database
const deleteDeleteProduct = async (req, res) => {
    const productId = req.params.id;
    
    try {
        const productExist = await ProductBill.findOne({ product: productId });

        if(productExist) {
            return res.status(404).json({ message: 'Cannot be deleted because this product is included in the invoice' });
        }

        await Product.findByIdAndDelete(productId);

        res.status(200).json({ message: 'Delete product successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin chi tiết nhân viên
const getListDetailStaff = async (req, res) => {
    const id_staff = req.params.id;

    try {
        const staff = await Staff.findById(id_staff);
        if (!staff) {
            return res.redirect('/405');
        }

        res.render('admin/listDetailStaff', { staff });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin tất cả sản phẩm
const getListProductAdmin = async (req, res) => {
    try {
        const list_product_admin = await Product.find();
        res.render('admin/listProductAdmin', { list_product_admin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin tất cả nhân viên
const getListStaff = async (req, res) => {
    try {
        const list_staff = await Staff.find();
        res.render('admin/listStaff', { list_staff });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Xóa nhân viên
const deleteDeleteStaff = async (req, res) => {
    const staffId = req.params.id;
    
    try {
        const deletedStaff = await Staff.findByIdAndDelete(staffId);

        if (!deletedStaff) {
            return res.status(404).json({ message: 'Please try again' });
        }

        // Nếu xóa thành công, gửi phản hồi thành công về client
        res.status(200).json({ message: 'Delete staff successfully' });
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
};

// Đăng nhập Admin
const getLoginAdmin = async (req, res) => {
    try {
        if (req.session.admin) {

            res.redirect('/admin/profile-admin');
        } else {
            res.render('admin/loginAdmin');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postLoginAdmin = async (req, res) => {
    const { name_admin, password_admin } = req.body;

    try {
        const admin = await Admin.findOne({ name_admin, password_admin });

        if (!admin) {
            req.flash('error', 'Incorrectly entered administrator name or password');
            return res.redirect('/admin/login-admin')
        } else {
            req.session.admin = admin;
            return res.redirect('/admin/profile-admin')
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin Admin hiện tại
const getProfileAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.admin._id);;

        if (!admin) {
            req.flash('error', 'Please try again');
            return res.redirect('/admin/profile-admin')
        }

        res.render('admin/profileAdmin', { admin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Hiển thị form đăng ký Staff
const getRegisterStaff = async (req, res) => {
    try {
        res.render('admin/registerStaff');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postRegisterStaff = async (req, res) => {
    try {
        const { fullName, email } = req.body;

        const existingStaff = await Staff.findOne({ email_staff: email });
        if (existingStaff) {
            req.flash('error', 'The staff already exists in the system');
            return res.redirect('/admin/register-staff');
        }

        const name = email.split('@')[0];
        const password = email.split('@')[0];

        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiration = Date.now() + 60000;

        const newStaff = new Staff({
            avatar_staff: '/images/avatar_staff.jpg',
            full_name_staff: fullName,
            email_staff: email,
            name_staff: name,
            password_staff: password,
            date_staff: new Date(),
            status_staff: 1,
            check_click_email_staff: false,
            check_change_new_password_first_time_staff: false,
            email_verification_token: token,
            email_verification_token_expiration: tokenExpiration,
        });

        await newStaff.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASS_EMAIL, 
            },
        });

        const currentURL = req.protocol + '://' + req.get('host');

        const mailOptions = {
            from: 'Payment Shop',
            to: email,
            subject: 'Account Registration Verification',
            html: `
                <p>Hello ${fullName},</p>
                <p>Please click on the following link to verify your account registration:</p>
                <a href="${currentURL}/staff/verify-email-token-staff/${token}">Verify Account</a>
            `,
        };        

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        req.flash('success', 'Staff account successfully created. Verification email has been sent to staff');
        return res.redirect('/admin/register-staff');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Đổi mật khẩu Admin hiện tại
const postChangePasswordAdmin = async (req, res) => {
    const { name_admin } = req.session.admin;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        const admin = await Admin.findOne({ name_admin: name_admin, password_admin: currentPassword });

        if (!admin) {
            req.flash('error', 'Enter the wrong old password');
            return res.redirect('/admin/profile-admin');
        }

        if (newPassword !== confirmPassword) {
            req.flash('error', 'New passwords do not match');
            return res.redirect('/admin/profile-admin');
        }

        admin.password_admin = newPassword;

        await admin.save();

        req.flash('success', 'Password changed successfully');
        return res.redirect('/admin/profile-admin');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Upload avatar Admin
const postUploadAvatarAdmin = async (req, res) => {
    try {
        if (!req.file) {
            req.flash('error', 'Please try again');
            return res.redirect('/admin/profile-admin');
        }

        const avatarPath = '/images/' + req.file.filename

        const admin = await Admin.findById(req.session.admin._id);

        if (!admin) {
            req.flash('error', 'Please try again');
            return res.redirect('/admin/profile-admin');
        }

        admin.avatar_admin = avatarPath;
        await admin.save();

        req.flash('success', 'Changed avatar successfully');
        return res.redirect('/admin/profile-admin');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Change status Staff
const postChangeStatusStaff = async (req, res) => {
    const { staffId, currentStatus } = req.body;

    try {
        const staff = await Staff.findById(staffId);
        
        if (!staff) {
            return res.status(404).json({ message: 'Please try again' });
        }

        const newStatus = currentStatus === 'true';
        staff.status_staff = !newStatus;
        await staff.save();

        return res.status(200).json({ message: 'Updated status', staff: staff });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Button send mail
const postSendTokenToEmailStaff = async (req, res) => {
    const { staffId } = req.body;

    try {
        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiration = Date.now() + 60000;

        const staff = await Staff.findById(staffId);

        if (staff) {
            staff.email_verification_token = token
            staff.email_verification_token_expiration = tokenExpiration

            await staff.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.PASS_EMAIL, 
                },
            });

            const currentURL = req.protocol + '://' + req.get('host');

            const mailOptions = {
                from: 'Payment Shop',
                to: staff.email_staff,
                subject: 'Account Registration Verification',
                html: `
                    <p>Hello ${staff.full_name_staff},</p>
                    <p>Please click on the following link to verify your account registration:</p>
                    <a href="${currentURL}/staff/verify-email-token-staff/${token}">Verify Account</a>
                `,
            };              

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } else {
            return res.status(404).json({ message: 'Please try again' });
        }

        return res.status(200).json({ message: 'Verification email has been sent to staff' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getLogoutAdmin = async (req, res) => {
    try {
        req.session.admin = null; 

        res.redirect('/admin/login-admin'); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    postAddProduct,
    putEditProduct,
    deleteDeleteProduct,
    getListDetailStaff,
    getListProductAdmin,
    getListStaff,
    getLoginAdmin,
    postLoginAdmin,
    getProfileAdmin,
    getRegisterStaff,
    postRegisterStaff,
    postChangePasswordAdmin,
    postUploadAvatarAdmin,
    postChangeStatusStaff,
    postSendTokenToEmailStaff,
    deleteDeleteStaff,
    getLogoutAdmin,
};