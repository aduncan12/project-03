let accessToken = 'BQDGzOPTEKX2lDZiKq6Gfdyh-r_co7IPtE5oKSRPPVVjTNbJ-wF8_Lz1yGVk0kVYnEjoU4_nRNwPOjrrcTU-r7nhd8wPHZGeXT8fldcx1eX2s2aCMCSmGxAvZOJpll9J0zFEYQnX2scp7z1ZA9dmC2GPM1wCb6c52E-8IQ';

let artistSuccess = (res) => {
    let artistId = res.artists.items[0].id;
    console.log(artistId);
    //ajax request for related artists
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }, 
        success: recommend = (res) => {
            console.log(res)
            let i;
            for (i=0; i < res.artists.length; i++) {
                let newArtists = res.artists[i].name
                let popularity = res.artists[i].popularity
                let url = res.artists[i].external_urls.spotify
                let artistList = 
                `<li>
                <p><a href="${url}">${newArtists}</a> ${popularity} </p>
                
                </li>`

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
    let artist = $("#artistSearch").val();
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/search/?q=${artist}&type=artist`,
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
