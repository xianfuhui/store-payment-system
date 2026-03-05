const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Route để post đăng nhập
router.post('/add-product', adminMiddleware.sessionAdmin, adminController.postAddProduct);

// Route để put chỉnh sửa sản phẩm
router.put('/edit-product/:id', adminMiddleware.sessionAdmin, adminController.putEditProduct);

// Route để delete xóa sản phẩm
router.delete('/delete-product/:id', adminMiddleware.sessionAdmin, adminController.deleteDeleteProduct);

// Route để lấy thông tin chi tiết nhân viên
router.get('/list-detail-staff/:id', adminMiddleware.sessionAdmin, adminController.getListDetailStaff);

// Route để lấy thông tin tất cả sản phẩm
router.get('/list-product-admin', adminMiddleware.sessionAdmin, adminController.getListProductAdmin);

// Route để lấy thông tin tất cả nhân viên
router.get('/list-staff', adminMiddleware.sessionAdmin, adminController.getListStaff);

// Route để get đăng nhập
router.get('/login-admin', adminController.getLoginAdmin);

// Route để post đăng nhập
router.post('/login-admin', adminController.postLoginAdmin);

// Route để lấy thông tin profile
router.get('/profile-admin', adminMiddleware.sessionAdmin, adminController.getProfileAdmin);

// Route để get đăng ký
router.get('/register-staff', adminMiddleware.sessionAdmin, adminController.getRegisterStaff);

// Route để post đăng ký
router.post('/register-staff', adminMiddleware.sessionAdmin, adminController.postRegisterStaff);

// Route để đổi mật khẩu Admin hiện tại
router.post('/change-password-admin', adminMiddleware.sessionAdmin, adminController.postChangePasswordAdmin);

// Route để upload ảnh
router.post('/upload-avatar-admin', adminMiddleware.sessionAdmin, adminMiddleware.upload.single('avatar_admin'), adminController.postUploadAvatarAdmin);

// Route để thay đổi trạng thái Staff
router.post('/change-status-staff', adminMiddleware.sessionAdmin, adminController.postChangeStatusStaff);

// Route để thay đổi trạng thái Staff
router.post('/send-token-to-email-staff', adminMiddleware.sessionAdmin, adminController.postSendTokenToEmailStaff);

// Route để lấy thông tin tất cả nhân viên
router.delete('/delete-staff/:id', adminMiddleware.sessionAdmin, adminController.deleteDeleteStaff);

// Route để get đăng xuất
router.get('/logout-admin', adminMiddleware.sessionAdmin, adminController.getLogoutAdmin);

module.exports = router;
