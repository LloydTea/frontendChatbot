const message = document.getElementById("message");
const chatBox = document.getElementById("chatbox");
const sendMessageBtn = document.getElementById("sendmessage");
const { default: axios } = require("axios");
const config = require("./config.js");

message.focus();
chatBox.scrollTop = chatBox.scrollHeight;

const step1 = document.getElementById("step1");

const email = document.getElementById("email");
const phone = document.getElementById("phone");
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
  if (email.value && name.value && phone.value) {
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
    stepOneError.innerHTML = `<i class="bi bi-exclamation-triangle"></i> Please enter your correct name, email and phone`;
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

    const data1 = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      injurytype: injurytype.value,
      injuryprocess: injuryprocess.value.trim(),
      postinjury: postinjury.value.trim(),
    };
    const data2 = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      tags: ["ai.615nashlaw.com"],
    };

    //Call Send Entry Data To AI To Initiate The Chat
    formEntryToAI(data1);

    //GHL Axios Post Request
    formEntryToGHL(data2);
  } else {
    setpTwoError.classList.remove("d-none");
    setpTwoError.classList.add("text-danger");
    setpTwoError.innerHTML = `<i class="bi bi-exclamation-triangle"></i> Please enter details about your injury`;
  }
});

nextBtn.addEventListener("click", activateStep2);

//Function For Sending All User Entry To AI
const formEntryToAI = async (userInfo) => {
  try {
    axios
      .post(`${config.BASEURL}/report`, userInfo, {
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
};

//Function To Send User Details To GHL CRM
const formEntryToGHL = async (userInfo) => {
  if (config.Authorization) {
    try {
      axios
        .post(`https://rest.gohighlevel.com/v1/contacts/`, userInfo, {
          headers: {
            Authorization: `Bearer ${config.Authorization}`,
            "Content-Type": "application/json",
          },
        })
        .then(function () {
          console.log("Contact Saved");
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("No GHL Authorization Code");
  }
};

const messageHandler = async () => {
  if (message.value != "") {
    const data = {
      message: message.value.trim(),
    };
    userMessage(message.value);
    try {
      axios
        .post(`${config.BASEURL}/send`, data, {
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
