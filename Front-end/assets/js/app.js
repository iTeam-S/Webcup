$("#submits").click(function(e){
    e.preventDefault();
    $("#submits").html('<img src="/assets/img/infinity.gif" style="width:10%">') 
    var response = grecaptcha.getResponse();
    if(response.length == 1) {
        $("#g-recaptcha-error").text("Veuillez vérifier le captcha");
        $("#submits").html('Se connecter')
    }
    else{
        console.log($("#emails").val(), $("#passs").val());
        $.ajax({
            type: "POST",
            url: "https://api.iteam-s.mg/api/v1/login",           
            data:{
                email:  $("#emails").val(),
                pass:  $("#passs").val(),
            },
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
                );
                 $("#submits").html('Se connecter');       	
                $("#ModalLogin").modal('hide');
            },
            error: function (result, status, err) {
                console.error(result, status, err);
                $("#g-recaptcha-error").text("Email ou Mot de passe incorrect");
                $("#submits").html('Se connecter')
            }
        });
    }
});


$("#creer").click(function(e){
    e.preventDefault();
    $("#submits").html('<img src="/assets/img/infinity.gif" style="width:10%">');
    var response = grecaptcha.getResponse();
    var mdp1 = $("#pass").val(), mdp2 = $("#re_pass").val();
    if(mdp1 === mdp2){
        if(response.length == 0) {
            $("#g-recaptcha-error").text("Veuillez vérifier le captcha");
            $("#submits").html('Se connecter')
        }
        else{
            $.ajax({
                type: "POST",
                url: "https://api.iteam-s.mg/api/v1/login", 
                data:{
                    email: $('email').val(,
                    pass:  mdp1,
                    ville: $("#ville").val(),
                    adresse: $("#adresse").val(),
                    nom: $("#nom").val(),
                    prenom: $("#prenom").val()
                },
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
                    );
                    $("#submits").html('Se connecter');         
                    $("#ModalLogin").modal('hide');
                },
                error: function (result, status, err) {
                    console.error(result, status, err);
                     $("#submits").html('Se connecter');  
                    $("#g-recaptcha-error").text(result);
                }
            }); 
        }
    }
    else{
        $("#g-recaptcha-error").text("Confirmation mot de passe incorrecte")
    }
});

function deconnecter(){
    sessionStorage.clear();  
    $("#connecter").empty();
    $("#bouton_connecter").empty();
    $("#bouton_connecter").append(
        '<a href="#" class="get-started-btn scrollto" data-toggle="modal" data-target="#ModalLogin">Se connecter</a><a href="#" class="scrollto seconn" data-toggle="modal" data-target="#ModalRegister">Créer un compte</a>'
    ) 

