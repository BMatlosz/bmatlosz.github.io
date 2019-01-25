
var NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
var idBtn = document.getElementById('scaneBtn');

function readVal() {
    Puck.eval("Puck.light()", function(v) {
        console.log(x)
    })
}
if(idBtn) {
    idBtn.addEventListener('click',readVal,false);
}

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
    // .then(characteristic => {
    //     return characteristic.readValue();
    // })
    .then(value => {
        console.log(value.getUint8(0));
    })
    .catch(error => { console.log(error); })    
}

