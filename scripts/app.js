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
    let rememberMe = {
        isRememberMeChecked: false,
        email: '',
        pass: '',
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

    //---------------------------check local storage for existing data--------------------------------
    if (localStorage.getItem('userArr')) {
        userArr = JSON.parse(localStorage.getItem('userArr'));
        userArr.forEach(el => {
            userEmails.push(el.email);
        });
    };
    if (localStorage.getItem('rememberMe')) {
        rememberMe = JSON.parse(localStorage.getItem('rememberMe'));
        //set fname and pass field to stored values 
        $('#rememberMe').attr('checked', true);
        $('#loginEmail').val(rememberMe.email);
        $('#loginPass').val(rememberMe.pass);

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
    //---------------function: get fake data if needed
    const getFakeData = async () => {
        let fakeData = [];
        for (let i = 0; i < 3; i++) {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
            data.forEach(el => {
                fakeData.push({ fname: el.name, email: el.email });
            });
        }
        return fakeData;
    }
    //login submit event-------------
    $('#loginForm').submit(e => {
        e.preventDefault();
        let emailFind = user.checkIfEmailAlreadyExists(loginEmail.value);
        if (emailFind && emailFind.pass === loginPass.value) {
            document.querySelector('#loginForm > div:nth-child(4) > input').classList.remove('invalid');

            if (rememberMe.isRememberMeChecked === true) {
                rememberMe.email = emailFind.email;
                rememberMe.pass = emailFind.pass;
                rememberMe = JSON.stringify(rememberMe);
                localStorage.setItem('rememberMe', rememberMe);
            } else if (rememberMe.isRememberMeChecked === false && localStorage.getItem('rememberMe')) {
                localStorage.removeItem('rememberMe');
                console.log('rememberMe removed from local storage');
            }
            if (userArr.length < 10) {
                console.log('userArr.length < 10 so fetching fakeData');
                getFakeData()
                    .then(fakeData => {
                        fakeData.forEach(el => {
                            userArr.push(el)
                        });
                        //remove thisUser from userArr 
                        let indexOfthisUser = userArr.findIndex(el => el.email === emailFind.email);
                        userArr.splice(indexOfthisUser, 1);
                        //storing all this data is LS
                        localStorage.setItem('userArr', JSON.stringify(userArr));
                        localStorage.setItem('thisUser', JSON.stringify(emailFind));
                        window.location.href = 'main.html';
                    });
            }   else{
                //remove thisUser from userArr 
                let indexOfthisUser = userArr.findIndex(el => el.email === emailFind.email);
                userArr.splice(indexOfthisUser, 1);
                //storing all this data is LS
                localStorage.setItem('userArr', JSON.stringify(userArr))
                localStorage.setItem('thisUser', JSON.stringify(emailFind));
                window.location.href = 'main.html';
            }
        }   else {
            document.querySelector('#loginForm > div:nth-child(4) > input').classList.add('invalid');
        }
        //setting this user in local storage to be used in main js and main html later
        
    });
//---------------------------------forgot pass form slide toggle--------------------------------------------
forgotPass.click(e => {
    $('#passResetForm').slideToggle();
})
//-------------------------------reset password submit event-------------------------------------
$('#passResetForm').submit(e => {
    let emailFind = user.checkIfEmailAlreadyExists(passResetEmailField.value);
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
//---------------------------------remember me checkbox----------------------------------
$('#rememberMe').click(e => {
    rememberMe.isRememberMeChecked = !rememberMe.isRememberMeChecked;
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
            //email check
            if (field.name === 'email' && user.checkIfEmailAlreadyExists(dataValue)) {
                console.log('email already exists');
                field.classList.add('invalid');
                field.classList.remove('valid');
                userObj[field.name] = '';
            }
            if (field.name === 'cpass' && $("[name='pass']").val() !== $("[name = 'cpass']").val()) {
                field.classList.add('invalid');
                field.classList.remove('valid');
                userObj[field.name] = '';
                console.log('passwords do not match');
            }

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
    checkIfEmailAlreadyExists(data) {
        let emailMatch = userArr.find(el => el.email === data);
        return emailMatch;
    }
    renderThankYou(userObj) {
        $('#outerDiv').fadeIn();
        $(document).keyup(function (e) {
            if (e.key === "Escape") {
                $('#outerDiv').fadeOut(100);
            }
        });

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
});

//-------------------------COMMENTS-------------------------------------

// I started using classes in this file, but I dont neccessarily need it. In the main I wrote code without using classes

// rememberMe actually could be tied to the thisUser object similar to isAdmin. It doesnt need to be a seperate L.S. key-value pair.

// jquery fade() isnt recognized as a function in main.js because of Bootsrap... all because I wanted to use Bootstraps dropbox in the navbar, but without their jquery I cant use fadein/fadeout. The loaded scripts are different in the html headers in both files.

//from a cyber safety POV this would never work simply because anyone can type 'main' in the address bar and access the content. This is just a front end project.

//I think if I made more seperate functions, I could have written less code - there are a lot of lines that repeat themeselves to accomplish the same task. When writing main.js I found my groove and IMO code is more readable than app.js when I first started.

//I could have downloaded the Json fake data file and stored it locally in a folder. But that sounded like work.

// main.js line 11 has "// return 'https://thispersondoesnotexist.com/image'". If I try to use it I get the same image unless I refresh the page. Shame. I decided to leave it in in case I might want to try and solve this issue in the futute. Luckily lorem picsum has a 'random' function. 

//the numbers in the list view in main do not change when I delete an item, they rearrange themselves in order on pagereload. I decided to leave it as is.

//its probably not a good idea to leave so many comments in a js file like this. Especially not in production mode.