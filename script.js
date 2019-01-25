
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
        })
        .catch(error => { console.log(error); })
    
    
}

document.getElementById("scaneBtn").addEventListener("click",function(){
    console.log("->addEventListener...")

    Puck.eval("Puck.light()", function(v) {
        console.log(x)
    })
})

