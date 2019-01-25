
var NORDIC_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

function function_scaneDev() {
    console.log("Click scane button");
    navigator.bluetooth.requestDevice({
        filters: [
            { namePrefix: 'Puck.js' },
            { namePrefix: 'Pixl.js' },
            { services: [NORDIC_SERVICE] }
        ]
    })
        .then(function (device) {
            console.log(1, 'Device Name:       ' + device.name);
            console.log(1, 'Device ID:         ' + device.id);

            device.addEventListener('gattserverdisconnected', function() {
                console.log(1, "Disconnected (gattserverdisconnected)");
                connection.close();
            })
        })
        .catch(error => { console.log(error); })
    
    
}

addEventListener("scaneBtn",function(){
    Puck.eval("Puck.light()", function(v) {
        console.log(x)
    })
})

