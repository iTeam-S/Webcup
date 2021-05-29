const connexion = require("../service/connexion")();
const service = require("../service/service");
var Web3 = require('web3');

module.exports = {
    investir: function(req, res){
        console.log("==> POST INVESTIR");
        var id = req.body.id, type = req.body.type, icon_s = req.body.icons, date_creation = new Date();
        connexion.then(function(db){
            service.verifier_exist_user(id, db).then(function(user){
                if(user){
                    if(type === "actionnaire"){
                        
                    }
                    else if(type === "citoyen"){
                        
                    }
                    else if(type === "don"){
                        
                    }
                }
                else{
                    res.status(403).send({error:"Utilisateur introuvable"});
                }
            })
        })
    },

    get_investissement: function(req, res){
        console.log("==> GET INVESTISSEMENT");
        var id = req.query.id;
        connexion.then(function(db){
            service.verifier_exist_user(id, db).then(function(user){
                if(user){
                    
                }
                else{
                    res.status(403).send({error:"Utilisateur introuvable"});
                }
            })
        })
    },

    statistique: function(req, res){
        console.log("==> GET STATISTIQUE");

    }
}