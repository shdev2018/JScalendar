// Global variables
var timeslots = 96;
var timeFrom = 2;
var timeTo = 98;

/*

$(function() {
    $('#teacherSelect').searchableOptionList({
        data: function () {

            $.ajax({
                method: "POST",
                url: "/calendarjs",
                data: { type: 'Teachers' }
            })
            .done(function( list ) {
                var teachers = JSON.parse(list);
                }
            );
            return teachers;
        }
    });
});
*/

// Listener to populate popover form
$(document).ready(function() {
    get_popover_data_init();
    $( "#displayButton" ).on('change', function() {
        get_popver_data_update();
    });
});

// Bootstrap display popover
var get_popover_data_init = function() {
    $.ajax({
        method: "POST",
        url: "/calendarjs",
        data: { type: 'popover_init' }
    })
    .done(function( data ) {
        data = JSON.parse(data);
        if($ ('#popover_struct')) {
            $( "#popover_struct" ).remove();
        }
        $('#displayButton').popover({
        html : true,
        content: '<div id="popover_struct">'+data[0]+'</div>'
        });
        var popover = $('#displayButton').data('bs.popover');
        // Fill 'To' timeselect
        popover.options.content('bum');
        $('.t_Start').append("<option>Bum</option>");
        //data[2].forEach(function(entry) {
        //    $('#tEndSelect').append('<option value="'+entry[0]+'">'+entry[1]+"</option>");
        });
        // Populate time field
};








// Render teacher select as SOL
$(document).ready(function() {
    $('#teacherSelect').searchableOptionList({
        maxHeight: '300px',
        texts: {
            noItemsAvailable: 'No Teachers',
            selectAll: 'All',
            selectNone: 'None',
            searchplaceholder: 'Teachers'
        }
    });
});




// Event Listener for schedule loader on DOM render and view button click
$(document).ready(function() {
    // Sets default when visit page
    get_sched('week');
    $( "#dayLabel" ).click(function() {
        get_sched('day');
    });
    $( "#weekLabel" ).click(function() {
        get_sched('week');
    });
    $( "#monthLabel" ).click(function() {
        get_sched('month');
    });
});

// Retrieve Schedule & Schedule data
var get_sched = function(dwm) {
    $.ajax({
        method: "POST",
        url: "/calendarjs",
        data: { type: dwm }
    })
    .done(function( data ) {
        data = JSON.parse(data);
        if($ ('#schedContainer')) {
            $( "#schedContainer" ).remove();
        }
        $( ".calSched" ).append('<div id="schedContainer">'+data[0]+'</div>');
        if(dwm == 'day') {
            dayData(data[1]);
        } else if(dwm == 'week') {
            weekData(data[1]);
        } else if(dwm == 'month') {
            monthData(data[1]);
        }
    });
};

// Process extra data
var weekData = function(rawData) {
    // Get correct time span
    $( ".weekGrid" ).css('grid-template-rows', '20px repeat('+rawData+', 1fr)');
    for (i = 2; i < 9; i++) {
        for (j = 2; j < (rawData+2); j++) {
            var name = 'ts'+i+j;
            $('[name=wkCol'+i+']').after('<div class="timeSlot timeSlot'+((j-1) % 4)+'" name="'+name+'"</div>');
            $('[name='+name+']').css({'grid-area': j+' / '+i+' / '+(j+1)+' / '+(i+1)+''});
        }
    }
};