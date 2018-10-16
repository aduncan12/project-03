let accessToken = 'BQDUm3ufloccRachhOYhhonSn0cKwR6Hlk7gcg3RK-EgbyxwU9LRlpj2twaAuyn82uZdovofs_4I1R9P3-6ICGt9zQLDHIq7j8FgW8ohzkwvZZwZsQ_3UmWG0Q365mwNSz6D2aIFjy13rExfsPftfdlO2coKEe4jH18yFQ&refresh_token=AQBLcpOMRg4yo5pN_QB8xREjFpHHhIbfQBOPTvHUY071nGnEYwZ_RMeFvVCJa9Z_lW4HsuecOVqENEBNM-_v3faQLivKBRCR3HCneg-hPL4uddMavVIlai6qjjZixvN4mUxvMA';
localStorage.length > 0 ? console.log(localStorage) : console.log('no local storage');

checkForLogin();

let newArtistsArray = [];
let newTracksArray = [];

function artistGet() {
    let arr = newArtistsArray[0]
    $('.resultsDiv').empty();
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

function addArtistSuccess (res) {
    console.log(res)
        // if (res._id === _id && res.user === user) {
        //     let addArtist = 
        //     `<li><a href="${res.artistUrl}">${res.name}</a></li>`
        //     $('#savedArtists').append(addArtist)
        // }      
}

function songGet() {
    let trackArr = newTracksArray[0];
    $('.resultsDiv').empty();
    console.log(trackArr)
    for (i=0; i < trackArr.length; i++) {
        let newTracks = trackArr[i].name
        let trackArtist = trackArr[i].artists[0].name
        let trackList = 
        `<button class="artistButton" data-toggle="modal" data-target="#artistModal" data-id="${newTracks}">${newTracks}</button>by 
        <p> ${trackArtist}</p>`
        $('.resultsDiv').append(trackList);
    }
    $('.artistButton').on('click', (e) => {
        e.preventDefault();
        let trackName = e.target.getAttribute('data-id');
        for (i=0; i < trackArr.length; i++) {
            if (trackName == trackArr[i].name) {
                let songModel = {
                    trackId: trackArr[i].id,
                    artist: trackArr[i].artists[0].name,
                    song: trackName,
                    album: trackArr[i].album.name,
                    popularity: trackArr[i].popularity,
                    trackUrl: trackArr[i].external_urls.spotify,
                    userId: user._id
                }
                let modalPopulate = 
                    `<a href="${songModel.trackUrl}">${trackName}</a>`
                $('#artistModalBody').empty()
                $('#artistModalHeader').empty()
                $('#artistModalBody').append(`<p>Info: ${songModel.artist}</br> ${songModel.album}</p>`)
                $('#artistModalHeader').append(modalPopulate)

                $('#songAdd').on('click', (e) => {
                    e.preventDefault();
                    
                    $.ajax({
                        method: 'POST',
                        url:'/api/addsong',
                        data: songModel,
                        // add success function that populates artist list
                        success: console.log(`${songModel.song} added to db`)
                    })
                })
                $('#songRemove').on('click', (e) => {
                    e.preventDefault();
                    
                    $.ajax({
                        method: 'DELETE',
                        url:'/api/songs',
                        data: songModel,
                        // add success function that populates artist list
                        success: console.log(`${songModel.song} removed from db`)
                    })
                })
            }
        }
    })    
}

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
        url: `https://api.spotify.com/v1/recommendations?seed_artists=${artistId}&max_popularity=60`,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }, 
        success: recommend = (res) => {
            newTracksArray = []
            newTracksArray.push(res.tracks)
        }
    }).then(songGet)
}

$('#artistSearchIcon').on('click', (e) => {
    e.preventDefault();
    $('.resultsDiv').empty();
    $('#songSearch').val('');
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
    $('#artistSearch').val('');
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
