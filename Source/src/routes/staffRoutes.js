const express = require('express');

const router = express.Router();

const staffController = require('../controllers/staffController');
const staffMiddleware = require('../middlewares/staffMiddleware');

// Route để lấy thông tin hoá đơn của một khách hàng dựa trên ID khách hàng
router.get('/list-bill-customer/:id', staffMiddleware.sessionStaff, staffController.getListBillCustomer);

// Route để lấy thông tin tất cả khách hàng
router.get('/list-customer', staffMiddleware.sessionStaff, staffController.getListCustomer);

// Route để lấy thông tin chi tiết hoá đơn của một hóa đơn dựa trên ID hóa đơn
router.get('/list-detail-bill-customer/:id', staffMiddleware.sessionStaff, staffController.getListDetailBillCustomer);

// Route để lấy thông tin tất cả sản phẩm
router.get('/list-product-staff', staffMiddleware.sessionStaff, staffController.getListProductStaff);

// Route để hiển thị tài khoản bị khóa
router.get('/locked-status-staff', staffMiddleware.sessionStaff1, staffController.getLockedStatusStaff);

// Route để get đăng nhập
router.get('/login-staff', staffController.getLoginStaff);

// Route để post đăng nhập
router.post('/login-staff', staffController.postLoginStaff);

// Route để hiển thị form điền mật khẩu mới
router.get('/new-password-staff', staffMiddleware.sessionStaff1, staffController.getNewPasswordStaff);

// Route để post form điền mật khẩu mới
router.post('/new-password-staff', staffMiddleware.sessionStaff1, staffController.postNewPasswordStaff);

// Route để lấy thông tin Staff hiện tại
router.get('/profile-staff', staffMiddleware.sessionStaff, staffController.getProfileStaff);

// Route để đổi mật khẩu Staff hiện tại
router.post('/change-password-staff', staffMiddleware.sessionStaff, staffController.postChangePasswordStaff);

// Route để upload ảnh
router.post('/upload-avatar-staff', staffMiddleware.sessionStaff, staffMiddleware.upload.single('avatar_staff'), staffController.postUploadAvatarStaff);

// Route để xác nhận token qua email
router.get('/verify-email-token-staff/:token', staffController.getVerifyEmailTokenStaff);

// Route để get đăng xuất
router.get('/logout-staff', staffController.getLogoutStaff);

module.exports = router;