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
    // test
    alert("Please enter a city");
    // test
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

    changePrayerTimesByCity(response, cityName);
  } catch (error) {
    // TODO: to handel alert to request failed
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
}

function hourFormat(timeStr) {
  const [hourStr, minute] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.
  const hourFormatted = hour.toString().padStart(2, "0");

  return `${hourFormatted}:${minute} ${period}`;
}
