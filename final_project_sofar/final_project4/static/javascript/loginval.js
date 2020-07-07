var replaceMessage = function(str)
{
    if($ ('#loginmessage')) {
        $ ( '#loginmessage').remove();
    }
    $( '#login_content').append( '<h4 id="loginmessage"><br><br><br>'+str+'</h4>' );
};



$(document).ready(function() {
    $('#loginbutt').click(function() {
        if ($('input[name="username"]').val() == '') {
            replaceMessage('You must enter a username.');
        }
        else if ($('input[name="password"]').val() == '') {
            replaceMessage('You must enter a password.');
        }
        else {
            var request = $.ajax({
                url: '/loginjs',
                data: $('#loginform').serialize(),
                type: 'POST',
            });
            request.done(function( msg ) {
                if (msg == 1) {
                    $('loginform').submit();
                }
                else {
                    console.log(msg);
                    replaceMessage( msg.replace(/['"]+/g, '') );
                }
            });
            request.fail(function( jqXHR, textStatus ) {
                alert( "Bad request: " + textStatus );
            });
//                success: function(response) {
//                    if (response == 1) {
//                        $('#loginform').submit();
//                    }
//                    else {
//                        // Gets this far
//                        replaceMessage( response.replace(/['"]+/g, '') );
//                    }
//                },
//                console.log('checkpoint');
//                error: function(error) {
//                    console.log('checkpoint');
//                    replaceMessage( error.replace(/['"]+/g, '') );
//                }

        }
    });
});



// Stops html 'fill in field' tooltip
document.addEventListener('invalid', (function () {
  return function (e) {
    e.preventDefault();
    $('.loginput').focus();
  };
})(), true);