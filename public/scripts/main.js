$(document).ready(function(){
    checkForLogin();
})

// function checkForLogin() {
//     if(localStorage.length > 0){

//     let jwt = localStorage.token
//         $.ajax({
//             method: "POST", 
//             url: '/verify',  
//             beforeSend: function (xhr) {   
//                 xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);   
//             }
//         }).done(function (response) {
//             console.log(response)
//             user = { username: response.username, _id: response._id }
//             console.log("you can access variable user: " , user)
//                 $('#message').text(`Welcome, ${ response.username || response.result.username } `)

//             }).fail(function (e1, e2, e3) {
//             console.log(e2);
//         });
//     } else {
//         console.log('error: no local storage')
//     }
// }