var user = '';
var provider = '';
var logged = localStorage.getItem("logged");

document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
});

function googleLogin() {
    provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            user = result.user;
            localStorage.setItem("logged", true);
            localStorage.setItem("user", user.displayName);

            $("#toLogin").attr("hidden", true);
            $("#toLogout").attr("hidden", false);
            $("#name").text("Hello: " + user.displayName);
            $("#newTrain").attr("hidden", false);
        })
        .catch(console.log);
}

function githubLogin() {
    provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            user = result.user;
            localStorage.setItem("logged", true);
            localStorage.setItem("user", user.displayName);

            $("#toLogin").attr("hidden", true);
            $("#toLogout").attr("hidden", false);
            $("#name").text("Hello: " + user.displayName);
            $("#newTrain").attr("hidden", false);
        })
        .catch(console.log);
}

function logout() {
    firebase.auth().signOut();
    $("#toLogin").attr("hidden", false);
    $("#toLogout").attr("hidden", true);
    $("#name").empty();
    $("#newTrain").attr("hidden", true);
    localStorage.setItem("logged", false);
    localStorage.setItem("user", "");
    user = '';
}


$(function () {

    if (!logged) {
        $("#toLogout").attr("hidden", true);
        $("#newTrain").attr("hidden", true);
    } else {
        if ( logged == "true" ) {
            $("#toLogin").attr("hidden", true);
            $("#newTrain").attr("hidden", false);
        } else {
            $("#toLogout").attr("hidden", true);
            $("#newTrain").attr("hidden", true);
        }
    }

    $("#name").text("Hello: " + localStorage.getItem("user"));
    console.log("Today: " + moment().format("DD"));


    const app = firebase.app();
    const db = firebase.firestore();

    db.collection("trains").onSnapshot(doc => {
        $("#data").empty();
        doc.forEach(function (doc) {
            $("#data").append("<tr>")
            $("#data").append("<td>" + doc.data().name + "</td>");
            $("#data").append("<td>" + doc.data().destination + "</td>");
            $("#data").append("<td>" + doc.data().frequency + "</td>");
            $("#data").append("<td>data 2</td>");
            $("#data").append("<td>data 3</td>");
            $("#data").append("</tr>")
        });
    });


    $("#newTrainSubmit").on("click", function(event) {
        // prevent form from submitting
        event.preventDefault();

        var trainName = $("#inputName").val();
        var trainDestination = $("#inputDestination").val();
        var trainFrequency = $("#inputFrequency").val();

        var newTrain = db.collection("trains").doc();
        newTrain.set({'name': trainName, 'destination': trainDestination, 'frequency': trainFrequency});

    });
});