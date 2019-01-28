/*
ID BLE Devices
*/
var NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

var btServer = undefined;
txCharacteristic = undefined;
rxCharacteristic = undefined;

function function_scaneDev() {
    console.log("Click scane button");
    navigator.bluetooth.requestDevice({
        filters: [
            { namePrefix: 'Puck.js' },
            { namePrefix: 'Pixl.js' },
            { namePrefix: 'Espruino' },
            { services: [NORDIC_SERVICE] }
        ]
    })
    .then(device => {
        console.log(1, 'Device Name:       ' + device.name);
        console.log(1, 'Device ID:         ' + device.id);
        device.addEventListener('gattserverdisconnected', function() {
            log(1, "Disconnected (gattserverdisconnected)");
            connection.close();
        });

        return device.gatt.connect();  
    })
    .then(server => {
        log(1, "Connected");
        return server.getPrimaryService(NORDIC_SERVICE);
    })
    .then(service => {
        log(2, "Got service");
        service.getCharacteristic(NORDIC_RX);
      })
    .then(characteristic  => {
        rxCharacteristic = characteristic;
        console.log(2, "RX characteristic:"+JSON.stringify(rxCharacteristic));

        rxCharacteristic.addEventListener('characteristicvaluechanged', function(event) {
            var value = event.target.value.buffer; // get arraybuffer
            var str = ab2str(value);
            console.log(3, "Received "+JSON.stringify(str));
            connection.emit('data', str);
          });
          return rxCharacteristic.startNotifications();

        // console.log(characteristic );
        // document.getElementById("scaneBtn").addEventListener("click", function() {
        //     console.log("start listener event...")
        //     var readVal = characteristic.getDescriptors();
        //     console.log(readVal);
        //     return readVal;
        // })
        // return characteristic.readValue();
        
    })            
    .then(value => {
        console.log(value.getUint8(0));
    })
    .catch(error => { console.log(error); })    
}

