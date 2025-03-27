const { authJwt } = require("@middlewares");
const { signIn, WorkerCreate, WorkerUpdate  } = require('@utils/validators/manager');
const authController = require("@controllers/manager/auth.controller");
const dashboardController = require("@controllers/manager/dashboard.controller");
const workerController = require("@controllers/manager/worker.controller");
const stockHistoriesController = require("@controllers/manager/stockHistories.controller");


module.exports = (app, express, io) => {
    var router = express.Router();

    //auth
    router.post("/auth/signin", signIn, authController.signin);
    router.post("/logout", [authJwt.verifyToken, authJwt.isSuperAdmin], authController.logout);

    //dashboard
    router.get("/dashboard", [authJwt.verifyToken, authJwt.isManager], dashboardController.index);

    //workers
    router.get("/workers", [authJwt.verifyToken, authJwt.isManager], workerController.index);
    router.post("/workers/store", [authJwt.verifyToken, authJwt.isManager, WorkerCreate], workerController.store);
    router.post("/workers/update/:id", [authJwt.verifyToken, authJwt.isManager, WorkerUpdate], workerController.update);
    router.get("/workers/fetch/:id", [authJwt.verifyToken, authJwt.isManager], workerController.fetch);
    router.delete("/workers/delete/:id", [authJwt.verifyToken, authJwt.isManager], workerController.delete);

    //Stock Histories
    router.get("/stock-histories", [authJwt.verifyToken, authJwt.isManager], stockHistoriesController.index);
    router.post("/stock-histories/store", [authJwt.verifyToken, authJwt.isManager], stockHistoriesController.store);
    router.get("/stock-histories/fetch/:id", [authJwt.verifyToken, authJwt.isManager], stockHistoriesController.fetch);
    router.post("/stock-histories/update/:id", [authJwt.verifyToken, authJwt.isManager], stockHistoriesController.update);
    router.delete("/stock-histories/delete/:id", [authJwt.verifyToken, authJwt.isManager], stockHistoriesController.delete);
    router.get("/materials", [authJwt.verifyToken, authJwt.isManager], stockHistoriesController.materialList);
    router.get("/worker-stock", [authJwt.verifyToken, authJwt.isManager], stockHistoriesController.workerStock);
  
    
    
    app.use('/api/manager', router);
};