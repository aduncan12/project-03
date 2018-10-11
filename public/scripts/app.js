
let artistSuccess = (res) => {
    console.log(res.artists.items[0].id);
    let artistId = res.artists.items[0].id;
    
    // var listItemHTML = `<li>
    //                         <h2> ${artists.id} </h2>
    //                     </li>`
    
    // $('#testDiv').append(listItemHTML);
        
    // },
}


$('.fas').on('click', (e) => {
    e.preventDefault();
    let artist = $("#artistSearch").val();
    let accessToken = 'BQAgEQ7Cm4HfXIn_A96NE6B0GpLaU-Xra0mLe7eEKXCEwa0qlwRie9uBSem-usWo6pZPcNKlsuNKt9peIup_AHUuJnZLSubQy5KlLcMasvftijQr8CHDNi245zXpmHo3BdG8jxMweKszIUaQVO7ZEwE6HsoPhGRqtWkzCg&refresh_token=AQBFuahVMQZSlxVGYSe5hPSlHqwNq3L6ulKuybMkVoN8D';
    // console.log(artist)
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


