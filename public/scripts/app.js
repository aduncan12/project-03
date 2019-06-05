localStorage.length > 0 ? console.log(localStorage) : console.log('no local storage');

// spotifyRedirect = ('http://localhost:8888/callback')


checkForLogin();

let newTracksArray = [];
let newList = {};

$('#songSearchIcon').on('click', (e) => {
    e.preventDefault();
    $('.resultsDiv').empty();
    // $('#artistSearch').val('');

    let urlHash = window.location.hash;
    tokensArray = urlHash.split('=');
    tokensArray.shift()

    let artist = $('#songSearch').val();
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/search/?q="${artist}"&type=artist`,
        headers: {
            'Authorization': 'Bearer ' + tokensArray[0]
        }, 
        success: songSuccess,
        // error: console.log('error')
    });
})

let songSuccess = (res) => {
    let artistId = res.artists.items[0].id;
    $('.resultsDiv').css('display', 'inline')
    $('#search').css('display', 'block')
    
    // ajax request for recommended tracks
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/recommendations?seed_artists=${artistId}&max_popularity=60`,
        headers: {
            'Authorization': 'Bearer ' + tokensArray[0]
        }, 
        success: recommend = (res) => {
            newTracksArray = []
            newTracksArray.push(res.tracks)
        }
    }).then(songGet)
}

