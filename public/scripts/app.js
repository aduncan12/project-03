let accessToken = 'BQAFeWf46U1DGxXSH9sz2UL5ngaR9hPAW9hPD7BIOVQk1jh70Y2KQ6n3D7njm-SWSgoEKECkmctUajeEK_4v0vVww9-uL7J8L7kB1MYLpf5mr_-qOfCDsm-UHF_6hsAdWORcto71eygJGMlJ8lAu0z2pJsAbjJaBaRE76g';

let artistSuccess = (res) => {
// create if statement to match artist variable with res.artists.items
    let artistId = res.artists.items[0].id;
    $('#testDiv').css('display', 'inline')
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
            console.log(res)
            for (i=0; i < res.artists.length; i++) {
                let newArtists = res.artists[i].name
                let popularity = res.artists[i].popularity
                let url = res.artists[i].external_urls.spotify
                let artistList = 
                `<p><a href="${url}">${newArtists}</a> ${popularity} </p>`
                $('#testDiv').append(artistList);
            }    
        }
    })
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

    //             $('#testDiv').append(artistList);
    //         }    
    //     }
    // })
}

$('.fas').on('click', (e) => {
    e.preventDefault();
    $('#testDiv').empty();
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
    // $('.modal-body .error-message').fadeOut(500);
    // setTimeout(function() { alert("User created. Thanks for creating an account with us."); }, 1000);
    // setTimeout(function () {window.location.pathname = '/';}, 1500);
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

$('#logIn').on('click', (e) => {
    e.preventDefault();
    console.log('log in')
})

loginSuccess = (json) => {
    console.log('worked')
    $('main p').first('.error-message').fadeOut();
    setTimeout(function () {
        window.location.pathname = '/map';}, 500);
}   

loginError = (json) => {
    console.log(json)
    $('main p').first('.error-message').fadeOut(200);
    $('main p').first('.error-message').fadeIn(500);
        $('main p').css('display', 'flex');
}

$('#about').on('click', (e) => {
    e.preventDefault();
    console.log('about')
})
