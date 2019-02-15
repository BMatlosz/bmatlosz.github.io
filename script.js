/*
ID BLE Devices
*/

var NORDIC_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
var NORDIC_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
var NORDIC_RX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

// COPY_UUID_128(uuid_struct,0x00,0x00,0xfe,0x41,0x8e,0x22,0x45,0x41,0x9d,0x4c,0x21,0xed,0xae,0x82,0xed,0x19)
// COPY_UUID_128(uuid_struct,0x00,0x00,0xfe,0x42,0x8e,0x22,0x45,0x41,0x9d,0x4c,0x21,0xed,0xae,0x82,0xed,0x19)
var STM32_SERVICE =  '1100fe40-cc7a-482a-984a-7f2ed5b3e58f';
var STM32_WRITE = "0000fe41-8e22-4541-9d4c-21edae82ed19";
var STM32_NOTIFY = "0000fe42-8e22-4541-9d4c-21edae82ed19";

/*
 * Varible
 */
var nameDevice = "";
var idDevice = "";
var idCharacteristic;



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
    console.log('Press Start Notification...');
    var resetEnergyExpended = Uint8Array.of(1);
    idCharacteristic.writeValue(resetEnergyExpended);
}

function hanlder_stop_notification()
{
    console.log('Press Stop Notification...');
    var resetEnergyExpended = Uint8Array.of(1);
    idCharacteristic.writeValue(resetEnergyExpended);
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
        .then(server => { 
            console.log('Server get Primary Serice...');
            return server.getPrimaryService(STM32_SERVICE)
        })
        .then(service => {
            console.log('Service get Characteristic...');
            return service.getCharacteristic(STM32_WRITE);
        })
        .then(characteristic => {
            // Writing 1 is the signal to reset energy expended.
            console.log('Characteristic write Value..');
            idCharacteristic = characteristic;
            // var resetEnergyExpended = Uint8Array.of(1);
            // return characteristic.writeValue(resetEnergyExpended);
        })
       .catch(error => {
            console.log('Argh! ' + error);
    });
}









