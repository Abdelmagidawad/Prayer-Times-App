let btnGetTimes = document.querySelector(".sec-city button");
let input = document.querySelector(".sec-city input");
let timesContainer = document.querySelector(".times");
let containerCity = document.querySelector(".city >h3");

let prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

function builtStructurePrayers(prayers) {
  prayers.forEach((prayer) => {
    timesContainer.innerHTML += `
     <div class="box" id=${prayer}>
          <div class="prayer">
            <img src="Images/icons-sun.png" alt="" />
            <h3>${prayer}</h3>
          </div>
          <div class="time">
            <i class="fa-regular fa-clock"></i>
            <p>-- : --</p>
          </div>
      </div>
  `;

    changeIcone(prayer);
  });
}

function changeIcone(prayer) {
  if (prayer === "Dhuhr") {
    document
      .querySelector("#Dhuhr img")
      .setAttribute("src", "Images/icons-sun-only.png");
  }

  if (prayer === "Isha") {
    document
      .querySelector("#Isha img")
      .setAttribute("src", "Images/icons8-moon-symbol-48.png");
  }
}

builtStructurePrayers(prayers);

checkLocalStorage(containerCity);

function checkLocalStorage(containerCity) {
  const savedCity = localStorage.getItem("city");
  const savedData = localStorage.getItem("prayerData");

  if (savedCity && savedData) {
    containerCity.innerHTML = `${savedCity[0].toUpperCase()}${savedCity.slice(
      1
    )}`;
    const parsedData = JSON.parse(savedData);
    updateUIFromSavedData(parsedData, savedCity);
  }
}

function updateUIFromSavedData(data, cityName) {
  let timings = data.timings;
  let readableDate = data.date.readable;
  let weekDay = data.date.gregorian.weekday.en;

  document.querySelector(".date-day >h3").innerHTML = weekDay;
  document.querySelector(".date-day >p").innerHTML = readableDate;

  Object.keys(timings).forEach((prayer) => {
    if (prayers.includes(prayer)) {
      const formattedTime = hourFormat(timings[prayer]);
      document.querySelector(
        `#${prayer} .time p`
      ).innerHTML = `${formattedTime}`;
    }
  });

  highlightNextPrayer(timings);
}

btnGetTimes.addEventListener("click", () => {
  if (input.value !== "") {
    getPrayerTimes(input.value);
    input.value = "";
  } else {
    Alert("Please enter a city name ");
  }
});

async function getPrayerTimes(cityName) {
  const egyptianCities = [
    "cairo",
    "alexandria",
    "giza",
    "luxor",
    "aswan",
    "port said",
    "suez",
    "ismailia",
    "fayoum",
    "zagazig",
    "banha",
    "tanta",
    "mansoura",
    "damietta",
    "kafr el-sheikh",
    "beni suef",
    "minya",
    "assiut",
    "sohag",
    "qena",
    "damanhur",
    "shibin el kom",
    "matrouh",
    "arish",
    "hurghada",
    "el tor",
    "new cairo",
  ];

  const normalizedCity = cityName.trim().toLowerCase();

  let params = {
    country: "EGY",
    city: cityName,
  };

  try {
    let response = await axios.get("https://api.aladhan.com/v1/timingsByCity", {
      params: params,
    });

    if (!egyptianCities.includes(normalizedCity)) {
      Alert("City not found. Please enter a valid city name");
      return;
    }

    localStorage.setItem("city", cityName);
    localStorage.setItem("prayerData", JSON.stringify(response.data.data));

    changePrayerTimesByCity(response, cityName);
  } catch (error) {
    Alert("City not found. Please enter a valid city name");
    console.log(error);
  }
}

function changePrayerTimesByCity(response, cityName) {
  let timings = response.data.data.timings;
  let readableDate = response.data.data.date.readable;
  let weekDay = response.data.data.date.gregorian.weekday.en;
  //
  document.querySelector(
    ".city >h3"
  ).innerHTML = `${cityName[0].toUpperCase()}${cityName.slice(1)}`;
  document.querySelector(".date-day >h3").innerHTML = weekDay;
  document.querySelector(".date-day >p").innerHTML = readableDate;
  //
  Object.keys(timings).forEach((prayer) => {
    if (prayers.includes(prayer)) {
      const formattedTime = hourFormat(timings[prayer]);
      document.querySelector(
        `#${prayer} .time p`
      ).innerHTML = `${formattedTime}`;
    }
  });

  highlightNextPrayer(timings);
}

function hourFormat(timeStr) {
  const [hourStr, minute] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.
  const hourFormatted = hour.toString().padStart(2, "0");

  return `${hourFormatted}:${minute} ${period}`;
}

function highlightNextPrayer(timings) {
  const now = new Date();

  let upcomingPrayer = null;
  let minDiff = Infinity;

  prayers.forEach((prayer) => {
    const time = timings[prayer]; // e.g., "14:50"
    const [hour, minute] = time.split(":").map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hour, minute, 0, 0);

    const diff = prayerTime - now;

    if (diff > 0 && diff < minDiff) {
      minDiff = diff;
      upcomingPrayer = prayer;
    }
  });

  if (upcomingPrayer) {
    document.querySelectorAll(".box").forEach((box) => {
      box.classList.remove("highlight");
    });

    const nextBox = document.getElementById(upcomingPrayer);
    nextBox.classList.add("highlight");
  }
}

function Alert(massage) {
  let contNotification = document.querySelector(".notification");
  let not = document.createElement("div");
  not.classList.add("not");

  not.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>
              <p>${massage}</p>`;
  contNotification.append(not);

  setTimeout(() => removeNotAlert(not), 3000);
}

function removeNotAlert(notElement) {
  notElement.classList.add("hide");
  setTimeout(() => notElement.remove(), 300);
}

// loader
window.addEventListener("load", () => {
  let loader = document.querySelector(".app-loader");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1.5);
});

// Autoplay Audio
window.addEventListener("load", () => {
  const audio = document.getElementById("autoAudio");
  audio.play();
  audio.play().catch((err) => {
    console.log("Autoplay blocked by browser:", err);
  });
});
