var dvalue = -1;
var csv = 'Name, ID\n';

function createCSV() {
    console.log("createCSV: " + csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Users.csv';
    hiddenElement.click();
}

function createArray() {
    var deferred = $.Deferred();
    console.log("createArray")
    var fullArr = [];

    db.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            var arr = [doc.data().name, doc.data().value];
            fullArr.push(arr);
            csv += doc.data().name + ',' + doc.data().value + '\n';
            console.log(csv);
        });
    });
    console.log(fullArr);

    return deferred.promise();
}

export default class ShiftManagement {
    init(el) {
        el.innerHTML = `
            <div id="shiftManagement">
                <aside class="toolbar" dir="rtl">
                    <p class="lead" id="dname">שם:</p>
                    <p class="lead" id="disValue">ערך:</p>
                </aside>

                <table class="table table-striped table-bordered" align="right">
                    <thead>
                      <tr>
                        <th>יום שבת</th>
                        <th>יום שישי</th>
                        <th>יום חמישי</th>
                        <th>יום רביעי</th>
                        <th>יום שלישי</th>
                        <th>יום שני</th>
                        <th>יום ראשון</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><button type="button" class="btn inner" id="inner_button" name="0"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="1"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="2"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="3"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="4"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="5"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="6"> </button></td>
                        <th>בוקר</th>
                      </tr>
                      <tr>
                        <td><button type="button" class="btn inner" id="inner_button" name="7"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="8"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="9"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="10"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="11"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="12"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="13"> </button></td>
                        <th>ערב</th>
                      </tr>
                      <tr>
                        <td><button type="button" class="btn inner" id="inner_button" name="14"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="15"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="16"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="17"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="18"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="19"> </button></td>
                        <td><button type="button" class="btn inner" id="inner_button" name="20"> </button></td>
                        <th>לילה</th>
                      </tr>
                    </tbody>
                </table>

            </div>

            <button id="btn-save" type="button" class="btn btn-success">שמור</button>
            <button id="btn-signout" type="button" class="btn btn-danger">שמור והתנתק</button>
            <br>
            <button id="export" type="button" class="btn">export</button>
        `;

        $('#btn-signout').on('click', function() {
            save();

            firebase.auth().signOut().then(function() {
              // Sign-out successful.
            }).catch(function(error) {
              // An error happened.
            });
        });

        $('#btn-save').on('click', function() {
            save();
        });


        $('.inner').on('click', function(){
            var button = $(this);
            var num = button.attr("name");
            console.log("num: " + num);
            console.log("before: " + dvalue);

            var color = button.css("background-color");
            // console.log("color: " + color);

            if (color == 'rgb(0, 128, 0)') {
                button.css("background-color", "red");
                dvalue -= Math.pow(2, num);
            }
            else {
                button.css("background-color", "green");
                dvalue += Math.pow(2, num);
            }

            console.log("after: " + dvalue);
        });

        $('#export').on('click', function() {
/*            $.when(createArray()).done(function() {
                alert("1");
                createCSV();
            });*/
            createArray().then(function() {
                alert("2");
                createCSV();
            });
        });
    }
} 


const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const name = user.displayName;
        const value = user.value;
        const id   = user.uid;
        // alert(`Welcome! ${name}. Your id isssssssssssssssssssssss ${id}`);
        $(document).ready(function(){
            $("#dname").text("שם משתמש: " + name);
            firebase.firestore().collection('users').doc(id).get().then(function(doc) {
                setDvalue(doc.data().value, setButtons);
                $("#disValue").text("ערך: " + dvalue);

            });
        });
    } else {
        // user not signed in, do nothing
    }
}); 

function setDvalue(value, callback) {
    // console.log("hi" + value);
    dvalue = value;
    callback();
}

function setButtons() {
    // console.log("hi" + dvalue);
    var value = dvalue;

    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];

        var id = button.getAttribute('id');
        if (id == "inner_button") {
            // button.innerHTML = 'hi' + i;
            if (shiftCheck(value)) button.style.background='#008000';
            else button.style.background='#FF0000';
            value = Math.floor(value / 2);
        }
    }
}

function shiftCheck(shiftValue) {
    // console.log("value: " + shiftValue);
    if (shiftValue % 2 == 1) return true;
    return false;
}

function save() {
    if (dvalue == -1) return;

    const value = dvalue;
    const userid = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users').doc(userid).update({
      value,
    });
}

