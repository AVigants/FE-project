$(window).on("load", function () {
    //---------------declaring variables to prevent crashes------------------
    let thisUser = {};
    let userArr = [];
    $('#table').hide();
    $("#editForm").hide();
    id = '';

    //--------------------------generate img src string function for template string when renedring------------------
    let generateImg = () => {
        // return 'https://thispersondoesnotexist.com/image'
        let base = 'https://picsum.photos/400/?random=';
        let randomNum = Math.random().toString().slice(2, 4);
        return base + randomNum;
    }
    //----------------------checking localStorage for any userArr, thisUser data-----------
    if (localStorage.getItem('thisUser') || localStorage.getItem('userArr')) {
        thisUser = JSON.parse(localStorage.getItem('thisUser'));
        userArr = JSON.parse(localStorage.getItem('userArr'));
        renderData(userArr);
    };

    //-----------------------my welcome animation that Im probably going to abandon--------



    //----------------------adding functionality to buttons-------------------------------
    $('#becomeAdminBtn').click(e => {
        e.preventDefault();
        if (!thisUser.isAdmin) {
            thisUser.isAdmin = true;
            renderAdmin();

            localStorage.setItem('thisUser', JSON.stringify(thisUser));
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
        $('#table').hide();
        $('#cards').hide();
    });
    $('#aboutBtn').click(e => {
        e.preventDefault();
        alert('yes, this is just a simple alert button... For more comments, go to app.js comment section');
    });
    $('#logoutBtn').click(e => {
        //check if we clicked the clear LS button. If we havent, then the LS wont be empty, which means we should add back in thisUser to the array
        if (localStorage.getItem('userArr')) {
            userArr.push(thisUser);
            localStorage.setItem('userArr', JSON.stringify(userArr));
        }   else if(!localStorage.getItem('userArr') && localStorage.getItem('rememberMe')){
            localStorage.removeItem('rememberMe');
        }
        localStorage.removeItem('thisUser');
        window.location.href = 'index.html'
    });
    function adminMode() {
        if (thisUser.isAdmin) {
            $('.editBtn').click(e => {
                $("#editForm").toggle();
                scrollTo(0, 0);
                id = Number(e.target.name.slice(2, 4));
                $('#editField').val(userArr[id].fname);
            });
            $('#editForm').submit(e => {
                e.preventDefault();
                userArr[id].fname = $('#editField').val();
                $(`#ID${id} > td`)[0].textContent = userArr[id].fname;
                $(`#cards > div[name='ID${id}'] > div > div > h3`)[0].textContent = userArr[id].fname;

                localStorage.setItem('userArr', JSON.stringify(userArr));

                $('#editForm').hide();
            });
            $('.delBtn').click(e => {
                id = Number(e.target.name.slice(2, 4));
                userArr.splice(id, 1);

                $(`#ID${id}`).hide();
                $(`.lmaoCards[name='ID${id}']`).hide();
                localStorage.setItem('userArr', JSON.stringify(userArr));
            });
        }
    }

    //---------------------EVERYTHING RENDER RELATED AND DOM UPDATE RELATED GOES HERE------------------------
    //jumbotron span name greeting-------------
    $('.jumbotron span').text(thisUser.fname);

    //check length of userArr and if its  >16, only render 16 items. Else render everything
    function renderData(data) {
        if (data.length >= 16) {
            let adjustedUserArr = [];
            for (let i = 0; i < 16; i++) {
                adjustedUserArr.push(data[i])
            };
            renderAll(adjustedUserArr);
            renderAdmin();
        } else {
            renderAll(data);
            renderAdmin();
        }
    }

    function renderAll(data) {
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
        data.forEach((el, i) => {
            //append data to #table and render----------------
            $('#tbody').append(`
                <tr id="ID${i}">
                    <th scope="row">${i + 1}</th>
                    <td>${el.fname}</td>
                    <td>${el.email}</td>
                    <td>
                        <button type="button" class="btn btn-light fas fa-edit fa-lg editBtn" name="ID${i}"></button>
                        <button type="button" class="btn btn-light fas fa-trash fa-lg delBtn" name="ID${i}"></button>
                    </td>
                </tr>
            `);

            //append data to #cards and render----------------
            $('#cards').append(`
            <div class="col-md-6 col-lg-3 my-2 lmaoCards" name="ID${i}">
                <div class="card text-center">
                    <img src="${generateImg()}" class="card-img-top img-fluid">
                    <div class="card-block">
                        <h3 class="card-title">${el.fname}</h3>
                        <p>${el.email}</p>
                            <button type="button" class="btn btn-light float-left fas fa-edit fa-lg m-1 editBtn" name="ID${i}"></button>
                            <button type="button" class="btn btn-light float-right fas fa-trash fa-lg m-1 delBtn" name="ID${i}"></button>
                    </div>
                </div>
            </div>`);
        });
    }
    // admin features-----------------------------------------
    function renderAdmin(){
        if (thisUser.isAdmin) {
            $('.jumbotron').css({ 'background': 'gold' });
            $('.editBtn').removeClass('btn-light').addClass('btn-primary');
            $('.delBtn').removeClass('btn-light').addClass('btn-danger');
            $('#becomeAdminBtn').hide();
            //this is to fix the not-allowed propertty - it only fixes itself on page refresh otherwise.
            $('.editBtn').css('cursor', 'pointer');
            $('.delBtn').css('cursor', 'pointer');
            adminMode();
        } else {
            $('.editBtn').css('cursor', 'not-allowed');
            $('.delBtn').css('cursor', 'not-allowed');
        }
    }
    //end of big render func---------------------------------
});