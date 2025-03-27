const { authJwt } = require("@middlewares");
const { signIn } = require('@utils/validators/supplier');
const authController = require("@controllers/supplier/auth.controller");
const dashboardController = require("@controllers/supplier/dashboard.controller");

module.exports = (app, express, io) => {
    var router = express.Router();

    //auth
    router.post("/auth/signin", signIn, authController.signin);

    //dashboard
    router.get("/dashboard", [authJwt.verifyToken, authJwt.isSupplier], dashboardController.index);
    
    app.use('/api/supplier', router);
};