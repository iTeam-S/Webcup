from flask import request, jsonify, Flask
from datetime import date, datetime
import json
from web3 import Web3
from solcx import compile_standard
import jwt

def encode_auth_token(_id):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=5),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return e

app = Flask(__name__)
app.config["DEBUG"] = True

with open('contrats.sol', 'r') as fichier:
    ficVal = fichier.read()

compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {
            "contrats.sol": {
                "content": ficVal
            }
        },
        "settings":
            {
                "outputSelection": {
                    "*": {
                        "*": [
                            "metadata", "evm.bytecode"
                            , "evm.bytecode.sourceMap"
                        ]
                    }
                }
            }
    }
)

# web3 = Web3(Web3.EthereumTesterProvider())
web3 = Web3(Web3.HTTPProvider('http://185.98.128.90:8545'))

web3.eth.defaultAccount = web3.eth.accounts[0]

bytecode = compiled_sol['contracts']['contrats.sol']['Webcup']['evm']['bytecode']['object']

abi = json.loads(compiled_sol['contracts']['contrats.sol']['Webcup']['metadata'])['output']['abi']
Vote = web3.eth.contract(abi=abi, bytecode=bytecode)

tx_hash = Vote.constructor().transact()

tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
default_account = tx_receipt.contractAddress

# default_account = '0x3F2EC437DdDcc487b42c64e0Ff7FD99DA02f46EA'
vote = web3.eth.contract(
    address=default_account,
    abi=abi
)



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
        id_ = str(datetime.timestamp(datetime.now())).replace(".", "")
        #fonction intégrer via solidity pour insérer les données
        vote.functions.insert_user(
            id_, nom, prenom, adresse, ville, mdp, email
        ).transact()
        result = {
            'id' : id_ ,
            'token' : encode_auth_token(id_)
        }, 
        return result, 200
        
    else :
        return "Il y a un élement manquant", 404


@app.route('/api/v1/all_user', methods = ["GET"])
def view_data():
    return str(vote.functions.all_user().call())

# @app.route('/')

app.run(host='0.0.0.0', port=8082)




