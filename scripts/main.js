$(window).on("load", function () {
    //---------------declaring variables to prevent crashes------------------
    let emailFind = {};
    let userArr = [];
    let fakeJsonData = [];
    let view = 'grid';
    const makeProperName = (str) => {
        if (typeof str !== 'string') {
            return '';
        } else {
            str = str.toLowerCase();
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    }
    let generateFace = () => {
        return 'https://thispersondoesnotexist.com/image'
    }
    //--------------------------fetching 20 fake json users and storing them in a var-------------------------
    let makeFakeJsonDataArray = (data) => {
        data.forEach(el=>{
            fakeJsonData.push(el);
        });
    };
    for(let i = 0; i<2; i++){
        fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data=>makeFakeJsonDataArray(data));
    };
    //----------------------checking localStorage for any data saved from app.js-----------
    if (localStorage.getItem('emailFind') || localStorage.getItem('userArr')) {
        emailFind = JSON.parse(localStorage.getItem('emailFind'));
        userArr = JSON.parse(localStorage.getItem('userArr'));
    };
    //--------------------checking length of userArr and adding fake data if needed------------------
    if(userArr.length <16){
        let j = 16-userArr.length;
        for(let i = 0; i<j; i++){
            userArr.push(fakeJsonData[i]);
        }
    }

    //-----------------------my welcome animation that Im probably going to abandon--------




    //----------------------adding functionality to buttons-------------------------------
    $('#becomeAdminBtn').click(e => {
        e.preventDefault();
        console.log("you're about to become an admin. Proceed?")
    });
    $('#listViewBtn').click(e => {
        renderList();
    });
    $('#gridViewBtn').click(e => {
        renderGrid();
    });
    $('#clearArrayBtn').click(e => {
        console.log('youre about to clear all the registered users from local storage. Proceed?')
        // localStorage.removeItem('userArr');
    });
    $('#aboutBtn').click(e => {
        e.preventDefault();
        console.log('about me page')
    });
    $('#logoutBtn').click(e => {
        localStorage.removeItem('emailFind');
    });
    //---------------------updating the dom with values from LS------------------------
    $('.jumbotron span').text(emailFind.fname);

   

    



    //render the first 16 items
    let renderGrid = () => {
        if(view == 'list'){
            view = 'grid';
        }
    }
    let renderList = () => {
        if(view == 'grid'){
            view = 'list';
        }
    }

    // userArr.forEach(el => {
    //     $('.row').append(`
    //     <div class="col-md-6 col-lg-3 my-2 lmaoCards" id="${el.email}">
    //         <div class="card text-center">
    //             <img src="${generateFace()}" class="card-img-top img-fluid">
    //             <div class="card-block">
    //                 <h3 class="card-title">${el.fname} ${el.lname}</h3>
    //                 <p>${el.email}</p>
    //             </div>
    //         </div>
    //     </div>`);
    // });




    //-------------adding event listener to all cards, 2 buttons: edit and del-----------------------------
    // $('.lmaoCards').hover(e=> {
    //     $('.lmaoCards').css({'opacity': '0.5'});
    //     console.log('.lmaoCards')
    // });
    //idk add 2 blurry buttons, man. Then make them functional after pressing become a member.

    // <i class="fas fa-edit fa-lg"></i>
    // <i class="fas fa-trash fa-lg"></i>

    //also when I refresh the page and the remember me btn is pressed, it stays pressed. Maybe make it so it doesnt remember me when I click it asap?















    //--------------------laundry list----------------------------------------
    //TODO when loggin out - remove emailFind from local storage
    //add a clearAll to settings dropdown to remove all data from localstorage
    // in index html add a class to the thanks you ad : tetxt-lowercase and text-capitalize for the name

    //-------------comments----------------------------
    //I probably didnt need to make a seperate object for 'remember me', I could have recycled 'emailFind' and called it a day
    //add the animation to the app js file after loggin in, then the page gets redirected to main.html. that way when I refresh the main html page, it wont do the animation thingy every time...
    //generate our own names, emails in japanese lol
    //     ##randomArray ##arrayPush ##push ##forLoopScope
    // const randomArray = [];
    // for(let i = 0; i<67; i++){
    //     randomArray.push(Math.random().toString().slice(2,5))
    // };
    // console.log(randomArray);
    //yes I could make it so the next 16 items get rendered when I press a 'next page' btn but thats too much work for some random school assignment cmon now
});