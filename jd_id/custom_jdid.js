console.log("custom script");
var isTyping = false;
var isNotTyping;
function sendIsTypingToUser() {
    try {
        if (!isTyping) {
            console.log("IsTyping...........");
            isTyping = true;
            window.YellowMessengerPlugin.sendEvent(JSON.stringify({
                event_code: 'ym-user-typing-start', data: "start"
            }), '*');
        }
    } catch(err){
        console.log(err);
    }
}
function sendIsNotTyping() {
    try {
        console.log("Not Typing...........");
        isTyping = false;
        window.YellowMessengerPlugin.sendEvent(JSON.stringify({
            event_code: 'ym-user-typing-stop', data: "stop"
        }), '*');
    } catch(err) {
        console.log(err);
    }
}

function inputHandler(data) {
  //   console.log("data-> ", data.target.value);
    try {
        sendIsTypingToUser();
        if (isNotTyping != undefined) clearTimeout(isNotTyping);
        isNotTyping = setTimeout(sendIsNotTyping, 2000);
    } catch (err) {
        console.log(err);
    }
}


window.addEventListener('message', function (eventData) {
    try {
        if (JSON.parse(eventData.data)) {
            let event = JSON.parse(eventData.data);
            if (event.event_code === "custom-event" && event.data && event.data.code === "queue_position_updated") {
                console.log("Received queued event");
                const queue_position = event.data.data.queue_position;
                const estimated_time = event.data.data.estimated_time;
                const waitMessage = event.data.data.waitMessage;
                const estimatedWaitTimeMessage = event.data.data.estimatedWaitTimeMessage;
                [...document.getElementById("ymIframe").contentWindow.document.querySelectorAll("iframe")]
                .reverse()[1].contentWindow
                .postMessage({
                    queue_type: "queue_webview",
                    waitMessage: waitMessage,
                    queue_position: queue_position, 
                    estimated_time: estimated_time ,
                    estimatedWaitTimeMessage: estimatedWaitTimeMessage
                    },"https://app.yellowmessenger.com")
            }

            else if (event.data && event.data.code === "start-polling-livechat") {
                try {
                  const innerIframe = document.getElementById("ymIframe");
                  usrInput = innerIframe.contentDocument.getElementById("ymMsgInput");
                  usrInput.addEventListener("input", inputHandler, true);
                } catch (err) {
                  console.log(err);
                }
            } 
            else if (event.data && event.data.code === "end-polling-livechat") {
                try {
                  const innerIframe = document.getElementById("ymIframe");
                  usrInput = innerIframe.contentDocument.getElementById("ymMsgInput");
                  usrInput.removeEventListener("input", inputHandler, true);
                } catch (err) {
                  console.log(err);
                }
            }
        }
    } catch (error) {
        console.log(error);
        return;
    }
}, false)
