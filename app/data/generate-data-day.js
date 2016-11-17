var moment = require('../../bower_components/moment/moment.js');
// Configure Moment.js to start the week on Monday.
moment.locale('en');

var day;
var isoDate = moment();

if (process.argv.length == 3) {
    if(!moment(process.argv[2]).isValid()) {
        console.log('Usage: node generate-data.js <date YYYY-MM-DD>');
        process.exit(1);
    } else {
        day = process.argv[2];
        isoDate = moment(day);
    }
} else {
    day = moment(isoDate).format('YYYY-MM-DD');
}
console.log('Generating for date: ' + day);


var sports = [
    {
        name: 'running',
        distance: {
            min: 3000,
            max: 21100
        },
        duration: {
            min: 25 * 60,
            max: 125 * 60
        },
        kcalPerHour: 900,
        applyAltitude: true
    }, {
        name: 'swimming',
        distance: {
            min: 500,
            max: 750
        },
        duration: {
            min: 30 * 60,
            max: 60 * 60
        },
        kcalPerHour: 500,
        applyAltitude: false
    }, {
        name: 'tennis',
        distance: {
            min: 0,
            max: 0
        },
        duration: {
            min: 25 * 60,
            max: 50 * 60
        },
        kcalPerHour: 570,
        applyAltitude: false
    }
];

var metrics = [
    {
        name: 'heart rate',
        value: {
            min: 55,
            max: 200
        },
        unit: "bpm"
    }, {
        name: 'sp02',
        value: {
            min: 50,
            max: 100
        },
        unit: "%"
    }, {
        name: 'temperature',
        value: {
            min: 35,
            max: 43
        },
        unit: "celsius"
    }, {
        name: 'diastolic',
        value: {
            min: 80,
            max: 120
        },
        unit: "mmHg"
    }, {
        name: 'systolic',
        value: {
            min: 70,
            max: 100
        },
        unit: "mmHg"
    }, {
        name: 'weight',
        value: {
            min: 2,
            max: 12
        },
        unit: "kg"
    }, {
        name: 'height',
        value: {
            min: 45,
            max: 80
        },
        unit: "meter"
    }, {
        name: 'calories',
        value: {
            min: 1800,
            max: 2500
        },
        unit: "cal"
    }
];


var sleep =
    {
        name: 'sleep',
        value: {
            min: 480,
            max: 960
        },
        unit: "minutes"
    };

function randomItem(arr) {
    return arr[Math.round(Math.random() * (arr.length - 1))];
}

function random(itemWithMinMax) {
    var result = Math.round(itemWithMinMax.max * Math.random());
    result = Math.max(itemWithMinMax.min, result);
    return result;
}

function randomMoment(day) {
    return day
        .clone()
        .add(Math.round(Math.random() * 60 * 60 * 1000), 'milliseconds');
}

function createWorkout(sport, day) {
    var duration = random(sport.duration);
    var distance = random(sport.distance);
    var avgPace = distance === 0 ? 0 : Math.round(duration / (distance / 1000));
    var result = {
        date: randomMoment(day),
        sport: sport.name,
        distance: distance,
        duration: duration,
        weather: randomItem([ "Rain", "Dry", "Fog" ]),
        humidity: 5,
        temperature: Math.round(Math.random() * 5 + 15),
        calories: Math.round(duration / 60 / 60 * sport.kcalPerHour),
        avgPace: avgPace,
        maxPace: avgPace + Math.round(Math.random() * 60),
        minAlt: 103,
        maxAlt: 122,
        ascent: -19,
    };
    if (sport.applyAltitude) {
        var labels = [];
        for (var i = 0; i <= distance / 1000; i += distance / 1000 / 6) {
            labels.push(i.toFixed(1) + ' km');
        }
        result.speedData = {
            speed: [Math.round(Math.random() * 3 + 8), 9, 8, Math.round(Math.random() * 3 + 8), 10, 11, Math.round(Math.random() * 3 + 9)],
            altitude: [100, 103, 104, 113, 103, 92, 81],
            labels: labels
        };
    }

    return result;
}


function createMetric(day) {
    var results = [];
    //Add at least one of each sport.
    for (var i = 0; i < metrics.length; i++) {
        var measurement = {
            date: randomMoment(day),
            type: metrics[i].name,
            value: random(metrics[i].value),
            unit: metrics[i].unit
        }
        results.push(measurement);
    }
    return results;
}


function createBody(day) {
    var result = createMetric(day);
    return result;
}

function createSleep(day) {
    var result = {
        date: randomMoment(day),
        type: sleep.name,
        value: random(sleep.value),
        unit: sleep.unit
    }
    
    return result;
}

var result = {
    date: (process.argv[2] != undefined ) ? process.argv[2] : moment().format('YYYY-MM-DD'),
    device: {
        "id": "1",
        "type": "TRACKER",
        "battery": "High",
        "version": "MobileTrack",
        "lastSyncTime": moment(),
        "status": "active"
    },
    data: {
        body: [],
        sleep: []
    }
};


//var monday = moment('2015-W' + result.weekNumber).startOf('week');

// Add at least one of each sport.
// for (var i = 0; i < sports.length; i++) {
//     result.data.push(createWorkout(sports[i], isoDate));
// }

// Add random workouts.
// var numberOfWorkouts = Math.round(Math.random() * 10 + 10);
// for (var i = 0; i < numberOfWorkouts; i++) {
//     result.data.push(createWorkout(randomItem(sports), isoDate));
// }

var body = [];
var numberOfMeasurements = 10; //Math.round(Math.random() * 10 + 10);
for (var i = 0; i < numberOfMeasurements; i++) {
    body.push(createBody(isoDate));
}
result.data.body = body;

var sleeps = [];
var numberOfSleeps = Math.round(Math.random() * 10 + 10);
for (var i = 0; i < numberOfSleeps; i++) {
    sleeps.push(createSleep(isoDate));
}
result.data.sleep = sleeps;
    
    
console.log(JSON.stringify(result, undefined, '\t'));
