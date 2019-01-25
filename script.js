
function function_scaneDev() {
    console.log("Click scane button");
    navigator.bluetooth.requestDevice()
        .then(device => { /* ... */ })
        .catch(error => { console.log(error); });

}