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

$('#signUp').on('click', (e) => {
    e.preventDefault();
    console.log('sign up')
})

$('#logIn').on('click', (e) => {
    e.preventDefault();
    console.log('log in')
})

$('#about').on('click', (e) => {
    e.preventDefault();
    console.log('about')
})
