$(function () {
    //----------------------------dom queries-----------------------------------------------------
    const regFormInputs = $('#registerForm input');
    const passField = document.querySelector('#registerForm > div:nth-child(6) > input');
    const loginEmail = document.querySelector('#loginForm > div:nth-child(3) > input');
    const loginPass = document.querySelector('#loginForm > div:nth-child(4) > input');
    const forgotPass = $('#loginForm > div.clearfix > a');
    const passResetEmailField = document.querySelector('#passResetEmail');
    //-------------------variable declaration to prevent crashes-----------------------------------------------
    const patterns = {
        fname: /^[a-zA-Z]{2,25}$/,
        lname: /^[a-zA-Z]{2,25}$/,
        email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
        pass: /^[\w@-]{8,20}$/,
        cpass: /^[\w@-]{8,20}$/,
    };
    let userArr = [];
    let userEmails = [];
    let userObj = {
        fname: '',
        lname: '',
        email: '',
        pass: '',
        cpass: ''
    }
    if (localStorage.getItem('userArr')) {
        userArr = JSON.parse(localStorage.getItem('userArr'));
        console.log(userArr, userArr.length);
        userArr.forEach(el => {
            userEmails.push(el.email);
        })
    }
    //--------------------------------show and hide login.register forms with Jquery -----------------------
    $('#registerHref').click(e => {
        $('#loginFormWrapper').fadeOut(200);
        setTimeout(() => {
            $('#registerFormWrapper').fadeIn(200);
        }, 200);
    });
    $('#loginHref').click(e => {
        $('#registerFormWrapper').fadeOut(200);
        setTimeout(() => {
            $('#loginFormWrapper').fadeIn(200);
        }, 200);
    });
    //------------------------register form data validation on keyup event---------------------------------
    $('#registerForm input').keyup(e => {
        user.validateOnKeyup(e.target.value.trim(), e.target);
    });
    //-----------------------------register form submit event -----------------------------------------
    $('#registerForm').submit(e => {
        e.preventDefault();
        if (userObj.fname && userObj.lname && userObj.email && userObj.pass && userObj.cpass) {
            user.registerUser(userObj);

        } else {
            console.log('fail');
        }

    });
    //--------------------------login form submit event-------------------------------------------------
    $('#loginForm').submit(e => {
        e.preventDefault();
        let emailFind = userArr.find(el => {
            return el.email === loginEmail.value
        });
        if (emailFind && emailFind.pass === loginPass.value) {
            document.querySelector('#loginForm > div:nth-child(4) > input').classList.remove('invalid');
            //make a new user with the emailFind obj that we can layter use in the main.
            alert('successful login!!!!');
            window.location.href = 'main.html'
        } else {
            document.querySelector('#loginForm > div:nth-child(4) > input').classList.add('invalid');
            console.log('incorrent email/password');
        }
    });
    //---------------------------------forgot pass form slide toggle--------------------------------------------
    forgotPass.click(e=> {
        $('#passResetForm').slideToggle();
    })
    //-------------------------------reset password submit event-------------------------------------
    $('#passResetForm').submit(e=> {
        let emailFind = userArr.find(el => {
            return el.email === passResetEmailField.value
        });
        if(emailFind && emailFind.email === passResetEmailField.value){
            $('#passResetEmailLabel').html(`<p>We've sent you a link to your inbox (not really)</p>`).css({'color': 'green'});
            $('#passResetBtn').hide();
            setTimeout(() => {
                $('#passResetForm').fadeOut();
            }, 1500);
        }   else{
            // $('#passResetEmailLabel').('Email not found')
        }
    });
    //------------------------------------User class--------------------------------------------
    class User {
        constructor(fname, lname, email, pass, cpass) {
            this.fname = fname,
                this.lname = lname,
                this.email = email,
                this.pass = pass,
                this.cpass = cpass
        }
        validateOnKeyup(dataValue, field) {
            if (patterns[field.name].test(dataValue)) {
                field.classList.add('valid')
                field.classList.remove('invalid');
                userObj[field.name] = dataValue;

            } else {
                field.classList.add('invalid');
                field.classList.remove('valid');
                userObj[field.name] = '';
            }
        }
        registerUser(userObj) {
            userArr.push(userObj);
            userEmails.push(userObj.email);
            userArr = JSON.stringify(userArr);
            localStorage.setItem('userArr', userArr);
            userArr = JSON.parse(userArr);
            alert('All set! You can now Log in!');
            $('#registerFormWrapper').fadeOut(200);
            setTimeout(() => {
                $('#loginFormWrapper').fadeIn(200);
            }, 200);
        }

    }
    let user = new User('firstName', 'lastName', 'email@email.com', 'password', 'password');
    //---------------------------------laundry list-------------------------------------------------
    //TODO bugfix: if you reverse fill out the form - cpass then pass then theres no cpass error that passwords dont match or it bypasses it
    //TODO add remember me feature
    //TODO emails cannot repeat when registering a new acc
    //TODO add a form field that asks for your email for pass reseting
    //make an admin class that can delete users
    //TODO passwords cannot match
    //TODO display a black overlay screen with a 'thank you for registering, fname!' or smth like that (basically an ad). Add a close button and a timeout with 3 seconds that closes it automatically. Maybe add an animation of a countdown timer


})