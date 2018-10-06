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
        if (logged == "true") {
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
            //console.log(doc.id)

            var row = $("<tr>");
            row.addClass("train-data");
            row.attr("id", doc.id);

            var colName = $("<td>");
            colName.append(doc.data().name);

            var colDestination = $("<td>");
            colDestination.append(doc.data().destination);

            var colFrequency = $("<td>");
            colFrequency.append(doc.data().frequency);

            var colNext = $("<td>");
            colNext.append("data1");

            var colAway = $("<td>");
            colAway.append("data2");

            var colEdit = $("<td>");
            colEdit.append("<i class='fa fa-edit'></i>");

            var colDel = $("<td>");
            colDel.append("<i class='fa fa-trash'></i>");


            row.append(colName)
                .append(colDestination)
                .append(colFrequency)
                .append(colNext)
                .append(colAway)
                .append(colEdit)
                .append(colDel)

            $("#data").append(row);





            // $("#data").append("<tr class='train-data' id='" + doc.id + "'>")
            // $("#data").append("<td>" + doc.data().name + "</td>");
            // $("#data").append("<td>" + doc.data().destination + "</td>");
            // $("#data").append("<td>" + doc.data().frequency + "</td>");
            // $("#data").append("<td>data 2</td>");
            // $("#data").append("<td>data 3</td>");
            // $("#data").append("<td> <i class='fa fa-edit'></i> </td>");
            // $("#data").append("<td> <i class='fa fa-trash'></i> </td>");            
            // $("#data").append("</tr>")


        });
    });






    $("#newTrainSubmit").on("click", function (event) {
        // prevent form from submitting
        event.preventDefault();

        var trainName = $("#inputName").val();
        var trainDestination = $("#inputDestination").val();
        var trainStart = $("#inputStart").val();
        var trainFrequency = $("#inputFrequency").val();

        var newTrain = db.collection("trains").doc();
        newTrain.set({ 'name': trainName, 'destination': trainDestination, 'start-time': trainStart, 'frequency': trainFrequency });

        $("#new-train")[0].reset();
    });

    $(document).on("click", ".train-data", function () {
        console.log($(this).attr("id"))
    })
});