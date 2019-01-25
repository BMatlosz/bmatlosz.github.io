
function function_scaneDev() {
    console.log("Click scane button");
    navigator.bluetooth.requestDevice({
        filters: [
            { namePrefix: 'Puck.js' },
            { namePrefix: 'Pixl.js' }
        ]
    })
        .then(device => { device.name })
        .catch(error => { console.log(error); });

}