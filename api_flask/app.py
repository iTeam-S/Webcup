from flask import request, jsonify, Flask
from datetime import date, datetime, timedelta
import json
from web3 import Web3
from solcx import compile_standard
import jwt
import hashlib

def encode_auth_token(user_id):
    """
    Generates the Auth Token
    :return: string
    """
    payload = {
        'exp': datetime.utcnow() + timedelta(days=7),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        "MOT_SECRET_DECRYPTE",
        algorithm='HS256'
    )
    
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

def verifToken(token):
    return jwt.decode(token, options={"verify_signature": False})


@app.route('/api/v1/login', methods = ["POST"])
def login():
    query_parameters = request.form
    email = str(query_parameters.get('email'))
    passwd = hashlib.sha224(str(query_parameters.get('pass')).encode()).hexdigest()
    res = vote.functions.verifLogin(email, passwd).call()
    result = { "data" : res, 
        "id" : res[0],
        "token" : encode_auth_token(res[0]) if res[0] != '' else ''
    }, 200 if res[0] != '' else 403
    return result


@app.route('/api/v1/register', methods = ["POST"])
def register() : 
    query_parameters = request.form
    nom = query_parameters.get('nom')
    prenom = query_parameters.get('prenom')
    ville = query_parameters.get('ville')
    adresse = query_parameters.get('adresse')
    email = query_parameters.get('email')
    mdp = hashlib.sha224(str(query_parameters.get('mdp')).encode()).hexdigest()

    if  (nom and prenom and ville  and adresse and email and mdp):
        recup_user = vote.functions.all_user().call()
        for usr in recup_user:
            if usr[6] == email:
                return "Mail déjà existant", 403
        id_ = str(datetime.timestamp(datetime.now())).replace(".", "")
        vote.functions.insert_user(
            id_, nom, prenom, adresse, ville, mdp, email
        ).transact()
        result = {
            "data" : vote.functions.get_user(id_).call(),
            "id" : id_ ,
            "token" : encode_auth_token(id_)
        }
        return result, 200
        
    else :
        return "Il y a un élement manquant", 403


@app.route('/api/v1/all_user', methods = ["GET"])
def view_data():
    query_parameters = request.form
    token = query_parameters.get('token')
    id_ = query_parameters.get('id')
    if verifToken(token).get('sub') != id_:
        return {"status" : "Erreur Token"}, 403
    return vote.functions.all_user().call()


@app.route('/api/v1/save_transaction', methods = ["POST"])
def add_transaction():
    query_parameters = request.form
    date_creation = str(datetime.now())
    token = str(query_parameters.get('token'))
    icons = str(query_parameters.get('icons'))
    type_ = str(query_parameters.get('type'))
    id_ = str(query_parameters.get('id'))

    if verifToken(token).get('sub') != id_:
        return {"status" : "Erreur Token"}, 403

    vote.functions.save_transaction(
        id_, type_, icons, date_creation
    ).transact()
    
    return 'ok', 200


@app.route('/api/v1/transactions', methods = ["POST"])
def view_transactions():
    query_parameters = request.form
    token = query_parameters.get('token')
    id_ = str(query_parameters.get('id'))
    if verifToken(token).get('sub') != id_:
        return {"status" : "Erreur Token"}, 403
    query_parameters = request.form
    return {"data": vote.functions.all_transactions().call()}



app.run(host='0.0.0.0', port=8082)




