$(window).on("load", function () {
    //---------------declaring variables to prevent crashes------------------
    let emailFind = {};
    let userArr = [];
    let view = 'grid';
    //--------------------------generate img src string function for template string when renedring-------------------------------------------
    let generateImg = () => {
        // return 'https://thispersondoesnotexist.com/image'
        let base = 'https://picsum.photos/200/?random=';
        let randomNum = Math.random().toString().slice(2, 4);
        return base + randomNum;
    }
    //--------------------------fetching 20 fake json users and storing them in a var-------------------------
    const getFakeData = async () => {
        let fakeData = [];
        for (let i = 0; i < 2; i++) {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
            data.forEach(el => {

                fakeData.push({ fname: el.name, email: el.email });
            });
        }
        return fakeData;
    }
    //----------------------checking localStorage for any userArr, emailFind data-----------
    if (localStorage.getItem('emailFind') || localStorage.getItem('userArr')) {
        emailFind = JSON.parse(localStorage.getItem('emailFind'));
        userArr = JSON.parse(localStorage.getItem('userArr'));
    };
    //----------------------removing the current, logged in user temporarily from the userArray------------------------------
    let indexOfEmailFind = userArr.findIndex(el => el.email === emailFind.email);
    userArr.splice(indexOfEmailFind, 1);
    //--------------------checking length of userArr and adding fake data if needed------------------
    if (userArr.length < 16) {
        getFakeData()
            .then(fakeData => {
                fakeData.forEach(el => [
                    userArr.push(el)
                ]);
                renderData(userArr);
            })
    } else {
        renderData(userArr);
    }
    //-----------------------my welcome animation that Im probably going to abandon--------




    //----------------------adding functionality to buttons-------------------------------
    $('#becomeAdminBtn').click(e => {
        e.preventDefault();
        console.log("you're about to become an admin. Proceed?")
    });
    $('#listViewBtn').click(e => {
        view == 'list'
        renderData(userArr);
    });
    $('#gridViewBtn').click(e => {
        view = 'grid'
        renderData(userArr);
    });
    $('#clearArrayBtn').click(e => {
        localStorage.removeItem('userArr');
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

    function renderData(data) {
        if (view == 'grid') {
            if (data.length > 16) {
                for (let i = 0; i < 16; i++) {
                    $('#cards').append(`
                    <div class="col-md-6 col-lg-3 my-2 lmaoCards" id="${data[i].email}">
                        <div class="card text-center">
                            <img src="${generateImg()}" class="card-img-top img-fluid">
                            <div class="card-block">
                                <h3 class="card-title">${data[i].fname}</h3>
                                <p>${data[i].email}</p>
                            </div>
                        </div>
                    </div>`);
                }
            }
        } else if (view == 'list') {
            if (data.length > 16) {
                $('#table').append(`
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody id="tbody">`);
                for (let i = 0; i < 16; i++) {
                    $('#tbody').append(`
                    <tr id="${data[i].email}">
                    <th scope="row">${i + 1}</th>
                    <td>${data[i].fname}</td>
                    <td>${data[i].email}</td>
                    <td>edit, del</td>
                  </tr>
                    `);
                }

            }
        }
    }

    //new idea = one function called render and inside it an if check (if view = grid then .... or if view = list then .... )



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
    //the template string only prints out the first name of my created users and the full name of the fake data.

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