// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract  Webcup{

    struct User {
        address id;
        string  nom;
        string  prenom;
        string  adresse;
        string  ville;
        string  mdp;
        string  email;
    }

    struct Transaction {
        User user;
        string type_;
        string icons;
        string date_creation;
    }

    User[] public users;

    function helloWorld() public pure returns (string memory){
        return "Hello World";
    }


    function insert_user(address id, string memory nom, string memory prenom, string memory adresse, 
            string memory  ville, string  memory mdp, string  memory  email ) public returns (bool)  {

        users.push(
            User(id, nom, prenom, adresse, ville, mdp, email)
        );

        return true;
    }

    
    function login(string memory email, string memory mdp) public returns (bool) {
        // for (uint i = 0; i < users.length; i++){
        //     if (StringUtils.equal(email, users[i].email) &&  mdp == users[i].mdp){
        //             return true;
        //     }
        // }
        return false;
    }

}