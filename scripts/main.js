$(window).on("load", function () {
    //---------------declaring variables to prevent crashes------------------
    let emailFind = {};
    let userArr = [];
    $('#table').hide();
    // let isAdmin = false;

    //--------------------------generate img src string function for template string when renedring------------------
    let generateImg = () => {
        // return 'https://thispersondoesnotexist.com/image'
        let base = 'https://picsum.photos/400/?random=';
        let randomNum = Math.random().toString().slice(2, 4);
        return base + randomNum;
    }
    //----------------------checking localStorage for any userArr, emailFind data-----------
    if (localStorage.getItem('emailFind') || localStorage.getItem('userArr')) {
        emailFind = JSON.parse(localStorage.getItem('emailFind'));
        userArr = JSON.parse(localStorage.getItem('userArr'));
    };
    //-------------------------------User/Admin class-----------------------------------
    class User {
        constructor(fname, lname, email, pass, cpass, isAdmin) {
            this.fname = fname,
                this.lname = lname,
                this.email = email,
                this.pass = pass,
                this.cpass = cpass,
                this.isAdmin = isAdmin;
        }

    }
    let user = new User(emailFind.fname, emailFind.lname, emailFind.email, emailFind.pass, emailFind.cpass, emailFind.isAdmin);

    //--------------------------function: fetching 20 fake json users and storing them in [fakeData]-------------------------
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
    //--------------------checking length of userArr and adding fake data if needed------------------
    if (userArr.length < 16) {
        console.log('userArr.length < 16 so fetching fakeData');
        getFakeData()
            .then(fakeData => {
                fakeData.forEach(el => [
                    userArr.push(el)
                ]);
                renderData(userArr);
                //storing all this data is LS
                localStorage.setItem('userArr', JSON.stringify(userArr));
            });
    } else {
        renderData(userArr);
    }
    //-----------------------my welcome animation that Im probably going to abandon--------



    //----------------------adding functionality to buttons-------------------------------
    $('#becomeAdminBtn').click(e => {
        e.preventDefault();
        if (!user.isAdmin) {
            user.isAdmin = true;
            renderData(userArr);
            //save the addy status temporarily in emailFind and stoer it in LS
            emailFind.isAdmin = true;
            localStorage.setItem('emailFind', JSON.stringify(emailFind));
        }
    });
    $('#listViewBtn').click(e => {
        $('#table').show();
        $('#cards').hide();
    });
    $('#gridViewBtn').click(e => {
        $('#table').hide();
        $('#cards').show();
    });
    $('#clearArrayBtn').click(e => {
        localStorage.removeItem('userArr');
    });
    $('#aboutBtn').click(e => {
        e.preventDefault();
        alert('yes, this is just a simple alert button describing this page...');
    });
    $('#logoutBtn').click(e => {
        localStorage.removeItem('emailFind');
    });

    //---------------------EVERYTHING RENDER RELATED AND DOM UPDATE RELATED GOES HERE------------------------
    //jumbotron span name greeting-------------
    $('.jumbotron span').text(user.fname);

    //render table(list) and cards(grid)--------------------
    function renderData(data) {

        //removing the current, logged in user temporarily from the userArray i.e. data-------------
        let indexOfEmailFind = data.findIndex(el => el.email === emailFind.email);
        data.splice(indexOfEmailFind, 1);
        //#table head render------------------------------
        $('#table').append(`
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody id="tbody">
        `);
        for (let i = 0; i < 16; i++) {
            //append data to #table and render----------------
            $('#tbody').append(`
                <tr id="${data[i].email}">
                    <th scope="row">${i + 1}</th>
                    <td>${data[i].fname}</td>
                    <td>${data[i].email}</td>
                    <td><button type="button" class="btn btn-light mr-1"><i class="fas fa-edit fa-lg"></i></button><button type="button" class="btn btn-secondary"><i class="fas fa-trash fa-lg"></i></button></td>
                </tr>
            `);

            //append data to #cards and render----------------
            $('#cards').append(`
            <div class="col-md-6 col-lg-3 my-2 lmaoCards" id="${data[i].email}">
                <div class="card text-center">
                    <img src="${generateImg()}" class="card-img-top img-fluid">
                    <div class="card-block">
                        <h3 class="card-title">${data[i].fname}</h3>
                        <p>${data[i].email}</p>
                            <button type="button" class="btn btn-light mr-1 float-left m-1"><i class="fas fa-edit fa-lg"></i></button><button type="button" class="btn btn-secondary float-right m-1"><i class="fas fa-trash fa-lg"></i></button>
                    </div>
                </div>
            </div>`);
        }

        if (user.isAdmin) {
            $('.jumbotron').css({ 'background': 'gold' });
            $('.btn-light').removeClass('btn-light').addClass('btn-primary');
            $('.btn-secondary').removeClass('btn-light').addClass('btn-danger');
        }
    }
    //end of big render func---------------------------------
});
//fix the button thingy - when I dont hover over, become addy and then hover over = regular pointer. otherwise = alwasy not-allowed
//fix the render condition -         if (data.length > 16) { ---- I dont like this statement. Could crash later
//I dont like that I fetch data here - I could fetch the data in the login page - check length and then fetch data, then save it so I dont have to fetch it here...

//save the admin status
//add buttons to grid
//add btn functionality
//add about page
//animation?
//save fakeData to local storage

//paradoxically I could have used the last workflow from app.js and made an Admin class that extends the User class and store admin features in there but... I dont want to rework all this logic...