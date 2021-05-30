$("#submits").click(function(e){
    e.preventDefault();
    $("#submits").html('<img src="/assets/img/infinity.gif" style="width:10%">') 
    var response = grecaptcha.getResponse();
        if(response.length == 0) {
            $("#g-recaptcha-error").text("Veuillez vérifier le captcha");
            $("#submits").html('Se connecter')
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
                    console.log(result);
                    alert("nety");
                    $("#submits").html('Se connecter')
                },
                error: function (xhr, status, err) {
                    console.error(xhr, status, err);
                    alert("tsy nety");
                    $("#submits").html('Se connecter')
                }
            });
    }
});