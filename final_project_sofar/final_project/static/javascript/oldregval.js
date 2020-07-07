function checkPassword(str)
{
    // Tests against imput agains regular expressions (at least 6 chars, one caps, one lower & one digit)
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(str);
}

function checkForm(form)
{
    if(form.username.value == "") {
        alert("Username cannot be blank!");
        form.username.focus();
        return false;
    }
    re = /^\w+$/;
    if(!re.test(form.username.value)) {
        alert("Username must contain only letters, numbers and underscores!");
        form.username.focus();
        return false;
    }
    if(!checkPassword(form.password.value) {
        alert("You password must contain at least 6 characters, 1 digit, 1 uppercase and 1 lowercase letter.");
        form.password.focus();
        return false;
    }
    if(form.password.value != form.confirmation.value) {
        alert("Passwords do not match.");
    }

    else {
        alert("Error: Please check that you've entered and confirmed your password!");
        form.password.focus();
        return false;
    }
    return true;
}