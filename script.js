const message = document.getElementById("message");
const chatBox = document.getElementById("chatbox");
const sendMessageBtn = document.getElementById("sendmessage");
const config = require("./config.js");

message.focus();
chatBox.scrollTop = chatBox.scrollHeight;

const step1 = document.getElementById("step1");

const email = document.getElementById("email");
const name = document.getElementById("name");
const injurytype = document.getElementById("injurytype");
const injuryprocess = document.getElementById("injuryprocess");
const postinjury = document.getElementById("postinjury");

const stepOneError = document.getElementById("stepOneMessage");
const submitBtn = document.getElementById("submit");
const previousBtn = document.getElementById("previous");
const step2 = document.getElementById("step2");
const setpTwoError = document.getElementById("stepTwoMessage");
const nextBtn = document.getElementById("next");

const activateStep2 = () => {
  if (email.value && name.value) {
    step1.classList.add("d-none");
    step2.classList.remove("d-none");
    next.classList.add("d-none");
    submitBtn.classList.remove("d-none");
    stepOneError.classList.add("d-none");
    previousBtn.classList.remove("d-none");
    nextBtn.removeEventListener("click", activateStep2);
    previousBtn.addEventListener("click", activateStep1);
  } else {
    stepOneError.classList.remove("d-none");
    stepOneError.classList.add("text-danger");
    stepOneError.innerHTML = `<i class="bi bi-exclamation-triangle"></i> Please enter your correct name and email`;
  }
};

const activateStep1 = () => {
  step2.classList.add("d-none");
  step1.classList.remove("d-none");
  submitBtn.classList.add("d-none");
  next.classList.remove("d-none");
  previousBtn.classList.add("d-none");
  nextBtn.addEventListener("click", activateStep2);
};

let startUp = new bootstrap.Modal(document.getElementById("injuryForm"));
let loading = new bootstrap.Modal(document.getElementById("loading"));
startUp.show();

submitBtn.addEventListener("click", () => {
  if (injurytype.value && injuryprocess.value && postinjury.value) {
    setpTwoError.classList.add("d-none");
    startUp.hide();
    loading.show();
    const data = {
      name: name.value,
      email: email.value,
      injurytype: injurytype.value,
      injuryprocess: injuryprocess.value.trim(),
      postinjury: postinjury.value.trim(),
      sessionId: localStorage.sessionKey,
    };
    try {
      axios
        .post(`${config.BASEURL}:${config.PORT}/report`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          const messageFromAi = response?.data?.message;
          AiMessage(messageFromAi);
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    setpTwoError.classList.remove("d-none");
    setpTwoError.classList.add("text-danger");
    setpTwoError.innerHTML = `<i class="bi bi-exclamation-triangle"></i> Please enter details about your injury`;
  }
});

nextBtn.addEventListener("click", activateStep2);

const generateToken = () => {
  axios
    .get(`${config.BASEURl}:${config.PORT}/generate-session`)
    .then((response) => {
      // Extract the session key from the response data
      const sessionKey = response.data.sessionKey;

      localStorage.setItem("sessionKey", sessionKey);
      // Store the session key on the client-side (e.g., in local storage or a cookie)
    })
    .catch((error) => {
      console.error("Error fetching session key:", error);
    });
};

const messageHandler = async () => {
  if (message.value != "") {
    //check if local storage has sessionKey.
    if (!localStorage.getItem("sessionKey")) {
      await generateToken();
    }

    const data = {
      message: message.value.trim(),
      sessionId: localStorage.sessionKey,
    };
    userMessage(message.value);
    try {
      axios
        .post(`${config.BASEURL}:${config.PORT}/send`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          const messageFromAi = response?.data?.message;
          AiMessage(messageFromAi);
        });
    } catch (error) {
      console.log(error);
    }
  }
};

message.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    messageHandler();
  }
});
sendMessageBtn.addEventListener("click", () => {
  messageHandler();
});

const userMessage = (msg) => {
  chatBox.innerHTML += `
  <div class="row justify-content-end">
      <div class="col-12 col-md-9 position-relative">
          <i class="bi bi-caret-right-fill text-primary AI_chatRightIndication_Icon"></i>
          <p class="m-2 rounded p-3 bg-primary text-white">${msg}</p>
      </div>
  </div>`;
  message.value = null;
  message.focus();
  chatBox.scrollTop = chatBox.scrollHeight;
};

const AiMessage = (msg) => {
  loading.hide();
  chatBox.innerHTML += `
    <div class="row justify-content-start">
        <div class="col-12 col-md-9 position-relative">
            <i class="bi bi-caret-left-fill text-warning AI_chatLeftIndication_Icon"></i>
            <p class="m-2 rounded p-3 bg-warning text-dark">${msg}</p>
        </div>
    </div>`;

  chatBox.scrollTop = chatBox.scrollHeight;
};
