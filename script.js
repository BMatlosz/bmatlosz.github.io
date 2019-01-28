/*
ID BLE Devices
*/
var NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";


function function_scaneDev() {
    console.log("Click scane button");
    navigator.bluetooth.requestDevice({
        filters: [
            { namePrefix: 'Puck.js' },
            { namePrefix: 'Pixl.js' },
            { services: [NORDIC_SERVICE] }
        ]
    })
    .then(device => {
        console.log(1, 'Device Name:       ' + device.name);
        console.log(1, 'Device ID:         ' + device.id);  
        return device.gatt.connect();  
    })
    .then(server => {
        return server.getPrimaryService(NORDIC_SERVICE);
    })
    .then(service => {
        service.getCharacteristic(NORDIC_RX);
      })
    .then(characteristic  => {
        console.log('Characteristic..... ');
        console.log(characteristic );
        document.getElementById("scaneBtn").addEventListener("click", function() {
            console.log("start listener event...")
            var readVal = characteristic.getDescriptors();
            console.log(readVal);
            return readVal;
        })
        
    })
    .then(value => {
        console.log(value.getUint8(0));
    })
    .catch(error => { console.log(error); })    
}

