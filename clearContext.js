console.log("custom script");
window.addEventListener('message', function (eventData) {
    // console.log("Event catched");
    try {
        if (JSON.parse(eventData.data)) {
            let event = JSON.parse(eventData.data);
            // console.log(event, "testing")
            if (event.data && event.data.code === "clear") {
                console.log("clear context event catched")
                console.log(document);
                const innerIframe = document.getElementById("ymIframe");
                innerIframe.contentDocument.getElementById("chatBoxMain").innerHTML = "";
                innerIframe.contentDocument.getElementById("chatOptions").innerHTML = "";

//                 window.YellowMessengerPlugin.sendEvent(JSON.stringify({
//                     event_code: 'ym-client-event', data: "start"
//                 }), '*');
            }
            return;
        }
    } catch (error) {
        console.log(error, "error")
    }
}, false);
