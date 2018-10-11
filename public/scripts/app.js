
let accessToken = 'BQDe7F4-wr3pXLqK-3umdX5Bw9Z26jeCOUPSPxkdtCi2PiH1H3rAv3xrwlbnq57fTh9we_t18ozr8W0ss6C3ug_pRO-6TjS8fhfInliPmz0mB_0wbdVqNEhZAOsXVufehrHeKV7_lfmBNfhelTG7Y1tRgDxUoVEHrbbwGQ&refresh_token=AQCHZYqYUHHRHbD7ijVedRQBXNJgdjHKooi7V0LZfzkSa3sfp_oWD-rnKpcyqhr5ke4SXYwlh2x1LVhKWmEVIOgjflck8qa3W8mbxh8gUaEL9XYdVTvyB_qcVI5lTkDDgFpEPg';
// let clientId = '74893e3303c047d68148a47c4ef102bd'

let artistSuccess = (res) => {
    let artistId = res.artists.items[0].id;
    console.log(artistId);
    // let artistList = `<p>${res.artists.items[0].name} ${artistId} </p>`
    // $('#testDiv').append(artistList);  
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/recommendations?seed_artists=${artistId}`,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }, 
        success: recommendations = (res) => {
            console.log(res.tracks)
            let i;
            for (i=0; i < res.tracks.length; i++) {
                console.log(res.tracks[i].artists[0].name)
            }
        }
    })
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


