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
var global_Device;
var global_Characteristic;
var _characteristics = new Map();



var ul = document.querySelector("ul");

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

/* ***************************************************************
    Function ble connection
*************************************************************** */
function CacheCharacteristic(service, characteristicUuid) {
    console.log('>> Function CacheCharacteristic');
    return service.getCharacteristic(characteristicUuid)
    .then(characteristic => {
        _characteristics.set(characteristicUuid, characteristic);
    });
};

function readCharacteristicValue(characteristicUuid) {
    console.log('>> Function RereadCharacteristicValue...');
    let read_characteristic = _characteristics.get(characteristicUuid);
    return read_characteristic.readValue()
    .then(value => {
        console.log(value);
        value = value.buffer ? value : new DataView(value);
        return value;
    });
};


function handleNotifications(event) {
    let value = event.target.value;
    let a = [];
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    for (let i = 0; i < value.byteLength; i++) {
      a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
    }
    cosnole.log('> ' + a.join(' '));
  }
var myCharacteristicNotifi;
function StartNotification(characteristicUuid) {
    let startNotifi = _characteristics.get(characteristicUuid);
    return startNotifi.startNotifications()
        //.then(() => characteristic);
        .then(() => {
            console.log('>> Start notification...');
            myCharacteristicNotifi.addEventListener('characteristicvaluechanged',
            handleNotifications);
        });
};

function StopNotification(characteristicUuid) {
    let stopNotifi = _characteristics.get(characteristicUuid);
    return stopNotifi.stopNotifications()
        .then(() => characteristic);
};

/* ***************************************************************
Action button
*************************************************************** */

function hanlder_turn_on_blue_led()
{
    console.log('Press Turn on Blue LED...');
    let write_characteristic = _characteristics.get(STM32_WRITE);
    var resetEnergyExpended = Uint8Array.of(1);
    return write_characteristic.writeValue(resetEnergyExpended);
}

function hanlder_turn_off_blue_led()
{
    console.log('Press Turn off Blue LED...');
    let write_characteristic = _characteristics.get(STM32_WRITE);
    var resetEnergyExpended = Uint8Array.of(0);
    return write_characteristic.writeValue(resetEnergyExpended);
    // var resetEnergyExpended = Uint8Array.of(0);
    // global_Characteristic.writeValue(resetEnergyExpended);
}

function hanlder_linstener_btn_3() {
    console.log('Press listener button...');
    return StartNotification(STM32_NOTIFY);
}


// --------------------------------------------------------------
// Scaner devices....
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
            return Promise.all([
                server.getPrimaryService(STM32_SERVICE).then(service => {
                    return Promise.all([
                        CacheCharacteristic(service, STM32_WRITE),
                        CacheCharacteristic(service, STM32_NOTIFY)
                    ])
                })
            ])
        })
        // .then(server => { 
        //     console.log('Server get Primary Serice...');
        //     return server.getPrimaryService(STM32_SERVICE)
        // })
        // .then(service => {
        //     console.log('Service get Characteristic...');
        //     return service.getCharacteristic(STM32_WRITE);
        // })
        // .then(characteristic => {
        //     console.log('Characteristic write Value..');
        //     idCharacteristic = characteristic;
        // })
       .catch(error => {
            console.log('Argh! Not working... tararara >.< ' + error);
    });
}











