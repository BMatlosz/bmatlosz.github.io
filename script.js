/*
ID BLE Devices
*/

var NORDIC_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
var STM32_SERVICE =  '1100fe40-cc7a-482a-984a-7f2ed5b3e58f';
var NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

// COPY_UUID_128(uuid_struct,0x00,0x00,0xfe,0x41,0x8e,0x22,0x45,0x41,0x9d,0x4c,0x21,0xed,0xae,0x82,0xed,0x19)
// COPY_UUID_128(uuid_struct,0x00,0x00,0xfe,0x42,0x8e,0x22,0x45,0x41,0x9d,0x4c,0x21,0xed,0xae,0x82,0xed,0x19)

var STM32_WRITE = "0000fe41-8e22-4541-9d4c-21edae82ed19";
var STM32_NOTIFY = "0000fe42-8e22-4541-9d4c-21edae82ed19";

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

/* Utils */

function getSupportedProperties(characteristic) {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
      if (characteristic.properties[p] === true) {
        supportedProperties.push(p.toUpperCase());
      }
    }
    return '[' + supportedProperties.join(', ') + ']';
}

function function_scaneDev() {
    console.log('Requesting any Bluetooth Device...');
    navigator.bluetooth.requestDevice({
            filters: [{
                 namePrefix: '21-STM32' 
            }],
            //acceptAllDevices: true,
            optionalServices: [STM32_SERVICE]
        })
       .then(device => {
            console.log('Connecting to GATT Server...');
            return device.gatt.connect();
       })
        .then(server => server.getPrimaryService(STM32_SERVICE))
        .then(service => service.getCharacteristic(STM32_WRITE))
        .then(characteristic => {
        // Writing 1 is the signal to reset energy expended.
        var resetEnergyExpended = Uint8Array.of(1);
        return characteristic.writeValue(resetEnergyExpended);
        })

    //    .then(server => {
    //      // Note that we could also get all services that match a specific UUID by
    //      // passing it to getPrimaryServices().
    //         console.log('Getting Services...');
    //         return server.getPrimaryServices();
    //    })
    //    .then(services => {
    //         console.log('Getting Characteristics...');
    //         let queue = Promise.resolve();
    //         services.forEach(service => {
    //         queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
    //             console.log('> Service: ' + service.uuid);
    //             characteristics.forEach(characteristic => {
    //                 console.log('>> Characteristic: ' + characteristic.uuid + ' ' +
    //                 getSupportedProperties(characteristic));
    //             });
    //         }));
    //         });
    //         return queue;
    //    })
       .catch(error => {
            console.log('Argh! ' + error);
    });


    // navigator.bluetooth.requestDevice({
    //     //acceptAllDevices: true,
    //     filters: [
    //     //     { namePrefix: 'Puck.js' },
    //     //     { namePrefix: 'Pixl.js' },
    //          { namePrefix: '21-STM32' }
    //     //    { services: [STM32_SERVICE] }
    //     ],
    //     // filters: [
    //     //     { services: [STM32_SERVICE] },
    //     //     { services: [NORDIC_SERVICE] }
    //     // ],
        
    // })
    // .then(device => {
    //     nameDevice = device.name;
    //     console.log('Connection to GATT Server. Name devices: ' + nameDevice);
    //     return device.gatt.connect();
    // })
    // .then(server => {
    //     // Note that we could also get all services that match a specific UUID by
    //     // passing it to getPrimaryServices().
    //     console.log('Getting Services...');
    //     return server.getPrimaryServices();
    // })
    // .then(services => {
    //     console.log('Getting Characteristics...');
    //     let queue = Promise.resolve();
    //     services.forEach(service => {
    //     queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
    //         console.log('> Service: ' + service.uuid);
    //         characteristics.forEach(characteristic => {
    //         console.log('>> Characteristic: ' + characteristic.uuid + ' ' +
    //             getSupportedProperties(characteristic));
    //         });
    //     }));
    //     });
    //     return queue;
    // })
    // .then(characteristic => {
    //     // Writing 1 is the signal to reset energy expended.
    //     var resetEnergyExpended = Uint8Array.of(1);
    //     return characteristic.writeValue(resetEnergyExpended);
    // })
      
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
    // .catch(error => { console.log(error); })    
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










