let accessToken = 'BQBMYyz0WnQ8X3j88fWrXJivyVryxDX__VMSUM7JwXXeQbuJpSEMKPSdwbSRBU-_IlhMVoHHZBBwpgLfjC68rjMtNcXJOC8cvT2ka6O3XITjvSMuX3m7JyBzMNhgA1jXjqkZewAHb8JOgie2H5bUMYf-fsJkcJ3Oo7de4A&refresh_token=AQCPfhA1QnoVz9rqxomGZ3rjDfue3To3gxPD-rdb5LXp39kengO2wFYl_aiH52M95F2lwy00cdcar0SIXN9l3D_AlFfQ5S6jPNgNXrwUgTJ2NMEWuTvtTSrjLTsaeacA--ybXg';

let artistSuccess = (res) => {
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
            // console.log(res)
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
    let artist = $("#artistSearch").val();
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
