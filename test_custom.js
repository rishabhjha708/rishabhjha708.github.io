console.log("custom script");
var isTyping = false;
var isNotTyping;
function sendIsTypingToUser() {
  if (!isTyping) {
    console.log("IsTyping...........");
    isTyping = true;
  }
}
function sendIsNotTyping() {
  console.log("Not Typing...........");
  isTyping = false;
}

function inputHandler(data) {
  //   console.log("data-> ", data.target.value);
  sendIsTypingToUser();
  if (isNotTyping != undefined) clearTimeout(isNotTyping);
  isNotTyping = setTimeout(sendIsNotTyping, 900);
}

window.addEventListener(
  "message",
  function (eventData) {
    // console.log("Event catched");
    try {
      if (JSON.parse(eventData.data)) {
        let event = JSON.parse(eventData.data);
        // console.log(event, "testing")

        if (event.data && event.data.code === "clear") {
          const innerIframe = document.getElementById("ymIframe");
          innerIframe.contentDocument.getElementById("chatBoxMain").innerHTML =
            "";
          innerIframe.contentDocument.getElementById("chatOptions").innerHTML =
            "";

          //           window.YellowMessengerPlugin.sendEvent(
          //             JSON.stringify({
          //               event_code: "ym-client-event",
          //               data: "start",
          //             }),
          //             "*"
          //           );
        } else if (event.data && event.data.code === "start-chat") {
          try {
            const innerIframe = document.getElementById("ymIframe");
            usrInput = innerIframe.contentDocument.getElementById("ymMsgInput");
            console.log("here->", usrInput);
            usrInput.addEventListener("input", inputHandler, true);

            // usrInput.onkeypress = () => {
            //   sendIsTypingToUser();
            //   if (isNotTyping != undefined) clearTimeout(isNotTyping);
            //   isNotTyping = setTimeout(sendIsNotTyping, 900);
            // };
          } catch (err) {
            console.log(err);
          }

          // window.YellowMessengerPlugin.sendEvent(JSON.stringify({
          //     event_code: 'ym-client-event', data: "start"
          // }), '*');
        } else if (event.data && event.data.code === "end-chat") {
          try {
            const innerIframe = document.getElementById("ymIframe");
            usrInput = innerIframe.contentDocument.getElementById("ymMsgInput");
            console.log("here->", usrInput);
            usrInput.removeEventListener("input", inputHandler, true);
          } catch (err) {
            console.log(err);
          }

          // window.YellowMessengerPlugin.sendEvent(JSON.stringify({
          //     event_code: 'ym-client-event', data: "start"
          // }), '*');
        }
        return;
      }
    } catch (error) {
      console.log(error, "error");
    }
  },
  false
);
