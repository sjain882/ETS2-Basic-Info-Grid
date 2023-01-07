
var restMessage = '';
var driverWorkTime;
var driverSleepTime;
var roadTimeScale = 19;


function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}


Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {

    // skinConfig - a copy of the skin configuration from config.json
    // utils - an object containing several utility functions (see skin tutorial for more information)

    // this function is called before everything else, 
    // so you may perform any DOM or resource initializations / image preloading here

    /*
    utils.preloadImages([
        'images/bg-off.jpg', 'images/bg-on.jpg'
    ]); 
    */


    // WIP: Click entire page to switch pages
/*     $(document).add('body').on('click', function () {
        var elem = document.body; // Make the body go full screen.
        requestFullScreen(elem);
    }); */
    
}

Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {

    // data - telemetry data JSON object
    // utils - an object containing several utility functions (see skin tutorial for more information)

    // Called on each json / telemetry data update
    // You can change existing values in data here or add new ones (subclass values, or new classes entirely)
    // data subclasses are the same as the json output classes, e.g., the following json:
    // "truck": {
    //     "id": "man",
    // becomes
    // data.truck.id == "man";

    // * - The C# server code is doing conversions here (atleast for TelemetryServer4)

    // currentSpeed gear
    // TelemetryServer4 already accounts for all types of shifter (& gearbox?) and adds a special readable "Name" field.
    // data.truck.gearName;
    
    // Displayed gear
    // data.truck.displayedGearName;

    // Shifter gear group (false: Lower 1-6 / true: Upper 7-12)
    var shifterGroupIndicator = document.getElementById("shifterGroupIndicator");
    if (data.shifter.selector == 1) {
        data.shifter.shifterGroupReadable = "High";
        shifterGroupIndicator.style.color = "#00ff00";
    } else {
        data.shifter.shifterGroupReadable = "Low";
        shifterGroupIndicator.style.color = "#fb8c00";
    }

    /* Not working
        var shifterGroupIndicator = document.getElementById("shifterGroupIndicator");
    if (data.shifter.shifterGroup) {
        data.shifter.shifterGroupReadable = "High";
        shifterGroupIndicator.style.color = "#00ff00";
    } else {
        data.shifter.shifterGroupReadable = "Low";
        shifterGroupIndicator.style.color = "#fb8c00";
    }
    */

    // Shifter gear range (false: Low 1L / true: High 1H)
    /* if (data.shifter.shifterRange) {
        data.shifter.shifterRangeReadable = "High";
    } else {
        data.shifter.shifterRangeReadable = "Low";
    } */

    // Retarder
    // data.truck.retarderBrake;

    // Retarder step
    // data.truck.retarderBrakeIndicator;
    var retarderBrakeIndicator = document.getElementById("retarderBrakeIndicator");
    if (data.truck.retarderBrake > 0) {
        retarderBrakeIndicator.style.display = "block";
    } else {
        retarderBrakeIndicator.style.display = "none";
    }

    // Engine brake readable
    // data.truck.motorBrakeOnReadable = data.truck.motorBrakeOn ? "On" : "Off";


    // Engine brake enabled indicator
    var engineBrakeIndicator = document.getElementById("engineBrakeIndicator");
    if (data.truck.motorBrakeOn) {
        engineBrakeIndicator.style.display = "block";
    } else {
        engineBrakeIndicator.style.display = "none";
    }

    // --- MPH ---
    // Truck speed mph rounded (* kmh -> mph)
    data.truck.speedRoundedMph = Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed)) * 0.621371;

    // Road speed limit mph rounded (* kmh -> mph)
    data.navigation.speedLimitRoundedMph = Math.abs(data.navigation.speedLimit > 0
        ? Math.floor(data.navigation.speedLimit)
        : Math.round(data.navigation.speedLimit)) * 0.621371;

    // Cruise control speed mph rounded (* kmh -> mph)
    data.truck.cruiseControlSpeedRoundedMph = Math.abs(data.truck.cruiseControlSpeed > 0
        ? Math.floor(data.truck.cruiseControlSpeed)
        : Math.round(data.truck.cruiseControlSpeed)) * 0.621371;


    // --- KPH ---
    // Truck speed kmh rounded
    data.truck.speedRounded = Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed));

    // Road speed limit kmh rounded
    data.navigation.speedLimitRounded = Math.abs(data.navigation.speedLimit > 0
        ? Math.floor(data.navigation.speedLimit)
        : Math.round(data.navigation.speedLimit));

    // Cruise control speed kmh rounded
    data.truck.cruiseControlSpeedRounded = Math.abs(data.truck.cruiseControlSpeed > 0
        ? Math.floor(data.truck.cruiseControlSpeed)
        : Math.round(data.truck.cruiseControlSpeed));


    // Dynamic speed limit indicator mph (adds more vertical bars (with gaps) the more you are speeding)
    var overspeedLevel1 = document.getElementById("overspeedLevel-1");
    var overspeedLevel2 = document.getElementById("overspeedLevel-2");
    var overspeedLevel3 = document.getElementById("overspeedLevel-3");
    if (data.navigation.speedLimit > 0) {

        // Speeding +1mph
        if (Math.floor(data.truck.speedRoundedMph) > data.navigation.speedLimitRoundedMph) {
            overspeedLevel1.style.display = "block";
            overspeedLevel2.style.display = "none";
            overspeedLevel3.style.display = "none";
        // Speeding +2mph
        }
        if (Math.floor(data.truck.speedRoundedMph) > data.navigation.speedLimitRoundedMph + 1) {
            overspeedLevel1.style.display = "block";
            overspeedLevel2.style.display = "block";
            overspeedLevel3.style.display = "none";
        // Speeding +3mph
        }
        if (Math.floor(data.truck.speedRoundedMph) > data.navigation.speedLimitRoundedMph + 2) {
            overspeedLevel1.style.display = "block";
            overspeedLevel2.style.display = "block";
            overspeedLevel3.style.display = "block";
        // Not speeding
        }
        if (Math.floor(data.truck.speedRoundedMph) <= data.navigation.speedLimitRoundedMph) {
            overspeedLevel1.style.display = "none";
            overspeedLevel2.style.display = "none";
            overspeedLevel3.style.display = "none";
        }
    // Not speeding
    } else {
            overspeedLevel1.style.display = "none";
            overspeedLevel2.style.display = "none";
            overspeedLevel3.style.display = "none";
    }
    
    
    // Cruise Control enabled indicator
    var cruiseControlIndicator = document.getElementById("cruiseControlIndicator");
    if (data.truck.cruiseControlOn) {
        cruiseControlIndicator.style.display = "block";
    } else {
        cruiseControlIndicator.style.display = "none";
        data.truck.cruiseControlSpeedRounded = "";
        data.truck.cruiseControlSpeedRoundedMph = "";
    }

    // Speed limit sign visibility
    var speedLimitSign = document.getElementById("speedLimitSign");
    var speedLimitSignMph = document.getElementById("speedLimitSignMph");
    if (data.navigation.speedLimit > 0) {
        speedLimitSign.style.opacity = 1;
        speedLimitSignMph.style.opacity = 1;
    } else {
        speedLimitSign.style.opacity = 0;
        speedLimitSignMph.style.opacity = 0;
    }

    /*

    // ----- jobmonitor2P Implementations -----

    // Time scale
    if (isNaN(driverWorkTime)) {
        if (data.game.gameName === 'ATS') {
            if (unit === '') { unit = 'mi'; }
            driverWorkTime = 14 * 60;             // ATS times - checked
            driverSleepTime = 10 * 60;
            roadTimeScale = 20;
        } else {
            if (unit === '') { unit = 'km'; }
            driverWorkTime = 11 * 60;             // ETS standard times
            driverSleepTime = 9 * 60;
            //driverWorkTime = 17 * 60;            // ETS Brazilian times 
            //driverSleepTime = 7 * 60;            // Yes, we overwork a lot to have a decent income. That's a huge problem.
            roadTimeScale = 19;
        }
    }

    // Whether we have a job or not
    if (data.job.jobMarket !== '' && !hasJob) {
        // Do something when job changed
        hasJob = true;
        if (data.job.deadlineTime === '0001-01-01T00:00:00Z') {
            // jobWoT = true;
        }
    } else if (data.job.jobMarket === '' && hasJob) {
        hasJob = false;
        // jobWoT = false;
    }
    data.hasJob = hasJob;

    // Are we in city limits?
    data.navigation.cityLimits = data.game.timeScale !== roadTimeScale ? 2 : 0;

    // Job viability
    remTime = new Date(data.job.remainingTime);
    remTime = Math.round((remTime - zDay) / 60000);
    var resTime = new Date(data.game.nextRestStopTime);
    resTime = Math.round((resTime - zDay) / 60000);
    var estTime = 0;
    var idleTime = 0;
    var overTime = 0;

    // At current speed
    data.navigation.currentSpeed = '--';
    data.navigation.currentSpeedEstimatedTime = '?';
    data.navigation.currentSpeedStopsNeeded = '--';
    data.navigation.currentSpeedStopsAvailable = '--';
    data.navigation.currentSpeedRemainingTime = '?';
    data.navigation.currentSpeedLeavingTime = '?';

    // Truck is stopped
    if (Math.round(data.truck.speed) === 0) {
        data.navigation.currentSpeed = 'stopped';
    // Truck is moving
    } else {
        data.navigation.currentSpeed = Math.round(data.truck.speed / 5) * 5;
        data.navigation.currentSpeed = data.navigation.currentSpeed < 5 ? 5 : data.navigation.currentSpeed;
        // If we haven't arrived already
        if (data.navigation.estimatedDistance > 0) {
            // ETA
            estTime = Math.round(3 * data.navigation.estimatedDistance / (50 * data.navigation.currentSpeed));
            data.navigation.currentSpeedEstimatedTime = estTime;
            // Overtime that will be required of you to complete this job
            overTime = estTime - resTime;
            // Available idle time
            idleTime = remTime - estTime;
            // If we have an active job
            if (data.hasJob) {
                data.navigation.currentSpeedStopsNeeded = overTime < 0 ? 0 : Math.ceil(overTime / driverWorkTime);
                data.navigation.currentSpeedStopsAvailable = idleTime < 0 ? 0 : Math.floor(idleTime / driverSleepTime);
                data.navigation.currentSpeedRemainingTime = idleTime - data.navigation.currentSpeedStopsNeeded * driverSleepTime;
            } else {
                data.navigation.currentSpeedStopsNeeded = '--';
                data.navigation.currentSpeedStopsAvailable = '--';
                data.navigation.currentSpeedRemainingTime = '--';
            }
            if (overTime < 0) { overTime += driverWorkTime; }
            // Departure time
            data.navigation.currentSpeedLeavingTime = (driverWorkTime - overTime % driverWorkTime) % driverWorkTime;
        }
        data.realEstimatedTime = estTime / roadTimeScale;
    }

    // Available rest stops
    data.restStops = '--';
    if (data.truck.speed > data.navigation.minimalSpeed) {
        data.restStops = data.navigation.actualStopsNeeded + '/' + data.navigation.actualStopsAvailable;
    } else {
        data.restStops = data.navigation.minimalStopsNeeded + '/' + data.navigation.minimalStopsAvailable;
    }

    // Fatigue time
    data.jobRemainingTime = data.job.remainingTime;
    t = new Date(data.game.nextRestStopTime);
    data.driverTimeTillRest = t.getUTCHours() * 60 + t.getUTCMinutes();
    data.driverTimeTillRest = isNaN(data.driverTimeTillRest) ? '--' : minsToReadableTime(data.driverTimeTillRest, utils);
    data.navigation.estimatedDistance = data.navigation.estimatedDistance > 300 ? Math.round(data.navigation.estimatedDistance / 1000) + ' ' + unit : '--';

    // Warning close to deadline
    // Adds a red box behind job time remaining text
    if (hasJob) {
        remTime = new Date(data.job.remainingTime);
        remTime = Math.round((remTime - zDay) / 60000);
        if (remTime === 0) {
            if (data.job.deadlineTime === '0001-01-01T00:00:00Z') {
            } else {
                remTime = new Date(zDay);
                t = (new Date(data.game.time) - new Date(data.job.deadlineTime)) / 60000;
                remTime.setUTCMinutes(remTime.getUTCMinutes() + (new Date(data.game.time) - new Date(data.job.deadlineTime)) / 60000);
                data.job.remainingTime = JSON.stringify(remTime).replace(/"/g, '');
                $('td.PrincipalRemaining').css('animation', '');
                $('td.PrincipalRemaining').css('color', '#a00');
                message += '<font style="color: #a00;">' + tDeliveryOverdue + '</font>' + lb;
            }
        } else if (remTime < 60) {
            $('td.PrincipalRemaining').css('animation', 'RedAlert 2s ease infinite alternate');
            $('td.PrincipalRemaining').css('color', '#a00');
            message += '<font style="color: #a00;">' + tDeliveryLast1h + '</font>' + lb;
            if (data.navigation.minimalSpeed > 0) {
                message += data.navigation.minimalSpeed < 60 ?
                    '<font style="color: #abdb30;">' + tScheduleOk + '</font>' + lb :
                    '<font style="color:#ff6b6b;">' + tSpeedUp + '</font>' + lb;
            }
        } else if (remTime < 120) {
            $('td.PrincipalRemaining').css('animation', 'YellowAlert 4s ease infinite');
            $('td.PrincipalRemaining').css('color', '#f7ff04');
            message += tDeliveryLast2h + lb;
            if (data.navigation.minimalSpeed > 0) {
                message += data.navigation.minimalSpeed < 60 ?
                    '<font style="color: #abdb30;">' + tScheduleOk + '</font>' + lb :
                    '<font style="color:#ff6b6b;">' + tSpeedUp + '</font>' + lb;
            }
        } else {
            $('td.PrincipalRemaining').css('animation', '');
            $('td.PrincipalRemaining').css('color', '#f0e6d2');
        }
    } else {
        $('td.PrincipalRemaining').css('animation', '');
        $('td.PrincipalRemaining').css('color', '#f0e6d2');
    }

    // Rest messages - suggestions
    if (data.driverTimeTillRest < 60) {
        message += '<font style="color: #f00;">' + tYouNeedRest + '</font>' + lb;
    } else if (data.driverTimeTillRest < 120) {
        message += '<font style="color: #f0e6d2;">' + tGoodTimeRest + '</font>' + lb;
    } else if (data.driverTimeTillRest < 300) {
        message += '<font style="color: #f0e6d2;">' + tRestIfWish + '</font>' + lb;
    } else if (data.driverTimeTillRest < 480) {
        message += '<font style="color: #f0e6d2;">' + tDontNeedRest + '</font>' + lb;
    } else {
        message += '<font style="color: #f0e6d2;">' + tDontNeedRest + '</font>' + lb;
    }

    // Not enough time to rest
    if (data.remainingJobTime < 480) {
        message += '<font style="color: #f0e6d2;">' + tDoNotRest + '</font>' + lb;
    }

    // Rest messages - based on remaining stops - overrides above
    // 1h till rest and stops available
    if (data.driverTimeTillRest < 60) {
        if (data.navigation.minimalStopsAvailable > 0) {
            // Rest at next stop
        }

        if (data.truck.engineRpm !== 0 && data.navigation.minimalStopsAvailable > 0) {
            message += '<font style="color: #f00;">' + tRestNextStop + '</font>' + lb;
            if (data.navigation.newMinimalSpeed < 60) { message += '<font style="color: #abdb30;">' + tScheduleSeemsGood + '</font>' + lb; }
        }
    } else if (data.driverTimeTillRest < 120) {
        if (data.navigation.minimalStopsAvailable > 0) $('td.PrincipalFatigue').css('animation', 'YellowAlert 2s ease infinite');
        $('td.PrincipalFatigue').css('color', '#aa0');
        $('g.PrincipalFatigue').css('fill', '#aa0');
        if (data.truck.engineRpm !== 0 && data.navigation.minimalStopsAvailable > 0) {
            message += tConsiderStop + lb;
            if (data.navigation.newMinimalSpeed < 60) { message += '<font style="color: #abdb30;">' + tScheduleSeemsGood + '</font>' + lb; }
        }
    } else {
        $('td.PrincipalFatigue').css('animation', '');
        $('td.PrincipalFatigue').css('color', '#f0e6d2');
        $('g.PrincipalFatigue').css('fill', '#00a000');
    }




    data.restMessage = restMessage;
    restMessage = '';

    */

    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {

    // data - telemetry data JSON object AFTER processing from filter function
    // utils - an object containing several utility functions (see skin tutorial for more information)

    // we don't have anything custom to render in this skin,
    // but you may use jQuery here to update DOM or CSS
}