function songGet() {
    let trackArr = newTracksArray[0];
    console.log(trackArr)

    $('.resultsDiv').empty();
    for (i=0; i < trackArr.length; i++) {
        let newTracks = trackArr[i].name
        let trackArtist = trackArr[i].artists[0].name
        let trackList = 
        `<button class="artistButton" data-toggle="modal" data-target="#songModal" data-id="${newTracks}">${newTracks}</button>by 
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
                    artistPage: trackArr[i].artists[0].external_urls.spotify,
                    song: trackName,
                    album: trackArr[i].album.name,
                    albumImg: trackArr[i].album.images[0].url,
                    popularity: trackArr[i].popularity,
                    trackUrl: trackArr[i].external_urls.spotify,
                    userId: user._id || res.newUser._id
                }
                console.log(songModel)
                let modalPopulate = 
                    `<img src="${songModel.albumImg}" height="200" width="200">
                    <p>Artist: ${songModel.artist}</br> Album: ${songModel.album}</br>
                    <a href="${songModel.artistPage}">${songModel.artist} on Spotify</a></p>`
                    
                $('#songModalBody').empty()
                $('#songModalHeader').empty()
                $('#songModalBody').append(`<a href="${songModel.trackUrl}">${trackName} on Spotify</a>`)
                $('#songModalHeader').append(modalPopulate)

                $('#songAdd').on('click', (e) => {
                    e.preventDefault();
                    
                    $.ajax({
                        method: 'POST',
                        url:'/api/addsong',
                        data: songModel,
                        success: addSongSuccess,
                        error: console.log('error')
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

    let songId = res._id
    let songName = res.song
    let spotifyId = res.trackId
    let songUser = res.user

    let addSong = 
    `<li class="savedSong"><button type="button" class="xClose">x</button><a href="${res.trackUrl}">${res.song}</a> - ${res.artist}</li>`
    $('#savedSongs').append(addSong)

    $('.xClose').on('click', (e) => {
        console.log(songName)
    })
}

let savePlaylist = []

$('#savePlaylist').on('click', (e) => {
    e.preventDefault();

    let newPlaylistName = $('#playlistName').val();
    let newPlaylist = $('#savedSongs').children();
    console.log(newPlaylist)

    for (i=0; i < newPlaylist.length; i++) {
        let playlistModel = {
            title: newPlaylistName,
            song: newPlaylist[i].innerText,
            user: user._id
        }
        // savePlaylist += playlistModel
        savePlaylist.push(playlistModel)
    }
    console.log(savePlaylist)

    $.ajax({
        method: 'POST',
        url: '/api/addplaylist',
        data: JSON.stringify(savePlaylist),
        success: console.log(savePlaylist),
        })
})

function addPlaylistSuccess(res) {
    console.log(res)
    $.ajax({
        method: 'GET',
        url: '/api/playlist/'+res.data._id,
        success: populatePlaylistList,
        error: console.log('oops')
    })
}

function populatePlaylistList(res) {
    console.log(res)
    let addPlaylist = 
    `<li>${res.title}</li>`
    $('#playlists').append(addPlaylist)
}


$('#signUpSubmit').on('click', (e) => {
    e.preventDefault();
    let newUser = {
        username: $('#signUpName').val(),
        email: $('#signUpEmail').val(),
        password: $('#signUpPassword').val(),
    }
    console.log(newUser)
    
    $.ajax({
        method: 'POST',
        url:'/api/signup',
        data: newUser,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);  
            console.log(xhr)
        },
        success: signUpSuccess,
        error: signUpError
    });
    setTimeout(function() {
        window.location.pathname = '/login';
    })
});

signUpSuccess = (json) => {
    console.log(json);
    $('.modal-body .error-message').fadeOut(500);
    $('.alert alert-success').fadeIn(500);

    // localStorage.clear();
    localStorage.setItem('token', json.token)
    console.log(json.token)
    // setTimeout(
    //     window.location = '/main', 500);
    // $.ajax({
    //     method:"GET",
    //     headers: {
    //         'Authorization': 'Bearer' + json.token
    //     },
    //     success: function(res){
    //         console.log(res)
    //         console.log("yay")
    //     },
    //     error: function(res){
    //         console.log("nay")
    //     }
    // })
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
    setTimeout(function() {
        window.location.pathname = '/login';
    })
})

loginSuccess = (json) => {
    console.log(json)
    $('main').first('.error-message').fadeOut();
    $('.alert-success').fadeIn(500);

    // localStorage.clear();
    localStorage.setItem('token', json.token)
    // setTimeout(function () {
    //     window.location.pathname = '/main';});
}  

loginError = (json) => {
    console.log(json)
    $('main').first('.error-message').fadeOut(200);
    $('main').first('.error-message').fadeIn(500);
    $('main').css('display', 'flex');
}

$('.removeArtist').on('click', (e) => {
    e.preventDefault();

    $.ajax ({
        method: "DELETE",
        url: '/api/artist/:id',
        success: console.log('deleted'),
        error: console.log('not deleted')
    })
})

// $('#demoLogin').on('click', function (e) {
//     e.preventDefault(); 
//     localStorage.clear();
//     setTimeout(function() {
//         window.location.pathname = '/login';
//     })
// })

// function depopulateArtistList(res) {
//     console.log(res)
//     let deleteArtist = 
//     `<li><a href="${res.artistUrl}">${res.name}</a> <p class='remove'>-</p></li>`
//     $('#savedArtists').append(deleteArtist)
// }

function checkForLogin() {
    if(localStorage.length > 0){

    let jwt = localStorage.token
        $.ajax({
            method: "POST", 
            url: '/verify',  
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + jwt);  
                console.log(xhr)
            }
        }).done(function (res) {
            console.log(res)
            user = { username: res.username || res.newUser.username, _id: res._id || res.newUser._id }
            userId = res._id
            console.log("you can access variable user: " , user.username, "with id", user._id)
            $('#message').text(`Welcome, ${ res.username || res.newUser.username } `)
            // $.ajax({
            //     method: 'GET',
            //     url: '/api/artists',
            //     beforeSend: function (xhr) {
            //         xhr.setRequestHeader('Authorization', 'Bearer ' + jwt);  
            //     },
            //     success: loginPopulate = (res) => {
            //         let artistsAll = res.artistsAll
            //         for(i=0; i < artistsAll.length; i++) {
            //             if (userId == artistsAll[i].user) {
            //                 // let userArtists = artistsAll[i].name
            //                 // console.log(userArtists) 
            //                 let addUserArtists = 
            //                 `<li><a href="${artistsAll[i].artistUrl}">${artistsAll[i].name}</a></li>`
            //                 $('#savedArtists').append(addUserArtists)
            //             }
            //         }
            //     }
            // })
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
        $('#message').text(`Welcome, Demo User `)

    }
}

$('#about').on('click', (e) => {
    e.preventDefault();
    setTimeout(function () {
        window.location.pathname = '/about'
    })
})

$('#logOut').on('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    setTimeout(function () {
        window.location.pathname = '/'
    })
})


$('#profile').on('click', (e) => {
    e.preventDefault();
    setTimeout(function () {
        window.location.pathname = '/profile'
    })
})

$('#mainSearch').on('click', (e) => {
    e.preventDefault();
    setTimeout(function () {
        window.location.pathname = '/main'
    })
})
