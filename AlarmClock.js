/**
 * Created by Quinn on 2017-03-28.
 */




var alarmSetTime;
var i=0;
var savedList =[]


/**
 * displays the time
 */
function clock() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById('time').innerHTML = t;
    var timeout = setTimeout(clock, 500);
    //loadPastSession();
}


/**
 * gets the value from local storage and displays in the table
 */
function loadPastSession() {
    if (localStorage.length > 0) {
        var rawList = localStorage.getItem("AlarmList");
        var list = JSON.parse(rawList);

        for(var i = 0; i < list.length; i++) {
            // converting  the date from jason format
            list[i].date = new Date(list[i].jsonDate);
            console.log("Converted tiime: " + list[i].date);
            console.log("On load the activeflag is" + list[i].activeFlag);
            list[i].aId = i;
            var currentDate = new Date();
            console.log("current time: " + currentDate);
            if (list[i].jsonDate < currentDate.getTime()) {
                console.log("time expired ");
                list[i].activeFlag = false;

            } else {
                if (list[i].activeFlag) {
                    console.log("time in the future: ");
                    setAlarm(list[i]);
                }

            }

            console.log("after refresh alarm active value " + list[i].activeFlag )
            alarmList.push(list[i]);
            updatePreview(list[i]);

        }
    } else {
        console.log("There is no local storage");
    }
}

