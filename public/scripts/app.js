let accessToken = 'BQBaiEvxwRSW8ZCzEMzL4x_An7ZxsSUDbmDMCzaDZCezYlbc8JHl4G9ox-0LuDgMICTVFyxCgpkE3tRmkNEJZxjzAFxCuTcxC7Jn3vxrbuePBzSo4C0bUv8_RWFVrjpjVlOwgk4a3sDC1EFp8OcBrtJEjF36ZM1nQsTr7A&refresh_token=AQB4eVCzbdzUdr0ufjJg4SAhXkn_q7MRoTUCLbHjbsZ_14prf5AT6dS-i9IM4cgPXiOQLQOHQE9z9zSRMJA091F23Jxf1krqWNUwh8tJG1qW8bV2FEMNkXRzpg0vCdZvKpLggg';
localStorage.length > 0 ? console.log(localStorage) : console.log('no local storage');

checkForLogin();

let newArtistsArray = [];
let newTracksArray = [];

function artistGet() {
    let arr = newArtistsArray[0]
    for (i=0; i < arr.length; i++) {
        let newArtists = arr[i].name
        let artistList = 
        `<button class="artistButton" data-toggle="modal" data-target="#artistModal" data-id="${newArtists}">${newArtists}</button>`
        $('.resultsDiv').append(artistList);
    }
    $('.artistButton').on('click', (e) => {
        e.preventDefault();
        let artistName = e.target.getAttribute('data-id');
        for (i=0; i < arr.length; i++) {
            if (artistName == arr[i].name) {
                let artistModel = {
                    artistId: arr[i].id,
                    name: artistName,
                    image: arr[i].images[0].url,
                    popularity: arr[i].popularity,
                    genres: arr[i].genres,
                    artistUrl: arr[i].external_urls.spotify,
                    userId: user._id
                }
                // console.log(artistModel)
                let modalPopulate = 
                    `<img src="${artistModel.image}" height="185" width="250">
                    <a href="${artistModel.artistUrl}">${artistModel.name}</a>`
                $('#artistModalBody').empty()
                $('#artistModalHeader').empty()
                $('#artistModalBody').append(`<p>Genre(s): ${artistModel.genres}</p>`)
                $('#artistModalHeader').append(modalPopulate)
                
                $('#artistAdd').on('click', (e) => {
                    e.preventDefault();

                    
                    $.ajax({
                        method: 'POST',
                        url:'/api/addartist',
                        data: artistModel,
                        // add success function that populates artist list
                        success: console.log(`${artistModel.name} added to db`)
                    })
                })
            } 
        }
    })
}

function songGet() {
    let songArr = newTracksArray[0];
    console.log(songArr)
    for (i=0; i < songArr.length; i++) {
        let newSongs = songArr[i].name
        console.log(newSongs)
        let songList = 
        `<button class="artistButton" data-toggle="modal" data-target="#artistModal" data-id="${newSongs}">${newSongs}</button>`
        $('.resultsDiv').append(songList);
    }}

// function addArtistSuccess () {
//     console.log()
//     let addArtist = 
//     `<li><a href="${artistModel.artistUrl}">${artistModel.name}</a></li>`
//     $('#savedArtists').append(addArtist)
// }

let artistSuccess = (res) => {
// create if statement to match artist variable with res.artists.items
    let artistId = res.artists.items[0].id;
    $('.resultsDiv').css('display', 'inline')
    // $('.resultsDiv').css('flex-direction', 'column')
    $('#search').css('display', 'block')
    // let matches = res.artists.items
    //     console.log(matches)
    //     let findMatch = () => {
    //         let match = 
    //         console.log(matches.map(findMatch));
    //     for (i=0; i < res.artists.items.length; i++) {
    //         let matches = res.artists.items[i].name
    //         console.log(matches)
    //     }
    
    //ajax request for related artists
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }, 
        success: recommend = (res) => {
            newArtistsArray = []
            newArtistsArray.push(res.artists)
        }
    }).then(artistGet)
}

