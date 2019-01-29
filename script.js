/*
ID BLE Devices
*/
var NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

var btServer = undefined;
var txCharacteristic = undefined;
var rxCharacteristic;
var rxCharacteristic2;

var currentdate = new Date();
var dateFormat = 'MMMM DD YYYY';
var date = currentdate.getHours()+ ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
var data = [];
var labels = [date];

var connection = {
    on : function(evt,cb) { this["on"+evt]=cb; },
    emit : function(evt,data) { if (this["on"+evt]) this["on"+evt](data); },
    isOpen : false,
    isOpening : true,
    txInProgress : false
};

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function function_scaneDev() {
    console.log("Click scane button");
    navigator.bluetooth.requestDevice({
        filters: [
            { namePrefix: 'Puck.js' },
            { namePrefix: 'Pixl.js' },
            { namePrefix: 'berecz' },
            { namePrefix: 'EspruinoHub' }
            //{ services: [NORDIC_SERVICE] }
        ],
    })
    .then(device => {
        console.log(1, 'Device Name:       ' + device.name);
        console.log(1, 'Device ID:         ' + device.id);
        return device.gatt.connect();  
    })
    .then(server => {
        console.log(1, "Connected");
        return server.getPrimaryService(NORDIC_SERVICE);
    })
    .then(service => {
        console.log(2, "Got service");
        return service.getCharacteristic(NORDIC_RX); // tx - send , rx - read
    })
    .then(characteristic  => {
        console.log('> Characteristic. Read Val...');
        
        rxCharacteristic = characteristic;
        console.log(2, "RX characteristic:"+JSON.stringify(rxCharacteristic));
        rxCharacteristic.addEventListener('characteristicvaluechanged', function(event) {
            var value = event.target.value.buffer; // get arraybuffer
            var str = ab2str(value);
            console.log(3, "Received "+JSON.stringify(str));
            data.push(str);
            labels.push(date);
            connection.emit('data', str);
        });
        return rxCharacteristic.startNotifications();
    })          
    .then(value => {
        var testVal = value;
        console.log("Odczyt danej: " + value.getUint8(0));
    })
    .catch(error => { console.log(error); })    
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomBar(date, lastClose) {
    var open = randomNumber(lastClose * 0.95, lastClose * 1.05);
    var close = randomNumber(open * 0.95, open * 1.05);
    return {
        t: date.valueOf(),
        y: close
    };
}


while (data.length < 60) {
    date = date.clone().add(1, 'd');
    if (date.isoWeekday() <= 5) {
        data.push(randomBar(Date, data[data.length - 1].y));
        labels.push(date);
    }
}

var canvas = document.getElementById("chart1");
var ctx = canvas.getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 300;

var color = Chart.helpers.color;
var cfg = {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'CHRT - Chart.js Corporation',
            // backgroundColor: rgb(255, 0, 0),
            // borderColor: window.chartColors.red,
            data: data,
            type: 'line',
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution: 'series',
                ticks: {
                    source: 'labels'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Closing price ($)'
                }
            }]
        }
    }
};
var chart = new Chart(ctx, cfg);

document.getElementById('update').addEventListener('click', function() {
    var type = document.getElementById('type').value;
    chart.config.data.datasets[0].type = type;
    chart.update();
});





