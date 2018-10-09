var user = '';
var provider = '';
var logged = localStorage.getItem("logged");
var toEdit = '';

$(function () {

    if (!logged) {
        $("#toLogout").attr("hidden", true);
        $("#newTrain").attr("hidden", true);
        $("#trainLogin").attr("hidden", true);
    } else {
        if (logged == "true") {
            $("#toLogin").attr("hidden", true);
            $("#newTrain").attr("hidden", false);
            $("#trainLogin").attr("hidden", false);
            $("#trainLogout").attr("hidden", true);
        } else {
            $("#toLogout").attr("hidden", true);
            $("#newTrain").attr("hidden", true);
            $("#trainLogin").attr("hidden", true);
            $("#trainLogout").attr("hidden", false);
        }
    }

    $("#googleLogin").on("click", function () {
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

                $("#trainLogin").attr("hidden", false);
                $("#trainLogout").attr("hidden", true);
            })
            .catch(console.log);

    })

    $("#githubLogin").on("click", function () {
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

                $("#trainLogin").attr("hidden", false);
                $("#trainLogout").attr("hidden", true);
            })
            .catch(console.log);
    })

    $("#logout").on("click", function () {
        firebase.auth().signOut();
        $("#toLogin").attr("hidden", false);
        $("#toLogout").attr("hidden", true);
        $("#name").empty();
        $("#newTrain").attr("hidden", true);
        localStorage.setItem("logged", false);
        localStorage.setItem("user", "");
        user = '';

        $("#trainLogin").attr("hidden", true);
        $("#trainLogout").attr("hidden", false);
    })

    $("#name").text("Hello: " + localStorage.getItem("user"));

    const db = firebase.firestore();

    db.collection("trains").onSnapshot(doc => {
        $("#dataLogin").empty();

        doc.forEach(function (doc) {
            const startTime = doc.data().startTime;
            const next = moment(startTime, 'HH:mm').add(doc.data().frequency, 'minutes').format('HH:mm');
            var duration = moment(next, 'HHmm').fromNow();
            if (duration.slice(-3) == 'ago') {
                const next = moment(startTime, 'HH:mm').add(doc.data().frequency, 'minutes').format('HH:mm');
                var newTrain = db.collection("trains").doc(doc.id);
                newTrain.set({ 'name': doc.data().name, 'destination': doc.data().destination, 'startTime': next, 'frequency': doc.data().frequency });
            }

            if (logged == 'true') {
                var rowLogin = $("<tr>");
                rowLogin.addClass("train-data");
                rowLogin.attr("id", doc.id);

                var colName = $("<td>");
                colName.append(doc.data().name);

                var colDestination = $("<td>");
                colDestination.append(doc.data().destination);

                var colFrequency = $("<td>");
                colFrequency.append(doc.data().frequency);

                var colNext = $("<td>");
                const startTime = doc.data().startTime;
                const next = moment(startTime, 'HH:mm').add(doc.data().frequency, 'minutes').format('HH:mm');
                colNext.append(next);

                var colAway = $("<td>");
                var now = moment(new Date()).format("HHmm"); //todays date
                var duration = moment(next, 'HHmm').from(moment(now, "HHmm"));
                colAway.append(duration);

                var colEdit = $("<td id='edit'>");
                colEdit.append("<i class='fa fa-edit'></i>");

                var colDel = $("<td id='delete'>");
                colDel.append("<i class='fa fa-trash'></i>");

                rowLogin.append(colName)
                    .append(colDestination)
                    .append(colFrequency)
                    .append(colNext)
                    .append(colAway)
                    .append(colEdit)
                    .append(colDel)

                $("#dataLogin").append(rowLogin);
            } else {
                var rowLogout = $("<tr>");
                rowLogout.addClass("train-data");
                rowLogout.attr("id", doc.id);

                var colName = $("<td>");
                colName.append(doc.data().name);

                var colDestination = $("<td>");
                colDestination.append(doc.data().destination);

                var colFrequency = $("<td>");
                colFrequency.append(doc.data().frequency);

                var colNext = $("<td>");
                console.log(doc.data().startTime)
                const startTime = doc.data().startTime;
                const next = moment(startTime, 'HH:mm').add(doc.data().frequency, 'minutes').format('HH:mm');
                colNext.append(next);

                var colAway = $("<td>");
                var now = moment(new Date()).format("HHmm"); //todays date
                var duration = moment(next, 'HHmm').from(moment(now, "HHmm"));
                colAway.append(duration);

                var colEdit = $("<td id='edit'>");
                colEdit.append("<i class='fa fa-edit'></i>");

                var colDel = $("<td id='delete'>");
                colDel.append("<i class='fa fa-trash'></i>");

                rowLogout.append(colName)
                    .append(colDestination)
                    .append(colFrequency)
                    .append(colNext)
                    .append(colAway)

                $("#dataLogout").append(rowLogout);
            }
        });
    });

    $("#newTrainSubmit").on("click", function (event) {
        // prevent form from submitting
        event.preventDefault();

        var trainName = $("#inputName").val();
        var trainDestination = $("#inputDestination").val();
        var trainStart = $("#inputStart").val();
        var trainFrequency = $("#inputFrequency").val();

        if (toEdit == '') {
            var newTrain = db.collection("trains").doc();
            newTrain.set({ 'name': trainName, 'destination': trainDestination, 'startTime': trainStart, 'frequency': trainFrequency });
            $("#new-train")[0].reset();
        } else {
            console.log(toEdit)
            var newTrain = db.collection("trains").doc(toEdit);
            newTrain.set({ 'name': trainName, 'destination': trainDestination, 'startTime': trainStart, 'frequency': trainFrequency });
            $("#new-train")[0].reset();
            $("#newTrainSubmit").text("Add Train");
            toEdit = '';
            alert('Train edited!');
        }
    });

    $(document).on("click", "#edit", function () {
        toEdit = $(this).parent().attr("id");
        var docum = db.collection("trains").doc($(this).parent().attr("id")).get().then(function (doc) {
            $("#inputName").val(doc.data().name);
            $("#inputDestination").val(doc.data().destination);
            $("#inputStart").val(doc.data().startTime);
            $("#inputFrequency").val(doc.data().frequency);
            $("#newTrainSubmit").text("Update Train");
        })
    });

    $(document).on("click", "#delete", function () {
        if (confirm('Are you sure you want to delete the train: ')) {
            db.collection("trains").doc($(this).parent().attr("id")).delete().then(function () {
                alert('Train deleted!');
            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });
        }
    });

});