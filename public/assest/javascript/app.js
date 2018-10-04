var user = '';
var logged = false;
var provider = '';

$("#toLogin").attr("hidden", false);
$("#toLogout").attr("hidden", true);


document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
});

function googleLogin() {
    provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            user = result.user;
            // document.write(`Hello ${user.displayName}`)
            console.log(user);
            logged = true;
            $("#toLogin").attr("hidden", true);
            $("#toLogout").attr("hidden", false);
        })
        .catch(console.log);
}

function githubLogin() {
    provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            user = result.user;
            // document.write(`Hello ${user.displayName}`)
            console.log(user);
            logged = true;
            $("#toLogin").attr("hidden", true);
            $("#toLogout").attr("hidden", false);
        })
        .catch(console.log);
}

function logout() {
    firebase.auth().signOut();
    $("#toLogin").attr("hidden", false);
    $("#toLogout").attr("hidden", true);
    logged = false;
    user = '';
}

$(function () {
    //console.log('Estoy listo')
});