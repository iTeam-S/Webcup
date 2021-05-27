const connexion = require("../service/connexion")();
const service = require("../service/service");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    index: function(req, res){
        res.send("Hello World!");
    },

    register: function(req, res){
        console.log("==> POST REGISTER");
        var donnee = req.body;
        console.log(donnee);
        var email = donnee.email, mdp1 = donnee.pass, mdp2 = donnee.re_pass;
        connexion.then(function(db){
            service.inscrire(email, mdp1, mdp2, db).then(function(verification){
                if(verification !== true){
                    res.status(403).send(verification);
                }
                else{
                    bcrypt.hash(mdp1, saltRounds, function(err, hash) {
                        if(err) throw(err);
                        db.query("INSERT INTO user(email, mdp) VALUES(?,?)", [email, hash], function(err, resultat){
                            if(err) return res.status(500).send("Erreur: ressource");
                            service.return_user_email(email, db).then(function(resultat){
                                if(resultat == "Vérifier votre adresse email"){
                                    res.status(403).send(resultat);
                                }
                                else{
                                    const token = service.generer_token(resultat[0].id, email);
                                    res.send({id: resultat[0].id, token: token});
                                }
                            })
                        })
                    });
                }
            })
        })
    },
    
    login: function(req, res){
        console.log("==> POST LOGIN");
        var email = req.body.email, mdp = req.body.pass;
        console.log(email, mdp);
        if(email){
            connexion.then(function(db){
                service.return_user_email(email, db).then(function(resultat){
                    if(resultat == "Vérifier votre adresse email"){
                        res.status(403).send(resultat);
                    }
                    else{
                        bcrypt.compare(mdp, resultat[0].mdp, function(err, result) {
                            if(err) throw(err);
                            if(result === true){
                                const token = service.generer_token(resultat[0].id, email);
                                res.send({id: resultat[0].id, token: token});
                            }
                            else{
                                res.status(403).send({error:"Vérifier votre mot de passe"});
                            }
                        });
                    }
                })
            })
        }
        else{
            res.send("Aucun adresse email");
        }
    },

}