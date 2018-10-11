
let accessToken = 'BQD5EJonSMdC8uf104SMJFB9yqrKI2_Li3YcGb6kdQ7qpA5Sqd6o9c9jeEsJazd-JRBE-U5tKtgBe_y7iv5PNnLaO4jKuUbN4fO-ndJCLiCoPr8-IiuDklmQN8mlpIBTaGHHASaFf1WOObTv5VGtxqT8qvEYaH4M50gHSw&refresh_token=AQATV6p5ed6IHxS3M6wat6I_H-5I_JAaD0cE9TDv0n38q9YWsQ7-qvzt79wsGvNCs0uBUxXvhs5hoZvqFPTncnoOvDp7fEg_T4MYf31B0sNInf28h495qkP2HLeaUQVtLugj9g';
// let clientId = '74893e3303c047d68148a47c4ef102bd'

let artistSuccess = (res) => {
    let artistId = res.artists.items[0].id;
    // console.log(artistId);
    $.ajax({
        method: 'GET',
        url: `https://api.spotify.com/v1/recommendations?seed_artists=${artistId}`,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }, 
        success: rec = (res) => {
            // console.log(res.tracks)
            let i;
            for (i=0; i < res.tracks.length; i++) {
                let recommendations = res.tracks[i].artists[0].name
                let artistList = 
                `<li>
                <h2> ${recommendations} </h2>
                </li>`
                $('#testDiv').append(artistList);
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


