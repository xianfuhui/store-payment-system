const multer = require('multer');
const path = require('path');

const sessionStaff = (req, res, next) => {
  if (req.session && req.session.staff) {
    if (req.session.staff.status_staff === false) {
      return res.redirect('/staff/locked-status-staff');
    } else if (!req.session.staff.check_change_new_password_first_time_staff) {
      return res.redirect('/staff/new-password-staff');
    } else {
      next();
    }
  } else {
    return res.redirect('/staff/login-staff');
  }
};

const sessionStaff1 = (req, res, next) => {
  if (req.session && req.session.staff) {
    next()
  } else {
    return res.redirect('/404');
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images');
  },
  filename: function (req, file, cb) {
    const staffId = req.session.staff._id;
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = 'avatar_staff_' + staffId + '.' + fileExtension;

    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });

module.exports = {
  sessionStaff,
  sessionStaff1,
  upload,
}