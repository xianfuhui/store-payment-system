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

// Lấy thông tin hoá đơn của một khách hàng dựa trên ID khách hàng
const getListBillCustomer = async (req, res) => {
    const id_customer = req.params.id; 

    try {
        const customer = await Customer.findById(id_customer); 
        if (!customer) {
            //Không tìm thấy khách hàng
            return res.redirect('/404');
        }

        const list_bill_customer = await Bill.find({ customer: id_customer }).populate('customer').populate('staff'); 

        res.render('staff/listBillCustomer', { customer, list_bill_customer }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin tất cả khách hàng
const getListCustomer = async (req, res) => {
    try {
        const list_customer = await Customer.find();
        res.render('staff/listCustomer', { list_customer });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin hoá đơn của một hóa đơn dựa trên ID hóa đơn
const getListDetailBillCustomer = async (req, res) => {
    const id_bill = req.params.id; 

    try {
        const bill = await Bill.findById(id_bill).populate('customer').populate('staff'); 
        if (!bill) {
            return res.redirect('/404');
        }

        const list_product_bill = await ProductBill.find({ bill: id_bill }).populate('product');

        res.render('staff/listDetailBillCustomer', { bill, list_product_bill }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin tất cả sản phẩm
const getListProductStaff = async (req, res) => {
    try {
        const list_product = await Product.find();
        res.render('staff/listProductStaff', { list_product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Đăng nhập Staff
const getLockedStatusStaff = async (req, res) => {
    try {
        res.render('staff/lockedStatusStaff');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Đăng nhập Staff
const getLoginStaff = async (req, res) => {
    try {
        if (req.session.staff) {
            res.redirect('/staff/profile-staff');
        } else {
            res.render('staff/loginStaff');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postLoginStaff = async (req, res) => {
    const { name_staff, password_staff } = req.body;

    try {
        const staff = await Staff.findOne({ name_staff, password_staff });
        
        if (!staff) {
            req.flash('error', 'Incorrect username or password entered');
            res.redirect('/staff/login-staff'); 
        } else {
            if (!staff.check_click_email_staff) {
                req.flash('error', 'You are a new employee so you must authenticate via email');
                res.redirect('/staff/login-staff'); 
            } else if (!staff.status_staff) {
                req.session.staff = staff;
                res.redirect('/staff/locked-status-staff'); 
            } else if (!staff.check_change_new_password_first_time_staff) {
                req.session.staff = staff;
                res.redirect('/staff/new-password-staff'); 
            } else {
                req.session.staff = staff;
                res.redirect('/staff/profile-staff');
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Hiển thị form điền mật khẩu mới
const getNewPasswordStaff = async (req, res) => {
    try {
        res.render('staff/newPasswordStaff');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postNewPasswordStaff = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    try {
        const staff = await Staff.findById(req.session.staff._id);
       
        if (!staff) {
            req.flash('error', 'Please try again');
            return res.redirect('/staff/new-password-staff'); 
        }

        if (newPassword !== confirmPassword) {
            req.flash('error', "New password and confirm password don't match");
            return res.redirect('/staff/new-password-staff'); 
        }

        staff.password_staff = newPassword;
        staff.check_change_new_password_first_time_staff = 1;

        await staff.save();

        req.session.staff = staff

        req.flash('success', 'New password added successfully');
        res.redirect('/staff/profile-staff'); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin Staff hiện tại
const getProfileStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.session.staff._id);; 
        
        if (!staff) {
            return res.redirect('/404');
        }

        res.render('staff/profileStaff', { staff }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Đổi mật khẩu Staff hiện tại
const postChangePasswordStaff = async (req, res) => {
    const { name_staff } = req.session.staff;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        const staff = await Staff.findOne({ name_staff: name_staff, password_staff: currentPassword });
       
        if (!staff) {
            req.flash('error', "Enter the wrong old password");
            return res.redirect('/staff/profile-staff'); 
        }

        if (newPassword !== confirmPassword) {
            req.flash('error', "New password and confirm password don't match");
            return res.redirect('/staff/profile-staff'); 
        }

        staff.password_staff = newPassword;

        await staff.save();

        req.flash('success', 'Password changed successfully');
        res.redirect('/staff/profile-staff'); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Upload avatar Staff
const postUploadAvatarStaff = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const avatarPath = '/images/' + req.file.filename

        const staff = await Staff.findById(req.session.staff._id);;
    
        if (!staff) {
            req.flash('error', 'Please try again');
            return res.redirect('/staff/profile-staff'); 
        }

        staff.avatar_staff = avatarPath;
        await staff.save();

        req.flash('success', 'Avatar changed successfully');
        res.redirect('/staff/profile-staff'); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Xác thực email token
const getVerifyEmailTokenStaff = async (req, res) => {
    const { token } = req.params;

    try {
        const staffMember = await Staff.findOne({
            email_verification_token: token,
            email_verification_token_expiration: { $gt: Date.now() }, 
        });

        if (!staffMember) {
            req.flash('error', 'The token link has expired');
            return res.redirect('/staff/login-staff'); 
        }

        staffMember.check_click_email_staff = true;
        await staffMember.save();

        req.flash('success', 'Email confirmed successfully');
        res.redirect('/staff/login-staff')
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getLogoutStaff = async (req, res) => {
    try {
        req.session.staff = null; 

        res.redirect('/staff/login-staff'); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getListBillCustomer,
    getListCustomer,
    getListDetailBillCustomer,
    getListProductStaff,
    getLockedStatusStaff,
    getLoginStaff,
    postLoginStaff,
    getNewPasswordStaff,
    postNewPasswordStaff,
    getProfileStaff,
    postChangePasswordStaff,
    postUploadAvatarStaff,
    getVerifyEmailTokenStaff,
    getLogoutStaff,
};