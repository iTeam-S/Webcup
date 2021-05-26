var connexion = require('../service/connexion')();

module.exports = {
    index: function(req, res){
        console.log("==> GET INDEX");
        res.send("Bonjour!");
    },

}