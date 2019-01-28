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
        return service.getCharacteristic(NORDIC_RX);
    })
    .then(characteristic  => {
        console.log('> Characteristic...');
        rxCharacteristic = characteristic;
        rxCharacteristic2 = characteristic;

        rxCharacteristic.addEventListener(NORDIC_RX,
            handleBatteryLevelChanged);

        
        rxCharacteristic2.addEventListener('rising',
        handleBatteryLevelChanged);
    })            
    // .then(value => {
    //     console.log("Odczyt danej: " + value.getUint8(0));
    // })
    .catch(error => { console.log(error); })    
}

function handleBatteryLevelChanged(event) {
    // let Val = event.target.value.getUint8(0);
    let Val = event.target.value;
    console.log('> Value is ' + Val + '%');
}

