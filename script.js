
function function_scaneDev() {
    console.log("Click scane button");
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true
    })
        .then(device => { /* ... */ })
        .catch(error => { console.log(error); });

}