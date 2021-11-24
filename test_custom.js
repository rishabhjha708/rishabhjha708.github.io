// console.log("custom script");
var isTyping = false;
var isNotTyping;
function sendIsTypingToUser() {
  try {
    if (!isTyping) {
//       console.log("IsTyping...........");
      isTyping = true;
      window.YellowMessengerPlugin.sendEvent(
        {
          event: {
            code: "ym-user-typing-start",
            data: "user_typing",
          },
        },
        "*"
      );
    }
  } catch (err) {
    console.log(err);
  }
}
function sendIsNotTyping() {
  try {
//     console.log("Not Typing...........");
    isTyping = false;
    window.YellowMessengerPlugin.sendEvent(
      {
        event: {
          code: "ym-user-typing-stop",
          data: "user_typing",
        },
      },
      "*"
    );
  } catch (err) {
    console.log(err);
  }
}

function inputHandler(data) {
  //   console.log("data-> ", data.target.value);
  try {
    sendIsTypingToUser();
    if (isNotTyping != undefined) clearTimeout(isNotTyping);
    isNotTyping = setTimeout(sendIsNotTyping, 3000);
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener(
  "message",
  function (eventData) {
    try {
      console.log("eventData", eventData)
      if (JSON.parse(eventData.data)) {
        let event = JSON.parse(eventData.data);
        if (
          event.event_code === "custom-event" &&
          event.data &&
          event.data.code === "queue_position_updated"
        ) {
//           console.log("Received queued event");
          const queue_position = event.data.data.queue_position;
          const estimated_time = event.data.data.estimated_time;
          const waitMessage = event.data.data.waitMessage;
          const estimatedWaitTimeMessage =
            event.data.data.estimatedWaitTimeMessage;
          [
            ...document
              .getElementById("ymIframe")
              .contentWindow.document.querySelectorAll("iframe"),
          ]
            .reverse()[1]
            .contentWindow.postMessage(
              {
                queue_type: "queue_webview",
                waitMessage: waitMessage,
                queue_position: queue_position,
                estimated_time: estimated_time,
                estimatedWaitTimeMessage: estimatedWaitTimeMessage,
              },
              "*"
            );
        } else if (event.data && event.data.code === "start-polling-livechat") {
          try {
            const innerIframe = document.getElementById("ymIframe");
            usrInput = innerIframe.contentDocument.getElementById("ymMsgInput");
            usrInput.addEventListener("input", inputHandler, true);
          } catch (err) {
            console.log(err);
          }
        } else if (event.data && event.data.code === "end-polling-livechat") {
          try {
            const innerIframe = document.getElementById("ymIframe");
            usrInput = innerIframe.contentDocument.getElementById("ymMsgInput");
            usrInput.removeEventListener("input", inputHandler, true);
          } catch (err) {
            console.log(err);
          }
        } else if (event.event_code == "ym-bot-opened") {
//           console.log("changing bot attribute");
          const innerIframe = document.getElementById("ymIframe");
          let chatHeader =
            innerIframe.contentDocument.getElementById("chatDetails");
          let img = chatHeader.getElementsByClassName("icon")[0];
          let title = chatHeader.getElementsByClassName("title")[0];
          let subTitle = chatHeader.getElementsByClassName("sub-title")[1];
          title.style.fontFamily = "Lato, sans-serif";
          title.style.fontWeight = "600";
          title.style.paddingTop = "10px";
          title.style.fontSize = "20px";
          subTitle.style.opacity = "0.8";
//           img.src =
//             "https://cdn.yellowmessenger.com/GEqWWOt1dY7h1636613828709.png";
          img.style.width = "57px";
          img.style.height = "57px";
          img.style.borderRadius = "50px";
          chatHeader.style.paddingTop = "6px";
          chatHeader.style.paddingBottom = "25px";
          
        }
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
  false
);
