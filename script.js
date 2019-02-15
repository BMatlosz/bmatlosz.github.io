/*
ID BLE Devices
*/

var NORDIC_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
var STM32_SERVICE =  '1100fe40-cc7a-482a-984a-7f2ed5b3e58f';
var NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";


var STM32_WRITE = "0000fe41-cc7a-482a-984a-7f2ed5b3e58f";
var STM32_NOTIFY = "0000fe42-cc7a-482a-984a-7f2ed5b3e58f";

var btServer = undefined;
var txCharacteristic = undefined;
var rxCharacteristic;
var rxCharacteristic2;

var nameDevice = "";
var idDevice = "";

var ul = document.querySelector("ul");

/*
    ble api
*/
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

function hanlder_start_notification()
{

}

function hanlder_stop_notification()
{

}

function function_scaneDev() {
    console.log("Click scane button");
    navigator.bluetooth.requestDevice({
        //acceptAllDevices: true,
        filters: [
        //     { namePrefix: 'Puck.js' },
        //     { namePrefix: 'Pixl.js' },
             { namePrefix: '21-STM32' }
        //    { services: [STM32_SERVICE] }
        ],
        // filters: [
        //     { services: [STM32_SERVICE] },
        //     { services: [NORDIC_SERVICE] }
        // ],
        
    })
    .then(device => {
        nameDevice = device.name;
        idDevice = device.id;
        gatt = device.gatt.conne
        console.log(1, 'Device Name:       ' + nameDevice);
        console.log(1, 'Device ID:         ' + idDevice);
        console.log(1, 'Connected:        ' + device.gatt.connected);
        return device.gatt.connect();  
    })
    .then(server => {
        console.log(1, "Connected");
        return server.getPrimaryService(STM32_SERVICE);
    })
    .then(service => {
        console.log(2, "Got service");
        return service.getCharacteristic(STM32_WRITE); // tx - send , rx - read
    })
    .then(characteristic => {
        // Writing 1 is the signal to reset energy expended.
        var resetEnergyExpended = Uint8Array.of(1);
        return characteristic.writeValue(resetEnergyExpended);
    })
      
    // .then(characteristic  => {
    //     console.log('> Characteristic. Read Val...');
        
    //     rxCharacteristic = characteristic;
        
    //     console.log(2, "RX characteristic:" + JSON.stringify(rxCharacteristic));

    //     rxCharacteristic.addEventListener('characteristicvaluechanged', function(event) {
    //         var value = event.target.value.buffer; // get arraybuffer
    //         var newstr = new DataView(value);
    //         var str = ab2str(value);
    //         console.log(3, "Received "+JSON.stringify(str));
    //         console.log(4, newstr);
    //         var li = document.createElement("li");
    //         // Add Bootstrap class to the list element
    //         li.classList.add("list-group-item");
    //         li.appendChild(document.createTextNode(idDevice +" | " + nameDevice + " | " + str + "\n"));
    //         ul.appendChild(li);
            
    //         connection.emit('data', str);
    //     });
    //     return rxCharacteristic.startNotifications();
    // })
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










