// Object initialisation occurs on document ready.
var calendar = null;

// Updater
function updater(content) {
    if(content != 'same') {
        $.ajax({
            method: "POST",
            url: "/calendarUpdate",
            data: content
        })
        .fail(function() {
            console.log( "Unable to send data to update" );
        });
    }
}

// Retriever
function retriever(content) {
    return $.ajax({
        method: "POST",
        url: "/apptRetrieve",
        data: content
    })
    .done(function( retrieved ) {
        return JSON.parse(retrieved);
    })
    .fail(function() {
        console.log( "Unable to retrieve data" );
    });
}

// Events upon Document Load
$(document).ready(function() {
    // AJAX to get initial data
    $.ajax({
        method: "GET",
        url: "/calendarInit",
    })
    .done(function( initData ) {
        function parseData() {
            // Calendar initiation
            calendar = new Calendar(JSON.parse(initData));
        }
        // Wait for class to be initialised then continue to build.
        $.when(parseData()).then(buildInit(calendar.classData['dwd']));
    })
    .fail(function() {
        alert( "Unable to load initial Data" );
    });
    // Button event listeners
    $( "#dayLabel" ).click(function() {
        if (calendar.classData['dwd'] !== $(this).data('time')) {
            dayProcess();
        }
    });
    $( "#weekLabel" ).click(function() {
        if (calendar.classData['dwd'] !== $(this).data('time')) {
            weekProcess();
        }
    });
    $( "#displayButton" ).click(function () {
        if (calendar.classData['dwd'] !== $(this).val()) {
            displayProcess();
        }
    });
    $( "#calTodayButton" ).click(function() {
        var date = calendar.yankify(moment().format('L'));
        updater(calendar.parseDate(date));
        dayProcess();
        $('#datepicker').datepicker("setDate", date);
    });
    $('#calFwd').click(function() {
        var newDate = calendar.chooseFwd();
        dateUpdate(newDate);
        $('#datepicker').datepicker("setDate", newDate);
    });
    $('#calBwd').click(function() {
        var newDate = calendar.chooseBwd();
        dateUpdate(newDate);
        $('#datepicker').datepicker("setDate", newDate);
    });
    $(document).on('change','#datepicker',function(){
        dateUpdate($('#datepicker').datepicker("getDate"));
    });
    $(document).on('change','#tStartSelect',function(){
        updater(calendar.timeSelectAdjust('start', $('#tStartSelect'), $('#tEndSelect')));
    });
    $(document).on('change','#tEndSelect',function(){
        updater(calendar.timeSelectAdjust('end', $('#tStartSelect'), $('#tEndSelect')));
    });
    $(document).on('change','#calTeacherSelectDay',function(){
        updater(calendar.getTeacherSelectsDay());
        dayProcess();
    });
    $(document).on('change','#calTeacherSelectWeek',function(){
        updater(calendar.getTeacherSelectsWeek());
        weekProcess();
    });
    $(document).on('change','#calCentreSelect',function(){
        updater(calendar.getCentreSelects());
        dwdRenderer();
    });
    $(document).on('click','.timeSlot',function(){
        console.log($(this).data());
    });
    // ON CHANGE OF AVAILABILITY FORM, DYNAMICALLY UPDATE ON SCREEN SELECTION
    $(document).on('change','#availGrid',function(){
        calendar.availabilityUpdate();
        calendar.availabilityFocus('form');
    });
    $(document).on('click','.addStaff',function(){
        calendar.addSubmenu();
    });
    $('html').on('click', function(){
        calendar.removeSubmenu();
    });
    $(document).on('click','#subAvailability',function(){
        $.when(calendar.buildAvailabilityInput()).done(calendar.availabilityFocus('form'));
    });
    $(document).on('click','#availSubmit',function(){
        // SUBMIT NEW AVAILABILITY
        $.when(updater(calendar.submitAvailabilityForm())).done(dwdRenderer());
        calendar.removeForm($('#availGrid'));
    });
    $(document).on('click','#availClose',function(){
        calendar.removeForm($('#availGrid'));
    });
});

// Choose initial page
function buildInit(view) {
    //// DO OTHER INITIAL STUFF HERE
    calendar.hideSol(view);
    calendar.createTeacherSols();
    calendar.createCentreSol();
    if (view == 'day') {
        dayProcess();
    } else if (view == 'week') {
        weekProcess();
    } else {
        buildDisplay();
        $("#displayButton").addClass("active");
    }
    $('#datepicker').datepicker("setDate", calendar.yankify(calendar.classData.datePicked));
}

