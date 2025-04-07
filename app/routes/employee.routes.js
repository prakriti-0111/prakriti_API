const { authJwt } = require("@middlewares");
const authController = require("@controllers/employee/auth.controller");
const dashboardController = require("@controllers/employee/dashboard.controller");
const profileController = require('@controllers/employee/profile.controller');


module.exports = (app, express, io) => {
    var router = express.Router();

    //auth
    router.post("/auth/signin", [], authController.signin);
    router.post("/logout", [authJwt.verifyToken, authJwt.isSuperAdmin], authController.logout);
    router.post("/auth/forgot-password-send-otp", [], authController.forgotPasswordSendOtp);
    router.post("/auth/forgot-password-verify-otp", [], authController.forgotPasswordVerifyOtp);
    router.post("/auth/forgot-password", [], authController.forgotPassword);
    router.get("/employee-roles", [], authController.employeeRoles);

    //profile
    router.post("/edit-profile", [authJwt.verifyToken, authJwt.isSuperAdmin], profileController.editProfile);
    router.post("/change-password", [authJwt.verifyToken, authJwt.isSuperAdmin], profileController.changePassword);

    //dashboard
    router.get("/dashboard", [authJwt.verifyToken, authJwt.isAdmin], dashboardController.index);
    router.get("/permissions", [authJwt.verifyToken, authJwt.isAdmin], dashboardController.permissions);
    
    
    app.use('/api/employee', router);
};