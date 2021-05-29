$("#submits").click(function(e){
    e.preventDefault();
    var response = grecaptcha.getResponse();
        if(response.length == 0) {
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
                    console.log(result);
                    alert("nety");
                },
                error: function (xhr, status, err) {
                    console.error(xhr, status, err);
                    alert("tsy nety");
                }
            });
    }
});