const jwt = require('jsonwebtoken');
const SECRET = 'mykey'
const fs = require('fs');

/*
Explication function:
==> inscrire: function(email, mdp1, mdp2, db)
Vérification existence email et confirmation mdp
resolve(true) ou resolve("Confirmation mot de passe incorrecte" ou "...");

==> verifier_exist_user: function(id_user, db)
Vérifier l'existence de l'user à partir de son id
resolve(true); ou resolve(false);

==> generer_token: function(id, email)
return token

==> return_user_email: function(email, db)
vérification existence user à partir de son email, retourne tous les données de l'user (même son mdp)
resolve(resultat) ou resolve("Vérifier votre adresse email");
*/


module.exports = {
    inscrire: function(email, mdp1, mdp2, db){
        return new Promise(function(resolve){
            console.log(mdp1 , mdp2);
            if(email){
                db.query("SELECT email FROM user where email = ?", [email], function(err, resultats){
                    if(err) throw("Erreur: ressource");
                    if(resultats.length){
                        resolve("Adresse email déjà utilisé");
                    }
                    else{
                        if(mdp1 == mdp2){
                            resolve(true);
                        }
                        else{
                            resolve("Confirmation mot de passe incorrecte");
                        }
                    }
                })      
            }
            else{
                resolve("Aucun adresse email");
            }
        })
    },

    verifier_exist_user: function(id_user, db){
        return new Promise(function(resolve){
            if(id_user){
                db.query("SELECT * FROM user WHERE id = ?", [id_user] , function(err, resultat){
                    if(err) throw("Erreur: ressource");
                    if(resultat.length == 1){
                        resolve(resultat);
                    }
                    else{
                        resolve(false);
                    }
                })
            }
            else{
                resolve(false);
            }
        })
    },

    generer_token: function(id, email){
        const token = jwt.sign({
            id: id,
            mail: email,
        }, SECRET, { expiresIn: '7d' })
        return token;
    },

    return_user_email: function(email, db){
        return new Promise(function(resolve){
            db.query("SELECT * FROM user where email = ?", [email], function(err, resultat){
                if(err) throw("Erreur: ressource");
                if(resultat.length == 1){
                    resolve(resultat);
                }
                else{
                    resolve("Vérifier votre adresse email");
                }
            })
        })
    },

    uploadfile: function(chemin, fichier){
        if (!fichier) {
            console.log('No files were uploaded')
            return false;
        }
        let uploadPath, current_time = new Date().getTime(), nom_img, fichier_name = fichier.name.split('.');
        let ext = fichier_name[fichier_name.length-1];
        nom_img = fichier_name[0]+"_" + current_time+"."+ext;
        uploadPath = chemin + nom_img;
        // Use the mv() method to place the file somewhere on your server

        fichier.mv("public/"+uploadPath, function(err) {
            if (err) return err;
            console.log('===> File uploaded :' + uploadPath);
        });

        return uploadPath;
    },

    deleteFile: function (path) {
        if(path){
            try {
                fs.unlinkSync(path)
                console.log("==> FILE REMOVED : "+ path);
                //file removed
            } catch(err) {
                console.error(err)
            }
            return true;
        }
        else{
            return "Aucun chemin";
        }
    },

    mail_utiliser_autre_user: function(email, id, db){
        return new Promise(function(resolve){
            db.query("SELECT email FROM user where email = ? and id <> ?", [email, id], function(err, resultat){
                if(err) throw("Erreur: ressource");
                if(resultat.length == 1){
                    resolve("Adresse email déjà utilisé");
                }
                else{
                    resolve(false);
                }
            })
        })
    },

    read_file: function(chemin){
        return new Promise(function(resolve){
            fs.readFile(chemin, 'utf8', function (err,data) {
                if (err) {
                  throw(err);
                }
                resolve(data);
            });
        })

    }

}