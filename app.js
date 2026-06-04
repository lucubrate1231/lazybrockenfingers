const states = [
  {
    label: "좋음",
    pm10: 18,
    pm25: 9,
    humidity: "42%",
    wind: "2.1",
    message: "창문을 살짝 열어도 괜찮은 맑은 공기예요.",
    meter: "24%",
    tone: "good",
    washColor: "rgba(216, 255, 138, 0.46)",
    tintColor: "rgba(216, 255, 138, 0.2)",
  },
  {
    label: "보통",
    pm10: 46,
    pm25: 22,
    humidity: "47%",
    wind: "1.8",
    message: "가벼운 산책은 좋아요. 오래 머무를 땐 물을 챙겨요.",
    meter: "48%",
    tone: "normal",
    washColor: "rgba(255, 249, 132, 0.5)",
    tintColor: "rgba(255, 249, 132, 0.2)",
  },
  {
    label: "나쁨",
    pm10: 91,
    pm25: 44,
    humidity: "38%",
    wind: "1.1",
    message: "마스크를 챙기고 긴 외출은 조금 줄여볼까요?",
    meter: "72%",
    tone: "bad",
    washColor: "rgba(255, 153, 8, 0.42)",
    tintColor: "rgba(255, 153, 8, 0.16)",
  },
  {
    label: "매우 나쁨",
    pm10: 142,
    pm25: 73,
    humidity: "35%",
    wind: "0.9",
    message: "오늘은 실내에서 포근하게 쉬는 편이 좋아요.",
    meter: "96%",
    tone: "very-bad",
    washColor: "rgba(119, 122, 119, 0.42)",
    tintColor: "rgba(119, 122, 119, 0.16)",
  },
];

const cityOffsets = {
  "서울 마포구": 0,
  "부산 해운대구": 1,
  "대구 중구": 2,
  "제주 제주시": 0,
};

let stateIndex = 0;
let currentState = states[0];

const elements = {
  notifyButton: document.querySelector("#notifyButton"),
  refreshButton: document.querySelector("#refreshButton"),
  citySelect: document.querySelector("#citySelect"),
  sensitivityRange: document.querySelector("#sensitivityRange"),
  outdoorToggle: document.querySelector("#outdoorToggle"),
  windowToggle: document.querySelector("#windowToggle"),
  toast: document.querySelector("#toast"),
  mascot: document.querySelector("#mascot"),
  statusCard: document.querySelector("#statusCard"),
  statusLabel: document.querySelector("#statusLabel"),
  pmValue: document.querySelector("#pmValue"),
  pm25Value: document.querySelector("#pm25Value"),
  humidityValue: document.querySelector("#humidityValue"),
  windValue: document.querySelector("#windValue"),
  statusMessage: document.querySelector("#statusMessage"),
  meterFill: document.querySelector("#meterFill"),
};

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2400);
}

function thresholdLabel() {
  const labels = {
    1: "나쁨부터",
    2: "보통부터",
    3: "작은 변화도",
  };
  return labels[elements.sensitivityRange.value];
}

function render() {
  const city = elements.citySelect.value;
  const offset = cityOffsets[city] ?? 0;
  const state = states[(stateIndex + offset) % states.length];
  currentState = state;

  elements.statusLabel.textContent = state.label;
  elements.pmValue.textContent = state.pm10;
  elements.pm25Value.textContent = state.pm25;
  elements.humidityValue.textContent = state.humidity;
  elements.windValue.textContent = state.wind;
  elements.statusMessage.textContent = state.message;
  elements.meterFill.style.width = state.meter;

  elements.mascot.classList.remove("normal", "bad", "very-bad");
  elements.statusCard.style.background = "#f3fff9";
  elements.statusCard.style.borderColor = "rgba(74, 163, 111, 0.16)";
  elements.statusLabel.style.background = "#ddf8ed";
  elements.statusLabel.style.color = "#24714c";
  elements.meterFill.style.background = "linear-gradient(90deg, #7edfc2, #ffd66b)";

  if (state.tone === "normal") {
    elements.mascot.classList.add("normal");
  }

  if (state.tone === "bad") {
    elements.mascot.classList.add("bad");
    elements.statusCard.style.background = "#fff6ee";
    elements.statusCard.style.borderColor = "rgba(255, 139, 123, 0.24)";
    elements.statusLabel.style.background = "#ffe0d8";
    elements.statusLabel.style.color = "#a94132";
    elements.meterFill.style.background = "linear-gradient(90deg, #ffd66b, #ff8b7b)";
  }

  if (state.tone === "very-bad") {
    elements.mascot.classList.add("very-bad");
    elements.statusCard.style.background = "#fff0f4";
    elements.statusCard.style.borderColor = "rgba(245, 107, 141, 0.24)";
    elements.statusLabel.style.background = "#ffd9e3";
    elements.statusLabel.style.color = "#9f2546";
    elements.meterFill.style.background = "linear-gradient(90deg, #ff8b7b, #f56b8d)";
  }
}

function paintScreenFromDust() {
  const rect = elements.mascot.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const dustX = Math.round(Math.random() * 88 - 44);
  const dustY = Math.round(Math.random() * 54 - 27);
  const dustRotate = Math.round(Math.random() * 56 - 28);
  const dustScale = (Math.random() * 0.5 + 0.7).toFixed(2);
  const wash = document.createElement("span");

  document.body.style.setProperty("--screen-tint", currentState.tintColor);
  elements.mascot.style.setProperty("--dust-x", `${dustX}px`);
  elements.mascot.style.setProperty("--dust-y", `${dustY}px`);
  elements.mascot.style.setProperty("--dust-rotate", `${dustRotate}deg`);
  elements.mascot.style.setProperty("--dust-scale", dustScale);
  wash.className = "color-wash";
  wash.style.setProperty("--wash-x", `${x}px`);
  wash.style.setProperty("--wash-y", `${y}px`);
  wash.style.setProperty("--wash-color", currentState.washColor);
  document.body.appendChild(wash);

  elements.mascot.classList.remove("runaway");
  void elements.mascot.offsetWidth;
  elements.mascot.classList.add("runaway");

  window.setTimeout(() => wash.remove(), 1000);
  window.setTimeout(() => {
    elements.mascot.classList.remove("runaway");
  }, 1280);

  showToast("먼지가 색을 뿌리고 도망갔어요.");
}

elements.refreshButton.addEventListener("click", () => {
  stateIndex = (stateIndex + 1) % states.length;
  render();
  showToast("새 공기 상태를 확인했어요.");
});

elements.mascot.addEventListener("click", paintScreenFromDust);

elements.mascot.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    paintScreenFromDust();
  }
});

elements.notifyButton.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    showToast("이 브라우저는 알림을 지원하지 않아요.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    showToast(`알림 켜짐: ${thresholdLabel()} 알려드릴게요.`);
  } else {
    showToast("알림 권한이 꺼져 있어요.");
  }
});

elements.citySelect.addEventListener("change", () => {
  render();
  showToast(`${elements.citySelect.value} 공기로 바꿨어요.`);
});

elements.sensitivityRange.addEventListener("input", () => {
  showToast(`민감도: ${thresholdLabel()} 알림`);
});

elements.outdoorToggle.addEventListener("change", () => {
  showToast(elements.outdoorToggle.checked ? "외출 전 알림 켜짐" : "외출 전 알림 꺼짐");
});

elements.windowToggle.addEventListener("change", () => {
  showToast(elements.windowToggle.checked ? "환기 타이밍 알림 켜짐" : "환기 타이밍 알림 꺼짐");
});

render();
