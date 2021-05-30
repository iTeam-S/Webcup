$("#submits").click(function(e){
    e.preventDefault();
    var response = grecaptcha.getResponse();
    $.ajax({
        type: "POST",
        url: "http://localhost:8082/api/v1/login",
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        data: JSON.stringify({
            email:  $("#emails").val(),
            pass:  $("#passs").val(),
        }),
        success: function (result) {
            console.log(result);
            $.session.set('token', result.token);
            $.session.set('id', result.id);
            $.session.set('nom', result.nom);
            $.session.set('prenom', result.prenom);
            var session = $.session.get('token'), id = $.session.get('id'), nom = $.session.get('nom'), prenom = $.session.get('prenom');
            $("#bouton_connecter").empty();
            $("#bouton_connecter").append(
                '<nav class="nav-menu d-none d-lg-block"><ul><li class="drop-down"><a href="">' + $.session.get('prenom') +'</a><ul><li><a href="#" onclick="deconnecter()">Se déconnecter</a></li></ul></li></ul></nav>'
            )       	
            $("#ModalLogin").modal('hide');
        },
        error: function (result, status, err) {
            console.error(result, status, err);
            $("#g-recaptcha-error").text(result);
        }
    });/*
    if(response.length == 1) {
        $("#g-recaptcha-error").text("Veuillez vérifier le captcha")
    }
    else{
        $.ajax({
            type: "POST",
            url: "https://api.iteam-s.mg/api/v1/login",
            contentType: 'application/json',
            headers: { 'Access-Control-Allow-Origin': '*' },
            data: JSON.stringify({
                email:  $("#emails").val(),
                pass:  $("#passs").val(),
            }),
            success: function (result) {
                $.session.set('token', result.token);
                $.session.set('id', result.id);

                var session = $.session.get('token');
                var id = $.session.get('id');
                console.log(session);
            },
            error: function (result, status, err) {
                console.error(result, status, err);
                $("#g-recaptcha-error").text(result);
            }
        });
    }
    */
});


function deconnecter(){
    sessionStorage.clear();  
    $("#connecter").empty();
    $("#bouton_connecter").empty();
    $("#bouton_connecter").append(
        '<a href="#" class="get-started-btn scrollto" data-toggle="modal" data-target="#ModalLogin">Se connecter</a><a href="#" class="scrollto seconn" data-toggle="modal" data-target="#ModalRegister">Créer un compte</a>'
    ) 
}

$("#creer").click(function(e){
    e.preventDefault();
    console.log("CREER");
    var response = grecaptcha.getResponse();
    var mdp1 = $("#pass").val(), mdp2 = $("#re_pass").val();
    if(mdp1 === mdp2){
        $.ajax({
            type: "POST",
            url: "http://localhost:8082/api/v1/register",
            contentType: 'application/json',
            headers: { 'Access-Control-Allow-Origin': '*' },
            data: JSON.stringify({
                email:  $("#emails").val(),
                pass:  mdp1,
                re_pass: mdp2,
                ville: $("#ville").val(),
                adresse: $("#adresse").val(),
                nom: $("#nom").val(),
                prenom: $("#prenom").val()
            }),
            success: function (result) {
                console.log(result);
                $.session.set('token', result.token);
                $.session.set('id', result.id);
                $.session.set('nom', result.nom);
                $.session.set('prenom', result.prenom);
                var session = $.session.get('token'), id = $.session.get('id'), nom = $.session.get('nom'), prenom = $.session.get('prenom');
                $("#bouton_connecter").empty();
                $("#bouton_connecter").append(
                    '<nav class="nav-menu d-none d-lg-block"><ul><li class="drop-down"><a href="">' + $.session.get('prenom') +'</a><ul><li><a href="#" onclick="deconnecter()">Se déconnecter</a></li></ul></li></ul></nav>'
                )       	
                $("#ModalLogin").modal('hide');
            },
            error: function (result, status, err) {
                console.error(result, status, err);
                var result = JSON.parse(result);
                $("#g-recaptcha-error-creer").text( JSON.stringify(result).responseText);
            }
        });
    }
    else{
        $("#g-recaptcha-error").text("Confirmation mot de passe incorrecte")
    }
});