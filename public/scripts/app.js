let accessToken = 'BQB500ieOibCk2LKHXymatrrgHmaG5CnnEn8bLH0rEk5IuKDjHZ27JI-wx3nY-tRIQRd1Ip05Ac_JPB6n8HpQLQynaE-wRmfyF7U4kMXR6en76LE5VzBFBexKhN-bt_zxPhqp3MrEZHGsy6HVz5zuJEJKwaOEp2Os78UKA&refresh_token=AQBH1F9ohaGKi_nKu3Zb7u-CQC4X4sRPy9GNg9fWa1GDBBtNLIc5vOfU3M48ZgHoD2Cn4YYojUSNKpXmbsjZXHksQNQMDeK3RMrb_3x6TIrEiz4uHVnGXpdtU6BgyicRf36Fzw';
localStorage.length > 0 ? console.log(localStorage) : console.log('no local storage');

checkForLogin();

let newArtistsArray = [];

function artistGet() {
    console.log(newArtistsArray[0])
    let arr = newArtistsArray[0]
    for (i=0; i < arr.length; i++) {
        let newArtists = arr[i].name
        let popularity = arr[i].popularity
        let genres = arr[i].genres
        let url = arr[i].external_urls.spotify
        let followers = arr[i].followers.total
        let artistList = 
        `<p><button id="artistButton" data-toggle="modal" data-target="#artistModal">${newArtists}</button> - <a href="${url}">Spotify</a></p>
        <p> ${genres}</p>`
        $('.resultsDiv').append(artistList);
    }
    $('#artistButton').on('click', (e) => {
        e.preventDefault();
        console.log('test')
        let newArtistArray = []
        for (i=0; i < arr.length; i++) {
            let newArtist = arr[i].name
            newArtistArray.push(newArtist)
            console.log(newArtistArray)
        }
    }) 
}

let artistSuccess = (res) => {
// create if statement to match artist variable with res.artists.items
    let artistId = res.artists.items[0].id;
    $('.resultsDiv').css('display', 'inline')
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
            newArtistsArray= []
            newArtistsArray.push(res.artists)
        }
        
    }).then(artistGet)

    // ajax request for recommended tracks
    // $.ajax({
    //     method: 'GET',
    //     url: `https://api.spotify.com/v1/recommendations?seed_artists=${artistId}`,
    //     headers: {
    //         'Authorization': 'Bearer ' + accessToken
    //     }, 
    //     success: recommend = (res) => {
    //         console.log(res.tracks)
    //         let i;
    //         for (i=0; i < res.tracks.length; i++) {
    //             let recommendations = res.tracks[i].artists[0].name
    //             let artistList = 
    //             `<li>
    //             <p> ${recommendations} </p>
    //             </li>`

    //             $('.resultsDiv').append(artistList);
    //         }    
    //     }
    // })
}



$('.fas').on('click', (e) => {
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
                $('#message').text(`Welcome, ${ response.username || response.result.username } `)

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

   
