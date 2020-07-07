// Contains all calendar data. Initial draw via GET[]
var Calendar = /* @class */ (function () {
    var self = '';
    // Class data pool
    function Calendar(initData) {
        this.timeSpectrum = [[2, '00:00'], [3, '00:15'], [4, '00:30'], [5, '00:45'], [6, '01:00'], [7, '01:15'], [8, '01:30'], [9, '01:45'], [10, '02:00'], [11, '02:15'], [12, '02:30'], [13, '02:45'], [14, '03:00'], [15, '03:15'], [16, '03:30'], [17, '03:45'], [18, '04:00'], [19, '04:15'], [20, '04:30'], [21, '04:45'], [22, '05:00'], [23, '05:15'], [24, '05:30'], [25, '05:45'], [26, '06:00'], [27, '06:15'], [28, '06:30'], [29, '06:45'], [30, '07:00'], [31, '07:15'], [32, '07:30'], [33, '07:45'], [34, '08:00'], [35, '08:15'], [36, '08:30'], [37, '08:45'], [38, '09:00'], [39, '09:15'], [40, '09:30'], [41, '09:45'], [42, '10:00'], [43, '10:15'], [44, '10:30'], [45, '10:45'], [46, '11:00'], [47, '11:15'], [48, '11:30'], [49, '11:45'], [50, '12:00'], [51, '12:15'], [52, '12:30'], [53, '12:45'], [54, '13:00'], [55, '13:15'], [56, '13:30'], [57, '13:45'], [58, '14:00'], [59, '14:15'], [60, '14:30'], [61, '14:45'], [62, '15:00'], [63, '15:15'], [64, '15:30'], [65, '15:45'], [66, '16:00'], [67, '16:15'], [68, '16:30'], [69, '16:45'], [70, '17:00'], [71, '17:15'], [72, '17:30'], [73, '17:45'], [74, '18:00'], [75, '18:15'], [76, '18:30'], [77, '18:45'], [78, '19:00'], [79, '19:15'], [80, '19:30'], [81, '19:45'], [82, '20:00'], [83, '20:15'], [84, '20:30'], [85, '20:45'], [86, '21:00'], [87, '21:15'], [88, '21:30'], [89, '21:45'], [90, '22:00'], [91, '22:15'], [92, '22:30'], [93, '22:45'], [94, '23:00'], [95, '23:15'], [96, '23:30'], [97, '23:45'], [98, '00:00']];
        this.daySpectrum = {0: ['Mon', 'monday'], 1: ['Tue', 'tuesday'], 2: ['Wed', 'wednesday'], 3: ['Thu', 'thursday'], 4: ['Fri', 'friday'], 5: ['Sat', 'saturday'], 6: ['Sun', 'sunday']};
        // Data from ajax GET
        this.classData = initData;
        // SOLS
        this.solData = {};
        // Current View Data
        this.currentData = {};
        // Alternative selector for scope
        self = this;
    }
    /* TEMPLATE METHOD */
    // Method to return requested template
    Calendar.prototype.getTemplate = function (dwd) {
        if($ ('#schedContainer')) {
            $( "#schedContainer" ).remove();
        }
        if(dwd == 'day') {
            $( ".calSched" ).append('<div id="schedContainer">'+this.classData['templates'][0]+'</div>');
        } else if(dwd == 'week') {
            $( ".calSched" ).append('<div id="schedContainer">'+this.classData['templates'][1]+'</div>');
        } else {
            $( ".calSched" ).append('<div id="schedContainer">'+this.classData['templates'][2]+'</div>');
        }
    };

    /* DISPLAY METHODS */
    // Method to process and return time list for left time column
    Calendar.prototype.addTimeColumn = function (view) {
        var firstCol = '';
        if (view == 'day') {
            firstCol = 'notes';
        } else if (view == 'week') {
            firstCol = 'wkCol2';
        }
        var start = this.classData['time'][0];
        var end = this.classData['time'][1];
        function filterTime(item) {
            if (item[0] > start+3 && item[0] < end-3) {
                return true;
            }
        }
        var newTime = this.timeSpectrum.filter(filterTime);
        k = 2;
        newTime.forEach(function(entry) {
            if ((k-2) % 4 == 0) {
            var tagName = 'timeTag'+entry[0];
                $('[name='+firstCol+']').before('<div class="timeTag" name="'+tagName+'">'+entry[1]+'</div>');
                $('[name='+tagName+']').css({'grid-area': (k+2)+' / 1 / '+(k+6)+' / 2'});
            }
            k ++;
        });
    };
    // Method to process time for main grid-block values
    Calendar.prototype.addGridTimes = function (dw) {
        columns = this.currentData['colInfo'];
        rows = this.classData['time'][1] - this.classData['time'][0];
        start = this.classData['time'][0];
        currentSlotData = [];
        // DAY
        if(dw == 'day') {
            $( ".dayGrid" ).css('grid-template-rows', '20px repeat('+rows+', 1fr)');
        // WEEK
        } else if(dw == 'week') {
            $( ".weekGrid" ).css('grid-template-rows', '20px repeat('+rows+', 1fr)');
            for (var i = 2; i < columns.length + 2; i++) {
                var colData = columns[i-2][2];
                for (var j = 2; j < (rows+2); j++) {
                    var name = 'ts'+i+j;
                    var time = this.timeSpectrum[(start+j-4)][1];
                    $('[name=wkCol'+(i+1)+']').before('<div class="timeSlot timeSlot'+((j-1) % 4)+'" name = "'+name+'" data-col="'+colData+'" data-row="'+time+'"</div>');
                    $('[name='+name+']').css({'grid-area': j+' / '+i+' / '+(j+1)+' / '+(i+1)+''});
                    currentSlotData.push({'slotID': name, 'slotDate': colData, 'slotTime': time});
                }
            }
        }
        this.currentData['currentSlots'] = currentSlotData;
    };
    Calendar.prototype.yankify = function(date) {
        return new Date(date.slice(3,6)+date.slice(0,3)+date.slice(6));
    };
    Calendar.prototype.chooseFwd = function(date) {
        var picked = this.classData['datePicked'];
        if (picked === 'today') {
            picked = moment().format('L');
        }
        picked = this.yankify(picked);
        if (this.classData['dwd'] === 'week') {
            return this.yankify(moment(picked).add(7, 'days').format('L'));
        } else if (this.classData['dwd'] === 'day') {
            return this.yankify(moment(picked).add(1, 'days').format('L'));
        }
    };
    Calendar.prototype.chooseBwd = function(date) {
        var picked = this.classData['datePicked'];
        if (picked === 'today') {
            picked = moment().format('L');
        }
        picked = this.yankify(picked);
        if (this.classData['dwd'] === 'week') {
            return this.yankify(moment(picked).subtract(7, 'days').format('L'));
        } else if (this.classData['dwd'] === 'day') {
            return this.yankify(moment(picked).subtract(1, 'days').format('L'));
        }
    };
    Calendar.prototype.parseDate = function(date) {
        const today = moment().format('L');
        var picked = moment(date).format('L');

        if (today == picked) {
            picked = 'today';
        }
        if (picked == this.classData['datePicked']) {
            return 'same';
        } else {
            this.classData['datePicked'] = picked;
            return {'type': 'newDate', 'datePicked': picked};
        }
    };

    // Applies dates to calendar / individual columns where neccessary
    Calendar.prototype.getColumns = function(dw) {
        // get day selected num
        var date = this.classData['datePicked'];
        if(date == 'today') {
            date = moment().format('L');
        }
        dateSelected = new Date(date.slice(3,6)+date.slice(0,3)+date.slice(6));
        dayNum = parseInt(moment(dateSelected).format('e'));
        var columns = [];
        if (dw == 'day') {
            columns = []
        } else if (dw == 'week') {
            // assign column headings for surrounding dates
            for (var i = 0; i < 7; i++) {
                if (i < dayNum) {
                    var temp = moment(dateSelected).subtract((dayNum - i), 'days');
                    columns.push([temp.format('ddd'), temp.format('D/M'), temp.format('L')]);
                } else if (i > dayNum) {
                    temp = moment(dateSelected).add((i - dayNum), 'days');
                    columns.push([temp.format('ddd'), temp.format('D/M'), temp.format('L')]);
                } else {
                    temp = moment(dateSelected);
                    columns.push([temp.format('ddd'), temp.format('D/M'), temp.format('L')]);
                }
            }
        }
        this.currentData['colInfo'] = columns;
        return columns;
    };

    Calendar.prototype.renderColumns = function(columns) {
        for (var i = 0; i < 7; i++) {
            $("div.colHeader[customattrib='"+i+"']").text(columns[i][0]+' '+columns[i][1]);
        }
    };

    Calendar.prototype.getDateSpan = function(columns) {
        var dateSpan = {'start': columns[0][2], 'end': columns[6][2]};
        this.currentData['dateSpan'] = dateSpan;
        return dateSpan;
    };

    // Method to set 'from' and 'to' time parameters on display page
    Calendar.prototype.setTimeSelects = function() {
        $('#tStartSelect option[value='+this.classData['time'][0]+']').attr('selected','selected');
        $('#tEndSelect option[value='+this.classData['time'][1]+']').attr('selected','selected');
    };
    /* FUNCTIONALITY METHODS */
    // Method to enable display-time select auto adjust
    Calendar.prototype.timeSelectAdjust = function(startEnd, startObj, endObj) {
        var startVal = parseInt(startObj.val());
        var endVal = parseInt(endObj.val());
        if (startEnd === 'start') {
            if (startVal >= endVal) {
                endVal = startVal + 4;
                endObj.find('option').attr('selected', false);
                endObj.find('option[value=' + endVal + ']').attr('selected', 'selected');
            }
        } else if (startEnd === 'end') {
            if (endVal <= startVal) {
                startVal = endVal - 4;
                startObj.find('option').attr('selected', false);
                startObj.find('option[value=' + startVal + ']').attr('selected', 'selected');
            }
        }
        if(startObj[0].id == 'tStartSelect') {
            this.classData['time'][0] = startVal;
            this.classData['time'][1] = endVal;
        }
        return {'type': 'timePref', 'from': startVal, 'to': endVal};
    };
    /* SOL FIELD POPULATIONS */
    // Method to fill teacher SOL
    Calendar.prototype.createTeacherSols = function() {
        var selects = this.classData['teachersSelectedDay'];
        var teachersDay = this.classData['teacherListDay'];
        var teachersWeek = this.classData['teacherListWeek'];
        // Pre selects those who are selected for day view
        teachersDay.forEach(function(entry) {
            if(selects.includes(entry['value'])) {
            } else {
                 delete entry.selected;
            }
        });
        this.solData['teacherSolDay'] = $('#teacherSelectDay').searchableOptionList({
            maxHeight: '300px',
            texts: {
                noItemsAvailable: 'No Teachers',
                selectAll: 'All',
                selectNone: 'None',
                searchplaceholder: 'Teachers'
            },
            data: teachersDay
        });
        this.solData['teacherSolWeek'] = $('#teacherSelectWeek').searchableOptionList({
            maxHeight: '300px',
            texts: {
                noItemsAvailable: 'No Teachers',
                searchplaceholder: 'Teachers'
            },
            data: teachersWeek
        });
    };
    // Method to retrieve teachers selected for db update
    Calendar.prototype.getTeacherSelectsDay = function() {
        var selectList = [];
        var selections = this.solData['teacherSolDay'].getSelection();
        for (var i = 0; i < selections.length; i++) {
            selectList.push(selections[i].value);
        }
        var stringRep = '['+selectList.toString()+']';
        // Only pass data if change
        if(stringRep == this.classData['teachersSelectedDay']) {
            return 'same';
        } else {
            this.classData['teachersSelectedDay'] = stringRep;
            return {'type': 'teacherSelectsDay', 'selects': stringRep};
        }
    };
    // Method to retrieve teachers selected for db update
    Calendar.prototype.getTeacherSelectsWeek = function() {
        var selection = this.solData['teacherSolWeek'].getSelection();
        selected = parseInt(selection[0].value);
        // Only pass data if change
        if(selected == this.classData['teacherSelectedWeek']) {
            return 'same';
        } else {
            this.classData['teacherSelectedWeek'] = selected;
            return {'type': 'teacherSelectsWeek', 'selects': selected};
        }
    };
    // Method to fill centre SOl
    Calendar.prototype.createCentreSol = function() {
        var selects = this.classData['centresSelected'];
        var centres = this.classData['centreList'];
        //groupSelects = [];
        centres.forEach(function(entry) {
            entry["children"].forEach(function(subentry) {
                if(selects.includes(subentry['value'])) {
                    subentry.selected = true;
                }
            });
        });
        this.solData['centreSol'] = $('#centreSelect').searchableOptionList({
            maxHeight: '300px',
            texts: {
                noItemsAvailable: 'No Centres',
                selectAll: 'All',
                selectNone: 'None',
                searchplaceholder: 'Centres & Rooms'
            },
            data: centres,
        });
    };
    // Method to retrieve centres selected for db update
    Calendar.prototype.getCentreSelects = function() {
        var selectList = [];
        var selections = this.solData['centreSol'].getSelection();
        for (var i = 0; i < selections.length; i++) {
            selectList.push(selections[i].value);
        }
        var stringRep = '['+selectList.toString()+']';
        // Only pass data if change
        if(stringRep == this.classData['centresSelected']) {
            return 'same';
        } else {
            this.classData['centresSelected'] = stringRep;
            return {'type': 'centreSelects', 'selects': stringRep};
        }
    };
    // Loads new data into class variable.
    Calendar.prototype.calendarInfoLoader = function(calendarInfo) {
        this.currentData['calendarInfo'] = calendarInfo;
        dayIndex = {0: 'monday', 1: 'tuesday', 2: 'wednesday', 3: 'thursday', 4: 'friday', 5: 'saturday', 6: 'sunday'};
        calInfo = JSON.parse(calendarInfo);
        teachersSelected = this.classData['teacherSelectedWeek'];

        // Figure out whether at least 1 room from either centre is selected
        // gets list of centres
        var centres = [];
        var roomsToDisplay = {};
        var centresToDisplay = [];
        $.each(self.classData.uniqueCentreList, function(key, object) {
            centres.push(object.value);
        });
        this.classData['existingCentres'] = centres;

        // checks whether centre info should be displayed
        var selections = this.solData['centreSol'].getSelection();
        $.each(selections, function(key, object) {
            if(centres.includes(object.id)) {
                roomsToDisplay[object.id] = object.id;
            }
        });
        $.each(roomsToDisplay, function(key, value) {
            centresToDisplay.push(value);
        });
        this.currentData['centresToDisplay'] = centresToDisplay;

        columns = this.currentData['colInfo'];
        // check whether teacher is selected & centre(s)
        if (this.classData['dwd'] === 'week') {
            $.each(calInfo['availability'], function(key, availability) {
                if(availability.teacher_id === teachersSelected && centresToDisplay.includes(availability.centre)) {
                    // if so, render availability block
                    for(i = 0; i < 7; i++) {
                        if(availability[dayIndex[i]] == "true") {
                            $(".weekGrid [data-col='"+columns[i][2]+"']").each(function() {
                                // Compare times
                                slotIndex = self.timeSpectrum.findIndex(x => x[1] === $(this).data('row'));
                                startIndex = self.timeSpectrum.findIndex(x => x[1] === availability['start_time']);
                                endIndex = self.timeSpectrum.findIndex(x => x[1] === availability['end_time']);
                                if(slotIndex >= startIndex && slotIndex < endIndex) {
                                    self.renderAvailability($(this), availability);
                                }
                            });
                        }
                    }
                }
            });
        }
    };
    Calendar.prototype.renderAvailability = function(timeSlot, availability) {
        $(timeSlot).addClass("availability");
        $(timeSlot).attr({"data-teacherID": availability['teacher_id'], "data-availabilityID": availability['availability_id']});
    };
    Calendar.prototype.hideSol = function(dw) {
        if (dw == 'week') {
            $('#calTeacherSelectDay').css({'display': 'none'});
            $('#calTeacherSelectWeek').css({'display': 'inline-block'});
        } else if (dw == 'day') {
            $('#calTeacherSelectDay').css({'display': 'inline-block'});
            $('#calTeacherSelectWeek').css({'display': 'none'});
        }
    };
    Calendar.prototype.removeForm = function(section) {
        $('.resizable').remove();
        if(section.length){
            section.remove();
        }
    };
    Calendar.prototype.buildAvailabilityInput = function() {
        if($('#availGrid').length === 0) {
            $( ".calInputField" ).append(this.classData['templates'][3]);
            teachersSingle = this.classData['teacherListSingle'];
            centresSingle = this.classData['uniqueCentreList'];
            // SET DEFAULT SELECTIONS
            if(teachersSingle.length > 0) {
                if (this.classData['dwd'] === 'week') {
                    $.each(teachersSingle, function(key, object) {
                        if (object.value == self.classData.teacherSelectedWeek) {
                            object['selected'] = 'true';
                            self.currentData['availTeacher'] = object;
                        }
                    })
                } else {
                    teachersSingle[0]['selected'] = 'true';
                    self.currentData['availTeacher'] = teachersSingle[0];
                }
            }
            if(centresSingle.length > 0) {
                centresSingle[0]['selected'] = 'true';
                self.currentData['availCentre'] = centresSingle[0];
            }
            const today = moment().format('L');
            $('#startDateInput').val(today);
            $('#endDateInput').val(today);
            const day = moment().format('ddd');
            $('.availCheck'+day+' input')[0].checked = 'true';
            // Set default selection of times to within current display
            var startTimeVal = this.classData['time'][0];
            $('#availTimeStart').find('option[value=' + startTimeVal + ']').attr('selected', 'selected');
            $('#availTimeEnd').find('option[value=' + (startTimeVal + 4) + ']').attr('selected', 'selected');

            this.solData['teacherSolSingle'] = $('#teacherSelectSingle').searchableOptionList({
                maxHeight: '300px',
                texts: {
                    noItemsAvailable: 'No Teachers',
                    searchplaceholder: 'Teachers'
                },
                data: teachersSingle
            });
            this.solData['centreSolSingle'] = $('#centreSelectSingle').searchableOptionList({
                maxHeight: '300px',
                texts: {
                    noItemsAvailable: 'No Centres',
                    searchplaceholder: 'Centres'
                },
                data: centresSingle
            });
        }
    };
    Calendar.prototype.submitAvailabilityForm = function() {
        startTime = this.timeSpectrum[$('#availTimeStart').val() - 2][1];
        endTime = this.timeSpectrum[$('#availTimeEnd').val() - 2][1];
        startDate = $('#startDateInput').val();
        endDate = $('#endDateInput').val();
        startDateY = new Date(startDate.slice(3,6)+startDate.slice(0,3)+startDate.slice(6)+' '+startTime+':00');
        endDateY = new Date(endDate.slice(3,6)+endDate.slice(0,3)+endDate.slice(6)+' '+endTime+':00');
        if (startDateY == 'Invalid Date' || endDateY == 'Invalid Date') {
            alert('Invalid Date');
        } else if (startDateY >= endDateY) {
            alert('Error: Set end time after start time.');
        } else {
            data = {};
            var Tselection = this.solData['teacherSolSingle'].getSelection();
            var Cselection = this.solData['centreSolSingle'].getSelection();
            data['teacher_id'] = parseInt(Tselection[0].value);
            data['centre'] = (Cselection[0].value);
            data['start_date'] = startDate;
            data['end_date'] = endDate;
            data['start_time'] = startTime;
            data['end_time'] = endTime;
            for (i = 0; i < 7; i++) {
                if ($('.availCheck'+this.daySpectrum[i][0]+' input')[0].checked) {
                    data[this.daySpectrum[i][1]] = 'true';
                } else {
                    data[this.daySpectrum[i][1]] = 'false-';
                }
            }
            return {'type': 'availability', 'data': data};
        }
    };
    Calendar.prototype.availabilityUpdate = function() {
        var Tselection = parseInt(this.solData['teacherSolSingle'].getSelection()[0].value);
        var Cselection = this.solData['centreSolSingle'].getSelection()[0].value;
        $.each(this.classData['teacherListSingle'], function(key, object) {
            if (object.value === Tselection) {
                self.currentData['availTeacher'] = object;
            }
        });
        $.each(this.classData['uniqueCentreList'], function(key, object) {
            if (object.value === Cselection) {
                self.currentData['availCentre'] = object;
            }
        });
    };
    Calendar.prototype.availabilityFocus = function(origin) {
        $('.resizable').remove();
        var rows = this.classData['time'][1] - this.classData['time'][0];
        if(origin == 'form') {
            var gridSpacing = 400 / rows;
            var timeParameter = this.classData['time'][0];
            var availTimespan = 0;
            var prevTimespan = 0;
            var startTimeVal = $('#availTimeStart').val();
            var endTimeVal = $('#availTimeEnd').val();
            var startTime = self.timeSpectrum[startTimeVal - 2][1];
            var endTime = self.timeSpectrum[endTimeVal - 2][1];
            var startDate = this.yankify($('#startDateInput').val());
            var endDate = this.yankify($('#endDateInput').val());
            var firstName = this.currentData.availTeacher.label.split(' ').slice(0, -1).join(' ');
            var centre = this.currentData.availCentre.label;

            var colInfo = [];
            $.each(this.currentData['colInfo'], function(key, dateShown) {
                colInfo.push(self.yankify(dateShown[2]));
            });

            //figure out which columns to fill
            for (i = 0; i < 7; i++) {
                if ($('.availCheck'+this.daySpectrum[i][0]+' input')[0].checked && colInfo[i] >= startDate && colInfo[i] <= endDate) {
                    $('.'+this.daySpectrum[i][1]+'Col').append('<div class="resizable"><div class="availTop"></div><div class="availText"></div><div class="availText2"></div><div class="availBottom"></div></div>');
                }
            }

            // for each dom element within availability paramenters, create new extendable floating item
            $('.resizable').css({'top': 0 + (gridSpacing * (startTimeVal - timeParameter)), 'height': gridSpacing * (endTimeVal - startTimeVal)}); // start position of availability
            $(".availText").text(`${startTime} - ${endTime}`);
            $(".availText2").text(`${firstName} - ${centre}`);
            $( function() {
                $( ".resizable" ).resizable({
                    containment: "parent",
                    handles: "n, s",
                    grid: gridSpacing,
                    minHeight: 1,
                    resize: function(e, ui){
                      	var actualHeight = ui.size.height;
                      	var actualTop = ui.position.top;
                      	availTimespan = Math.round(actualHeight / gridSpacing);
                      	prevTimespan = Math.round(actualTop / gridSpacing);
                      	startTimeVal = timeParameter + prevTimespan;
                      	endTimeVal = timeParameter + prevTimespan + availTimespan;
                        startTime = self.timeSpectrum[startTimeVal - 2][1];
                        endTime = self.timeSpectrum[endTimeVal - 2][1];
                      	$(".availText").text(`${startTime} - ${endTime}`);
                      	// Resizes mirrors
                      	$('.resizable').css({'top': $(this)[0].style.top, 'height': $(this).height()});
                    },
                    stop: function(e, ui){
                      	$('#availTimeStart').find('option[value=' + startTimeVal + ']').attr('selected', 'selected');
                      	$('#availTimeEnd').find('option[value=' + endTimeVal + ']').attr('selected', 'selected');
                    }
                });
            });
        }
    };
    // Floating submenu for ADD button - availability / appointments
    Calendar.prototype.addSubmenu = function() {
        $('.mondayHead').append('<div id="addSubmenu"><div id="subAvailability"><a>Add Availability</a></div><div id="subAppointment"><a>Add Appointment</a></div></div>');
    };
    Calendar.prototype.removeSubmenu = function() {
        $('#addSubmenu').remove();
    };
    return Calendar;
}());

