console.log("custom script");
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
            const usrInput = innerIframe.contentDocument.getElementById("ymMsgInput");
            console.log("here->", usrInput);
            usrInput.addEventListener("input", function (data) {
              console.log("data-> ", data.target.value);
            });
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
