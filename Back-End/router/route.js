const user = require("../controller/user");
const transaction = require("../controller/transaction");
const middleware = require("../middleware/auth");

// On injecte le router d"express, nous en avons besoin pour définir les routes 
module.exports = function(router) {   
    router.get("/", user.index);

    //USER
    router.post("/api/v1/register", user.register);
    router.post("/api/v1/login", user.login);
    router.post("/api/v1/update", user.update);

    //TRANSACTION
    router.post("/api/v1/investir", transaction.investir);
    router.get("/api/v1/investissement", transaction.get_investissement);
    router.get("/api/v1/statistique", transaction.statistique);
};