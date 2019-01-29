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

var ctx = document.getElementById('chart1').getContext('2d');
		ctx.canvas.width = 1000;
        ctx.canvas.height = 300;
        
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: [{
        x: 10,
        y: 20
    }, {
        x: 15,
        y: 10
    }],
    options: {
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
    }
});





