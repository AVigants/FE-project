$(function () {
    //----------------------------dom queries-----------------------------------------------------
    const regFormInputs = $('#registerForm input');
    const passField = document.querySelector('#registerForm > div:nth-child(6) > input');
    const loginEmail = document.querySelector('#loginForm > div:nth-child(3) > input');
    const loginPass = document.querySelector('#loginForm > div:nth-child(4) > input');
    const forgotPass = $('#loginForm > div.clearfix > a');
    const passResetEmailField = document.querySelector('#passResetEmail');
    const registeredUserSpan = document.getElementById('registeredUserSpan');

    //-------------------variable declaration to prevent crashes-----------------------------------------------
    const patterns = {
        fname: /^[a-zA-Z]{2,25}$/,
        lname: /^[a-zA-Z]{2,25}$/,
        email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
        pass: /^[\w@-]{8,20}$/,
        cpass: /^[\w@-]{8,20}$/,
    };
    let rememberMe = false;
    let userArr = [];
    let userEmails = [];
    let userObj = {
        fname: '',
        lname: '',
        email: '',
        pass: '',
        cpass: ''
    }
    //---------------------------check local storage for existing data--------------------------------
    if (localStorage.getItem('userArr')) {
        userArr = JSON.parse(localStorage.getItem('userArr'));
        console.log('list of my created users:', userArr);
        userArr.forEach(el => {
            userEmails.push(el.email);
        });
    };
    if(localStorage.getItem('rememberMe')) {
        rememberMe = true;
        $('#rememberMe').attr('checked', true);
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
            
            if(rememberMe === true){
                localStorage.setItem('rememberMe', rememberMe);
            }   else if(localStorage.getItem('rememberMe')){
                localStorage.removeItem('rememberMe');
                console.log('rememberMe removed from local storage');
            }
            alert('successful login!!!!');
            window.location.href = 'main.html'
        } else {
            document.querySelector('#loginForm > div:nth-child(4) > input').classList.add('invalid');
        }
    });
    //---------------------------------forgot pass form slide toggle--------------------------------------------
    forgotPass.click(e => {
        $('#passResetForm').slideToggle();
    })
    //-------------------------------reset password submit event-------------------------------------
    $('#passResetForm').submit(e => {
        let emailFind = userArr.find(el => {
            return el.email === passResetEmailField.value
        });
        if (emailFind && emailFind.email === passResetEmailField.value) {
            passResetEmailField.classList.remove('invalid');
            $('#passResetEmailLabel').html(`<h5>We've sent you a link to your inbox (not really)</h5>`).css({ 'color': 'green' });
            $('#passResetBtn').hide();
            setTimeout(() => {
                $('#passResetForm').fadeOut();
            }, 2500);
        } else {
            passResetEmailField.classList.add('invalid');
        }

    });
    //---------------------------------remember me feature----------------------------------
        $('#rememberMe').click(e=>{
            rememberMe = !rememberMe;
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
                $('#innerDiv span').text(userObj.fname)
                user.renderThankYou(userObj);
            }
            renderThankYou(userObj) {
                $('#outerDiv').fadeIn();
                $('#close').click(e => {
                    $('#outerDiv').fadeOut(100);
                });
                //rainbow colored text
                $('innerDiv span').text(userObj.fname);
                for (let i = 0; i < 360; i++) {
                    setTimeout(() => {
                        registeredUserSpan.style.color = `hsl(${i}, 100%, 50%)`;
                    }, i * 10);
                };
                setTimeout(() => {
                    $('#outerDiv').fadeOut(100);
                }, 3600);
                //go back to login form
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
        //make an admin class that can delete users
        //TODO passwords cannot match
        //comments:
        //Im sure I dont have to use true/else for checkboxes since I can probably check for their state when loggin in. For some reaosn I couldnt do it with jquery but ironically I can set the default value to checked if there exists a value in local storage already...
    })