const connexion = require("../service/connexion")();
const service = require("../service/service");
var Web3 = require('web3');
const solc = require('solc');

var web3 = new Web3(new Web3.providers.HttpProvider('http://185.98.128.90:8545'));


/*
service.read_file("service/contrats.sol").then(function(source){

    var input = {
        language: 'Solidity',
        sources: {
          'contrats.sol': {
            content: source
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };

    var contr = JSON.parse(solc.compile(JSON.stringify(input)));
    //console.log(contr.contracts['contrats.sol']['Webcup'])
    var abi = contr.contracts['contrats.sol']['Webcup'].abi
    web3.eth.getAccounts().then(function(accounts){
        var web = new web3.eth.Contract(abi, accounts[0])
       // web.methods.helloWorld().transact((err, resultat)=> {console.log(err.toString())});
    })
    
    //
    
})

*/


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