console.log("custom script");
var isTyping = false;
var isNotTyping;
function sendIsTypingToUser() {
  try {
    if (!isTyping) {
      console.log("IsTyping...........");
      isTyping = true;
      window.YellowMessengerPlugin.sendEvent(
        JSON.stringify({
          event_code: "ym-user-typing-start",
          data: "user_typing",
        }),
        "*"
      );
    }
  } catch (err) {
    console.log(err);
  }
}
function sendIsNotTyping() {
  try {
    console.log("Not Typing...........");
    isTyping = false;
    window.YellowMessengerPlugin.sendEvent(
      JSON.stringify({
        event_code: "ym-user-typing-stop",
        data: "user_typing",
      }),
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
      if (JSON.parse(eventData.data)) {
        let event = JSON.parse(eventData.data);
        if (
          event.event_code === "custom-event" &&
          event.data &&
          event.data.code === "queue_position_updated"
        ) {
          console.log("Received queued event");
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
              "https://app.yellowmessenger.com"
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
          window.ymInterval = setInterval(() => {
            try {
              console.log("value triggered for event", event.event_code);
              const frameDocument =
                window.frames &&
                window.frames.ymIframe &&
                window.frames.ymIframe.document;
              const title = frameDocument.getElementsByClassName("title");
              if (title) {
                title[0].remove();
              }
              const subTitle =
                frameDocument.getElementsByClassName("sub-title");
              if (subTitle) {
                subTitle[0].remove();
              }
              var x = frameDocument.getElementsByClassName("title-parent");
              console.log(" title execution parent", x);
              var element = frameDocument.createElement("img");
              element.setAttribute("class", "icon1");
              element.style.maxWidth = "200px";
              element.style.margin = "-10px 0 0 -25px";
              element.style.padding = 0;
              element.setAttribute(
                "src",
                "https://cdn.yellowmessenger.com/Eaf9VXBO8C661636518084435.png"
              );
              if (x) {
                x[0].appendChild(element);
              }
              clearInterval(window.ymInterval);
            } catch (error) {
              clearInterval(window.ymInterval);
            }
          }, 100);
        }
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
  false
);
