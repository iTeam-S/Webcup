from flask import request, jsonify, Flask
from datetime import date, datetime
app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/v1/register', methods = ["POST"])
def register() : 
    query_parameters = request.form
    nom = query_parameters.get('nom')
    prenom = query_parameters.get('prenom')
    ville = query_parameters.get('ville')
    adresse = query_parameters.get('adresse')
    email = query_parameters.get('email')
    mdp = query_parameters.get('mdp')

    if  (nom and prenom and ville  and adresse and email  and mdp) :       
        id = str(datetime.timestamp(datetime.now())).replace(".", "")
        #fonction intégrer via solidity pour insérer les données 
        return "<p>L'user est ajoutée au base de donnée. </p>", 200
        
    else :
        return "Il y a un élement manquant", 404

app.run( port=8082)




