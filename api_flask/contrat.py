import json
from web3 import Web3
from solcx import compile_standard


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

print(vote.functions.insert_user(
    default_account,
    'Aze', 'aa', 'aaa', 'aa', 'mdp', 'mail'
).transact())


az = vote.functions.verifLogin('mail', 'mdp').call()

print(az)