function dayProcess () {
    if(calendar != null) {
        //$.when(retriever({'type': 'calendarInfo', 'datespan': calendar.getDateSpan(calendar.getColumns('day'))})).done(function(retrieved){
        //    calendar.calendarInfoLoader(retrieved);
        //});
        calendar.hideSol('day');
        calendar.classData['dwd'] = 'day';
        buildDay();
        checkState();
        updater({'type': 'calView', 'view': 'day'});
        $("#dayLabel").addClass("active");
    }
}

function weekProcess () {
    if(calendar != null) {
        /*
        // If already loaded, use class data
        if (calendar.currentData.calendarInfo) {
            $.when(buildWeek()).done(function(){
                calendar.calendarInfoLoader(calendar.currentData.calendarInfo);
            });
        } else {
            $.when(retriever({'type': 'calendarInfo', 'datespan': calendar.getDateSpan(calendar.getColumns('week'))})).done(function(retrieved){
                calendar.calendarInfoLoader(retrieved);
            });
            buildWeek();
        }*/
        $.when(retriever({'type': 'calendarInfo', 'datespan': calendar.getDateSpan(calendar.getColumns('week'))})).done(function(retrieved){
            calendar.calendarInfoLoader(retrieved);
        });
        buildWeek();
        checkState();
        calendar.hideSol('week');
        calendar.classData['dwd'] = 'week';
        updater({'type': 'calView', 'view': 'week'});
        $("#weekLabel").addClass("active");
    }
}
function displayProcess () {
    calendar.removeForm($('#availGrid'));
    if(calendar != null) {
        buildDisplay();
        checkState();
        calendar.classData['dwd'] = 'display';
    }
}

// Build Day page
function buildDay() {
    view = 'day';
    calendar.getTemplate(view);
    calendar.addTimeColumn(view);
    calendar.addGridTimes(view);
}

// Build Week page
function buildWeek() {
    view = 'week';
    calendar.getTemplate(view);
    calendar.addTimeColumn(view);
    calendar.renderColumns(calendar.getColumns(view));
    calendar.addGridTimes(view);
}

// Build Display page
function buildDisplay() {
    view = 'display';
    calendar.getTemplate(view);
    calendar.setTimeSelects();
}

function dateUpdate(date) {
    updater(calendar.parseDate(date));
    dwdRenderer();
}

// Chooses action based on day/week
function dwdRenderer() {
    if (calendar.classData['dwd'] == 'day') {
        dayProcess();
    } else if (calendar.classData['dwd'] == 'week') {
        weekProcess();
    } else {
        displayProcess();
    }
}

// Checks whether any 'special states' are open and react accordingly
function checkState() {
    // Check if availability select is open
    if ($('#availGrid').length > 0) {
        calendar.availabilityFocus('form');
    }
}


/*
Initial Data (only drawn at beginning of calendar session)
--- HTTP GET request
--- (updated throughout session)
- Session prefs
-- Time params (2 - 98) xx - method DONE!!
-- Last dw viewed xx - extractable variable - 'day' DONE!!
-- Teachers UNselected (ID) xx - extractable object - {ID : teacher}
-- Rooms selected xx - extractable array - [Room 6, Room 7]
-- Centre selected xx - extractable variable - 'cosham'
-- Instruments selected xx - extractable array - [guitar, banjo]
-- Lesson types selected xx - extractable array - [AH, Weekly]
-- Lesson lengths selected xx - extractable array - [30, 45, 60]
--- (Never updated)
- User info
-- Permission Level xx - extractable variable - 'teacher'
-- ID xx - extractable variable - '6756'
-- Username xx - extractable variable - 'BobbyB'
--- Dw templates
*/

/*
Button dependant data (Auto draw after 'Initial Data' as well as later reactive draws)
---JS internal queries
- Current appt/unavail/notes for timeframe
- Current session prefs
--- Reactive HTTP GET requests
- Current teacher query MAIN -- NO
- Current centre / room query MAIN  -- NO
- Current Instrument query -- NO
- Current Lesson type query -- NO
- Current Lesson length query -- NO
*/

/*
Update Functions (data alterations via calendar)
-- HTTP UPDATE requests
- Session prefs / JS then DB
- Apts-Unavail-Notes / JS then DB
- User activity / DB
*/



$( function() {
    $( "#datepicker" ).datepicker({
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 2,
        firstDay: 1,
        regional: "fr"
    });
});