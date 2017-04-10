/**
 * Created by Quinn on 2017-03-29.
 * This class contains all the functions to create, cancel, edit, snooze, and delete alarms
 *
 */



var alarmList = [];
var i = 0;
var ringtone = new Audio("ringtone.mp3");
var currentEditId;
var currentEditPosition;

/**
 * gets the values of time and label given by the user and initializes alarm object
 */
function createAlarm()
{
    var alarmLabel = document.getElementById("alarmLabel").value;
    var alarmSetTime = document.getElementById("alarmTime").value;
    checkValidAlarm(alarmSetTime);
    var hrs = alarmSetTime.substring(0, alarmSetTime.indexOf(':'));
    var mins = alarmSetTime.substring(alarmSetTime.indexOf(':')+1, alarmSetTime.length);

    var alarmDate = new Date();
    alarmDate.setHours(hrs);
    alarmDate.setMinutes(mins);
    alarmDate.setSeconds(0);
    var alarmTimer = null;
    console.log("original time: " + alarmDate);
    var newAlarm = {time: alarmSetTime, label: alarmLabel, date: alarmDate, timer:alarmTimer, aId:i, activeFlag:true, jsonDate: alarmDate.getTime()};
    // for testing
    console.log("original time after: " + newAlarm.date);
    alarmList.push(newAlarm);
    console.log("the id on create is : " + alarmList[0].aId)
    console.log("Alerm List size: " + alarmList.length);
    setAlarm(newAlarm);
    updatePreview(newAlarm);

    //storing the alarmList for future session
    localStorage.setItem("AlarmList",JSON.stringify(alarmList));
    console.log("create alarm getting called");

}





/**
 * sets the timeout for the alarm after checking that it is in the furture than current time
 * if time set in the past , it sets it for the next day
 * @param alarm object
 */
function setAlarm(alarm){

    console.log("set alarm getting called");
    if (alarm.alarmTimer != null) {
        clearTimeout(alarm.alarmTimer);
    }
    var currentDate = new Date();
    while(alarm.date < currentDate)
    {
        console.log("Alarm date is less than current date");
        alarm.date.setDate(alarm.date.getDate()+1);
        alarm.jsonDate = alarm.date.getTime();
    }
    var time = (alarm.date - currentDate );
    console.log("The time remaining: " + time);
    alarm.alarmTimer = setTimeout( function(){fireAlarm(alarm.aId);} ,parseInt(time) );
}


/**
 *starts the ringtone and shows the modal that alarm is ringing
 * @param  alarm Id
 */
function fireAlarm(x)
{
    console.log("fire alarm getting called")
    jQuery.noConflict();
    $('#alarmModal').modal('show');
    //deleteAlarm(document.getElementById(x));
    setInactiveOnRing(x);
	// start ringtone
	startRingtone();
}


/**
 * sets 30 seconds timeout for snooze
 */
function setSnooze()
{
    var alarmDate = new Date();
    alarmDate.setSeconds(30);
    var alarmTimer = null;
    var snoozeAlarm = {time: alarmSetTime, label: alarmLabel, date: alarmDate, timer:alarmTimer, aId:-1};
    setAlarm(snoozeAlarm);
	stopRingtone();
}


/**
 *checks that if alarm parameters were correctly inputted by the user
 * @param  alarm object
 */
function checkValidAlarm(x)
{
    if(x == null || x == "")
    {
        alert("not a valid alarm")
    }
}


/**
 *sets the alarm properties in a  row for the table
 * @param alarm
 */
function updatePreview(alarm)
{
    console.log("update preview getting called: " + alarm.date);
    if(alarm != null) {
        if (alarm.activeFlag) {
            $('#addr' + i).html("<td>" + alarm.time + "</td>" + "</td><td>" + alarm.label + "</td>" + "<td align='center'><input type=\"checkbox\" onchange=\"toggleCheckbox(this)\" checked id=\"check" + i + "\"></td>" + "<td width='70%'> <input type=\"button\" class=\"btn btn-default\" value='edit' onclick =\"editAlarmPressed(this)\" id=\"edit" + i + "\"/>" + "</td>" +"<td width='70%'>" + "<input type=\"button\" value='delete' id=" + i + " class=\"btn btn-default\" onclick=\"deleteAlarm(this)\" />" + "</td>");
            $('#tab_logic').append('<tr id="addr' + (i + 1) + '"></tr>');
            i++;
        } else {
            $('#addr' + i).html("<td>" + alarm.time + "</td>" + "</td><td>" + alarm.label + "</td>" + "<td align='center'><input type=\"checkbox\" onchange=\"toggleCheckbox(this)\" unchecked id=\"check" + i + "\"></td>" + "<td width='70%'> <input type=\"button\" class=\"btn btn-default\" value='edit' onclick =\"editAlarmPressed(this)\" id=\"edit" + i + "\"/>" + "</td>" +"<td width='70%'>" + "<input type=\"button\" value='delete' id=" + i + " class=\"btn btn-default\" onclick=\"deleteAlarm(this)\" />" + "</td>");
            $('#tab_logic').append('<tr id="addr' + (i + 1) + '"></tr>');
            i++;
        }
    }
}




