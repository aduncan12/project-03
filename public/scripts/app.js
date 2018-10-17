let accessToken = 'BQB6pQ-t2FD8QmWOIgQFPfw9wwK944v3j9JFsPar6l32c8Xdyi6sz_DrqlXQPO6ZMpq7QaxyMEBQVq4fCrBqWkyiMSFFdDzXqCkAV8sHOfUuO7ox69gYP1--788nh5J35_ku8qf4m39BFeIvHx3paSJI4xAObDktgx44Aw&refresh_token=AQBW11ytCRT67mfJrF3YOwCVSTnqyZQ7zyKPpMJf6YzM2Ma9fpqgdjc0Opf5Xb8Iae-epwdT3R_OJqMfy9BWG3Q4PBkCU7A6Rq1b0XK8FZIMDrcVZJi9fiLkHKdKx0Wpe5gegw';

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
                        url: '/api/addartist',
                        data: artistModel,
                        success: addArtistSuccess
                        
                    })                    
                })
            } 
        }
    })
}

function addArtistSuccess (res) {
    console.log(res)
        $.ajax({
            method: 'GET',
            url: '/api/artist/'+res.data._id,
            success: populateArtistList,
            error: ('oops')
        })
}

function populateArtistList(res) {
    console.log(res)
    let addArtist = 
    `<li><a href="${res.artistUrl}">${res.name}</a></li>`
    $('#savedArtists').append(addArtist)
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
                        success: addSongSuccess,
                        error: ('error')
                    })
                })
            }
        }
    })    
}

function addSongSuccess (res) {
    console.log(res.data._id)
        $.ajax({
            method: 'GET',
            url: '/api/song/'+res.data._id,
            success: populateSongList,
            error: console.log('oops')
        })
}

function populateSongList(res) {
    console.log(res)
    let addSong = 
    `<li><a href="${res.trackUrl}">${res.song}</a> - ${res.artist}</li>`
    $('#savedSongs').append(addSong)
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
    $('.alert alert-success').fadeIn(500);

    localStorage.clear();
    localStorage.setItem('token', json.token)
    console.log(json.token)
    setTimeout(function () {
        window.location.pathname = '/main';}, 500);
}  

signUpError = (json) => {
    $('#formSignUp input').each(function () {
    if ( $(this).val().length === 0) {
        $('.alert alert-danger').fadeOut();
        $(this).siblings().fadeIn(1000);
        return;
    }
    if ( $(this).val().length !== 0) {
        $('.alert alert-danger').fadeOut();
        $(this).siblings().fadeOut(200);
        return;
    }
});
    if (json.status === 500){
        $('.alert alert-danger').fadeOut();
        $('#emailValidation').fadeIn().text('Please enter a valid email address.');
    }
    if (json.status === 409){
        $('.alert alert-danger').fadeOut();
        $('.alert alert-danger').fadeIn();
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
    $('.alert-success').fadeIn(500);

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
        }).done(function (res) {
            console.log(res)
            user = { username: res.username, _id: res._id }
            userId = res._id
            console.log("you can access variable user: " , user)
            $('#message').text(`Welcome, ${ res.username || res.newUser.username } `)
            $.ajax({
                method: 'GET',
                url: '/api/artists',
                success: loginPopulate = (res) => {
                    let artistsAll = res.artistsAll
                    for(i=0; i < artistsAll.length; i++) {
                        if (userId == artistsAll[i].user) {
                            // let userArtists = artistsAll[i].name
                            // console.log(userArtists) 
                            let addUserArtists = 
                            `<li><a href="${artistsAll[i].artistUrl}">${artistsAll[i].name}</a></li>`
                            $('#savedArtists').append(addUserArtists)
                        }
                    }
                }
            })
            $.ajax({
                method: 'GET',
                url: '/api/songs',
                success: function loginPopulateSong(res) {
                    let songsAll = res.songsAll
                    for(i=0; i < songsAll.length; i++) {
                        if (userId == songsAll[i].user) {
                            // let userArtists = artistsAll[i].name
                            // console.log(userArtists)
                            let addUserSongs = 
                            `<li><a href="${songsAll[i].trackUrl}">${songsAll[i].song}</a>- ${songsAll[i].artist}</li>`
                            $('#savedSongs').append(addUserSongs)
                        }
                    }
                }
            })

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
