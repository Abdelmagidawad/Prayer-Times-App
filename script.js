let btnGetTimes = document.querySelector(".sec-city button");
let input = document.querySelector(".sec-city input");
let timesContainer = document.querySelector(".times");

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

btnGetTimes.addEventListener("click", () => {
  if (input.value !== "") {
    getPrayerTimes(input.value);
  } else {
    // TODO: handel alert to user not enter city
    alert("Please enter a city name ");
  }
});

// **********
// **********
// **********
async function getPrayerTimes(cityName) {
  let params = {
    country: "EGY",
    city: cityName,
  };

  try {
    let response = await axios.get("https://api.aladhan.com/v1/timingsByCity", {
      params: params,
    });

    const returnedCity = response.data.data.meta.timezone;
    // Check if the returned timezone includes the city name
    if (
      !returnedCity.toLowerCase().includes(cityName.toLowerCase()) &&
      cityName.length > 2
    ) {
      // TODO: handel alert it
      alert("City not found. Please enter a valid city name");
      return;
    }

    changePrayerTimesByCity(response, cityName);
  } catch (error) {
    console.log(error);
    // TODO: handel alert to request fail
    alert("City not found. Please enter a valid city name");
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