/**
 * clears timeout for the given alarm and removes from list and table
 * @param x
 */
function deleteAlarm(x)
{
    console.log("delete alarm getting called");
	stopRingtone();
    for(var count=0; count< alarmList.length; count++)
    {
        if(alarmList[count].aId == x.id)
        {
            break;
        }
    }
    clearTimeout(alarmList[count].alarmTimer);
    alarmList.splice(count,1);
    $(x).closest("tr").remove();
    localStorage.setItem("AlarmList",JSON.stringify(alarmList));

}

function editAlarmPressed(x)
{
    idsearch = x.id.substring(x.id.indexOf('t')+1, x.id.length);
    currentEditId = idsearch;
    for(var count=0; count< alarmList.length; count++)
    {
        if(alarmList[count].aId == idsearch)
        {
            currentEditPosition = count;
            break;
        }
    }

    jQuery.noConflict();
    $('#alarmEditLabel').val(alarmList[currentEditPosition].label);
    $('#alarmEditTime').val(alarmList[currentEditPosition].time);
    $('#editAlarmId').val(alarmList[currentEditPosition].aId);
    $('#editModal').modal('show');
}

function editAlarm()
{
    var eId = document.getElementById("editAlarmId").value;
    var newLabel = document.getElementById("alarmEditLabel").value;
    var newTime = document.getElementById("alarmEditTime").value;
    checkValidAlarm(newTime);

    var hrs = newTime.substring(0, newTime.indexOf(':'));
    var mins = newTime.substring(newTime.indexOf(':')+1, newTime.length);

    var alarmDate = new Date();
    alarmDate.setHours(hrs);
    alarmDate.setMinutes(mins);
    alarmDate.setSeconds(0);
    var alarmTimer = null;


    for(var count=0; count< alarmList.length; count++)
    {
        if(alarmList[count].aId == eId)
        {
            break;
        }
    }

    if(alarmList[count].activeFlag) {
        clearTimeout(alarmList[count].alarmTimer);
        var newAlarm = {time: newTime, label: newLabel, date: alarmDate, timer:alarmTimer, aId:eId, activeFlag:true, jsonDate: alarmDate.getTime()};
        setAlarm(newAlarm);
        alarmList[count] = newAlarm;
        //storing the alarmList for future session
        localStorage.setItem("AlarmList",JSON.stringify(alarmList));
    }
    else{
        var newAlarm = {time: newTime, label: newLabel, date: alarmDate, timer:alarmTimer, aId:eId, activeFlag:false, jsonDate: alarmDate.getTime()};
        alarmList[count] = newAlarm;
        //storing the alarmList for future session
        localStorage.setItem("AlarmList",JSON.stringify(alarmList));
    }
    var aTable = document.getElementById('tab_logic');
    idName = "edit" + currentEditId;
    document.getElementById(idName).closest("tr").cells[1].innerHTML = alarmList[count].label;
    document.getElementById(idName).closest("tr").cells[0].innerHTML = alarmList[count].time;
    //aTable.rows[eId].cells[2].innerHTML = alarmList[count].label; //vs eId
    //aTable.rows[eId].cells[1].innerHTML = alarmList[count].time;

}

/**
 * sets the logic for changing the checkbox
 * sets to active if alarm was inactive before and vice versa
 * @param  alarm object
 */
function toggleCheckbox(x)
{
    console.log("toggle checkbox getting called");
    idsearch = x.id.substring(x.id.indexOf('k')+1, x.id.length);
    console.log("Id search value: " + idsearch);
    for(var count=0; count< alarmList.length; count++)
    {
        var currentDate = new Date();


        if(alarmList[count].aId == idsearch)
        {
            console.log("Alarm id: " + alarmList[count].aId + "id search value: " + idsearch);
            break;

        }
    }

    if(alarmList[count].activeFlag == true)
    {
        console.log("flag is true");
        clearTimeout(alarmList[count].alarmTimer);
        alarmList[count].activeFlag=false;
        localStorage.setItem("AlarmList",JSON.stringify(alarmList));
    }
    else
    {
        console.log("flag is false");
        alarmList[count].activeFlag=true;
        setAlarm(alarmList[count]);
        localStorage.setItem("AlarmList",JSON.stringify(alarmList));
    }
}


/**
 * sets the activeflag for alarm as false and unclicks the checkbox for active in the table
 * @param  alarm Id
 */
function setInactiveOnRing(xAlarmID)
{
    if (xAlarmID == -1){
        return;
    }
    checkboxID = "check" + xAlarmID;
    for(var count=0; count< alarmList.length; count++)
    {
        if(alarmList[count].aId == xAlarmID)
        {
            break;
        }
    }
   // alarmList[count].activeFlag = false;
    console.log ("The flag was changed after ring to" + alarmList[count].activeFlag.toString() );
    document.getElementById(checkboxID).click();
}




/*
 * starts the ringtone
 */
function startRingtone()
{
	ringtone.play();
}


/**
 *stops the  ringtone
 */
function stopRingtone()
{
	ringtone.pause();
	ringtone.currentTime = 0;
}
