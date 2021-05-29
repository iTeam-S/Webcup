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
        var email = donnee.email, mdp1 = donnee.pass, mdp2 = donnee.re_pass, nom = donnee.nom, prenom = donnee.prenom, ville = donnee.ville, adresse = donnee.ville, pdp = "";
        connexion.then(function(db){
            service.inscrire(email, mdp1, mdp2, db).then(function(verification){
                if(verification !== true){
                    res.status(403).send(verification);
                }
                else{
                    bcrypt.hash(mdp1, saltRounds, function(err, hash) {
                        if(err) throw(err);
                        if(req.files){              
                            pdp = service.uploadfile("image/", req.files.pdp);
                        } 
                        db.query("INSERT INTO user(email, mdp, nom, prenom, ville, adresse, pdp) VALUES(?,?,?,?,?,?,?)", [email, hash, nom, prenom, ville, adresse, pdp], function(err, resultat){
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

    update: function(req, res){
        console.log("==> UPDATE USER");
        console.log(req.body);
        var id = req.body.id, email = req.body.email, nom = req.body.nom, prenom = req.body.prenom, adresse = 
        req.body.adresse, ville = req.body.ville, pdp = "";
        connexion.then(function(db){
            service.verifier_exist_user(id, db).then(function(user){
                if(user && email){
                    service.mail_utiliser_autre_user(email, id, db).then(function(verification){
                        console.log(verification);
                        if(verification === false){
                            if(req.files){
                                if(user[0].pdp) service.deleteFile("public/"+user[0].pdp);                
                                pdp = service.uploadfile("image/", req.files.pdp);
                            }       
                            db.query("UPDATE user set email = ?, nom = ?, prenom = ?, pdp = ?, ville = ?, adresse = ? WHERE id =?", [email, nom, prenom, pdp, ville, adresse, id], function(err){
                                if(err) return res.status(500).send({error: "Ressource"});
                                res.send({success:true});
                            })
                        }
                        else{
                            res.status(403).send({error:verification});
                        }
                    })
                }
                else{
                    res.status(403).send({error:"Utilisateur introuvable"});
                }
            })
        })
    }

}