let songSuccess = (res) => {
    let artistId = res.artists.items[0].id;
    $('.resultsDiv').css('display', 'inline')
    $('#search').css('display', 'block')
    
    // ajax request for recommended tracks
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/recommendations?seed_artists=${artistId}`,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }, 
        success: recommend = (res) => {
            newTracksArray.push(res.tracks)
        }
    }).then(songGet)
}

$('#artistSearchIcon').on('click', (e) => {
    e.preventDefault();
    $('.resultsDiv').empty();
    let artist = $('#artistSearch').val();
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/search/?q="${artist}"&type=artist`,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }, 
        success: artistSuccess,
        // error: console.log('error')
    });
})

$('#songSearchIcon').on('click', (e) => {
    e.preventDefault();
    $('.resultsDiv').empty();
    let artist = $('#songSearch').val();
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/search/?q="${artist}"&type=artist`,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }, 
        success: songSuccess,
        // error: console.log('error')
    });
})

$('#signUpSubmit').on('click', (e) => {
    e.preventDefault();
    let newUser = {
        username: $('#signUpName').val(),
        email: $('#signUpEmail').val(),
        password: $('#signUpPassword').val(),
    }
    
    $.ajax({
        method: 'POST',
        url:'/api/signup',
        data: newUser,
        success: signUpSuccess,
        error: signUpError
    });
});

signUpSuccess = (json) => {
    console.log(json);
    $('.modal-body .error-message').fadeOut(500);
    localStorage.clear();
    localStorage.setItem('token', json.token)
    console.log(json.token)
    setTimeout(function () {
        window.location.pathname = '/main';}, 500);
}  


signUpError = (json) => {
    $('#formSignUp input').each(function () {
    if ( $(this).val().length === 0) {
        $('#duplicateMessage').fadeOut();
        $(this).siblings().fadeIn(1000);
        return;
    }
    if ( $(this).val().length !== 0) {
        $('#duplicateMessage').fadeOut();
        $(this).siblings().fadeOut(200);
        return;
    }
});
    if (json.status === 500){
        $('#duplicateMessage').fadeOut();
        $('#emailValidation').fadeIn().text('Please enter a valid email address.');
    }
    if (json.status === 409){
        $('#duplicateMessage').fadeOut();
        $('#duplicateMessage').fadeIn();
    }
};

$('#formLogin').on('submit', function (e) {
    e.preventDefault();
    let user = {
        username:$('#username').val(),
        password: $('#password').val()
    }
    console.log(user)   

    $.ajax({
        method: 'POST',
        url: '/api/login',
        data: user,
        success: loginSuccess,
        error: loginError
    });
})

loginSuccess = (json) => {
    console.log(json)
    $('main').first('.error-message').fadeOut();
    localStorage.clear();
    localStorage.setItem('token', json.token)
    setTimeout(function () {
        window.location.pathname = '/main';});
}  

loginError = (json) => {
    console.log(json)
    $('main').first('.error-message').fadeOut(200);
    $('main').first('.error-message').fadeIn(500);
        $('main').css('display', 'flex');
}

function checkForLogin() {
    if(localStorage.length > 0){

    let jwt = localStorage.token
        $.ajax({
            method: "POST", 
            url: '/verify',  
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", 'Bearer ' + jwt);  
            }
        }).done(function (response) {
            console.log(response)
            user = { username: response.username, _id: response._id }
            console.log("you can access variable user: " , user)
            $('#message').text(`Welcome, ${ response.username || response.newUser.username } `)

        }).fail(function (e1, e2, e3) {
        console.log(e2);
        });
    } else {
        console.log('error: no local storage')
    }
}

$('#about').on('click', (e) => {
    e.preventDefault();
    setTimeout(function () {
        window.location.pathname = '/about';}, 500);})

$('#logOut').on('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    setTimeout(function () {
        window.location.pathname = '/';}, 500);
})

$('#profile').on('click', (e) => {
    e.preventDefault();
    setTimeout(function () {
        window.location.pathname = '/profile';}, 500);
})

$('#mainSearch').on('click', (e) => {
    e.preventDefault();
    setTimeout(function () {
        window.location.pathname = '/main';}, 500);
})
