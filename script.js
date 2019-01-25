
function function_scaneDev() {
    console.log("Click scane button");
    navigator.bluetooth.requestDevice({
        filters: [{ services: ["Puck.js", "Pixl.js"] }]
    })
        .then(device => { device.name })
        .catch(error => { console.log(error); });

}