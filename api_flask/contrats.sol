// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;



contract  Webcup{

    struct User {
        string  id;
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
    Transaction[] public transaction;


    function compareString(string memory s1, string memory s2) public pure returns(bool){
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }


    function all_user() public view returns (User[] memory){
        return users;
    }


    function get_user() public view returns (User memory){
        for (uint i; i<users.length; i++){
            if ( compareString(users[i].email, email) ){
                return users[i];
            }
        }
        return User('', '', '', '', '', '', '');
    }


    function insert_user(string memory id, string memory nom, string memory prenom, string memory adresse, 
            string memory  ville, string  memory mdp, string  memory  email ) public returns (bool)  {

        users.push(
            User(id, nom, prenom, adresse, ville, mdp, email)
        );

        return true;
    }


    function verifLogin(string memory email, string memory mdp) public view returns(User memory){
        for (uint i; i<users.length; i++){
            if (compareString(users[i].email, email) && compareString(users[i].mdp, mdp)){
                return users[i];
            }
        }
        return User('', '', '', '', '', '', '');
    }


    function save_transaction(string email, string type_, string icons, string date_creation){
        User usr = get_user(email);
        transaction.push(
            usr, 
            type_, 
            icons, 
            date_creation
        );
    }


    function all_transactions() {
        return transaction;
    }
}

