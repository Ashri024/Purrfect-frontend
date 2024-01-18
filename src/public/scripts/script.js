let isDarkMode=$("html").hasClass("dark");
let globalDataValues = [20, 22, 25, 23, 26, 27, 24, 22];
let chart;
let hourFormat24 = localStorage.getItem("hourFormat24")|| "false";
console.log("hourFormat24: ",hourFormat24);
let tempUnit= localStorage.getItem('tempUnit') || "\u00B0";

let tempWord=localStorage.getItem("tempWord");
if(tempWord==null || tempWord==undefined){
  localStorage.setItem("tempWord", "C");
  tempWord="C";
}

let precipitationUnit= localStorage.getItem("precipitationUnit");
if(precipitationUnit==null || precipitationUnit==undefined){
  localStorage.setItem("precipitationUnit", "mm");
  precipitationUnit="mm";
}

let windUnit= localStorage.getItem("windUnit");
if(windUnit==null || windUnit==undefined){
  localStorage.setItem("windUnit", "km/h");
  windUnit="km/h";
}

let pressureUnit= localStorage.getItem("pressureUnit");
if(pressureUnit==null || pressureUnit==undefined){
  localStorage.setItem("pressureUnit", "hPa");
  pressureUnit="hPa";
}

let visibilityUnit=localStorage.getItem("visibilityUnit");
if(visibilityUnit==null || visibilityUnit==undefined){
  localStorage.setItem("visibilityUnit", "m");
  visibilityUnit="m";
}

const canvas = document.getElementById('myChart');
let ctx;
if(canvas){
  ctx = canvas.getContext('2d');
}
let labels="";
if(hourFormat24 == "false"){
labels=["1 AM","4 AM","7 AM","10 AM","1 PM","4 PM","7 PM","10 PM"];
}else if(hourFormat24 == "true"){
  labels=["01:00", "04:00", "07:00", "10:00", "13:00", "16:00", "19:00", "22:00"];
}

let minTicks="";
let maxTicks="";
function createChart(dataValues){
let isDarkMode = document.documentElement.classList.contains('dark');
let maxValue= Math.max(...dataValues)+5;
let minValue= Math.min(...dataValues)-5;
let backgroundColor = isDarkMode ? '#ffffff40' : '#eef6ff';
let labelColor = isDarkMode ? '#fff' : '#000';
Chart.register(ChartDataLabels);
Chart.register({
  id: 'customPlugin',
  afterUpdate: function(chart, options) {
    let yScale = chart.scales.y;
    let ticks = yScale.getTicks();
    if (ticks.length > 0) {
      let minValue = ticks[0].value;
      let maxValue = ticks[ticks.length - 1].value;
      minTicks=minValue;
      maxTicks=maxValue;
    }
  }
});

chart=new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: '24 Hour Forecast',
      data: dataValues,
      fill: true,
      borderColor: labelColor,
      backgroundColor: backgroundColor, 
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: {
          display: false,
        },
        suggestedMax: maxValue,
        suggestedMin: minValue,
       
        ticks: {
          stepSize: 5,
          color: labelColor,

        }
      },
      x: {
        grid: {
          display: false // Hide grid lines on the x-axis
        },
        ticks: {
          color: labelColor // Set color of x-axis labels
        }
      }
    },
    plugins: {
      tooltip: {
        enabled: false // Disable default tooltips
      },
      legend: {
        display: false
      },
      datalabels: {
        align: 'end',
        anchor: 'end',
        color: labelColor ,
        formatter: function(value, context) {
          value = `${value} ${tempUnit}${tempWord} `;
          return value.toString();
        }
      }
  }
}});
}

const darkMode=$(".darkMode");
darkMode.each(function(){
  $(this).click(function(){
    isDarkMode= !isDarkMode;
    $("html").toggleClass("dark");
    if(canvas){
    chart.destroy();
    createChart(globalDataValues);
  }
    localStorage.setItem('darkMode', isDarkMode);
  })
})
$(document).ready(function(){


if(localStorage.getItem('darkMode') === 'true'){
  $("html").addClass("dark");
  isDarkMode=true;
}else{
  $("html").removeClass("dark");
  isDarkMode=false;
}

if(canvas)
  createChart(globalDataValues);

  const imgWidth = 50; // Width of the image

  function calculatePositions(canvas, data) {
    const chartArea = canvas.getBoundingClientRect();
    const scale = (chartArea.width - imgWidth) / (Math.max(...data) - Math.min(...data));

    const images = document.querySelectorAll('#graphContainer img');

    images.forEach((img, i) => {
      let canvaRealWidth= canvas.clientWidth-60;
      let space = canvaRealWidth/7;

        let posLeft= 26+space*i;

        img.style.left= `${posLeft}px`;

        let canvaseREalHeight= canvas.clientHeight-30;
        let totalDeg= maxTicks-minTicks;
        let oneDeg= canvaseREalHeight/totalDeg;

        let posBottom= oneDeg* (Math.floor(data[i])-(minTicks-2));
        img.style.bottom= `${posBottom}px`
    });
}
// Call the function passing the canvas and data values
if(canvas){
calculatePositions(canvas, globalDataValues);
}

  const sunny= ["#ff9900", "#fdf966","#6e6b02","#ffe23e" ];
  const snowy= ["#9f9f8f", "#ffffff","#494942","#ffffff" ];
  const rainy= ["#8393ef", "#0e1cf9","#4400f9","#979dfc" ];
  const thunder= ["#9900a3", "#c800fd","#600067","#f5d2ff" ];
  let forecastSelect= document.getElementById("forecast");

  if(forecastSelect)
  NiceSelect.bind(forecastSelect);
  
  var slider = document.querySelectorAll('.dropdown-content');
  var isDown = false;
  var startX;
  var scrollLeft;

  slider.forEach(slider=>{
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  })

  $(".profileBtn").each(function(i, profileBtn){
    $(profileBtn).click(function(event){
      $($('.pfpDropDown')[i]).toggleClass('hidden');
      event.stopPropagation(); // Prevent this click from triggering the document click event below
    });
  });

  

let loginUrl= `${backend_Url}/login`
  if(document.getElementById('loginForm')){
  document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    let emailField = document.getElementById('email');
    let passwordField = document.getElementById('password');

    fetch(loginUrl,{
      method:"POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        email: emailField.value,
        password:passwordField.value
      })
    
    }).then(res=>{
      if(!res.ok){
        throw new Error(res.status);
      }
      return res.json();
    })
      .then(data=>{
      var date = new Date();
      // if(data.email){
      date.setHours(date.getHours() + 1);
      var expires = "; expires=" + date.toGMTString();
      console.log("Email backend data: ",data);
      document.cookie = `jwt0=${data.token}; path=/; Secure; SameSite=None${expires}`;
      document.cookie = `loggedIn=${data.loggedIn}; path=/; Secure; SameSite=None${expires}`;
      document.cookie = `email=${data.email}; path=/; Secure; SameSite=None${expires}`;
      localStorage.setItem('loggedInRecently', "true");
      window.location.replace(`/`);
      // }else{
      //   console.log("Error, ", data);
      // }
    }).catch(err=>{
      console.log("Sorry the email was not found: ",err);
      $(".loginPage .error").html(`<img src="./resources/error.svg" alt="Error">
      <span>Login credentials are invalid</span>`).addClass("errorInfoVisible");
      setTimeout(() => {
        $(".loginPage .error").removeClass("errorInfoVisible");
      }, 3000);

    });

});}

  if(document.getElementById('signUpForm')){
  document.getElementById('signUpForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    let name = document.getElementById('name');
    let password = document.getElementById('passwordSignUp');
    let confirmPass = document.getElementById('confirmPass');
    let phone = document.getElementById('phone');
    let emailField = document.getElementById('emailSignUp');
    
    fetch(`${backend_Url}/signUp`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailField.value,
        password: password.value,
        phone: phone.value,
        name: name.value,
        confirmPass: confirmPass.value
      }),
    }).then(res => {
      if(!res.ok){
        return res.json().then(err=>{
        throw new Error(err.error);
        })
      }
      return res.json();
    }).then(data=>{
      if(data.status){
        localStorage.setItem('registered', true);
        localStorage.setItem("signUpPage", false);
        window.location.replace(`/login`);
      }
    })
    .catch(err => {
      console.log(err.message);
      let errorMessage = err.message;
      if (errorMessage.includes("E11000 duplicate key error")) {
        let fieldName = errorMessage.split("index: ")[1].split("_")[0];
        errorMessage = `${fieldName} is already registered`;
      } else if (err.name === 'ValidationError') {
        errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
      }
      errorMessage = errorMessage.replace("Register validation failed: ", "");

      console.log("Error while signUp: ", errorMessage);
      $(".loginPage .error").html(`<img src="./resources/error.svg" alt="Error">
      <span>${errorMessage}</span>`).addClass("errorInfoVisible");
      setTimeout(() => {
        $(".loginPage .error").removeClass("errorInfoVisible");
      }, 5000);
    });

});}

$(".loginPage .info").each(function(i, info){
  let isRegisteredRecently= localStorage.getItem("registered");
  if(isRegisteredRecently=="true"){
  $(info).html(`<img src="./resources/info.svg" alt="Success">
  <span>Account created successfully</span>`).addClass("errorInfoVisible");
  localStorage.removeItem("registered");
  setTimeout(() => {
    $(info).removeClass("errorInfoVisible");
  }, 3000);
}
});

$(".homePage .info").each(function(i, info){
  let isLoggedInRecently= localStorage.getItem("loggedInRecently");
  let isLoggedOutRecently = localStorage.getItem("loggedOutRecently");
  if(isLoggedInRecently=="true"){
    $(info).html(`<img src="./resources/info.svg" alt="Success">
    <span>Logged in successfully</span>`).addClass("errorInfoVisible");
    localStorage.removeItem("loggedInRecently");
    setTimeout(() => {
      $(info).removeClass("errorInfoVisible");
    }, 3000);
    return;
}
  if(isLoggedOutRecently=="true"){
    $(info).html(`<img src="./resources/info.svg" alt="Success">
    <span>Logged out successfully</span>`).addClass("errorInfoVisible");
    localStorage.removeItem("loggedOutRecently");
    setTimeout(() => {
      $(info).removeClass("errorInfoVisible");
    }, 3000);
    return;
  }
});

  $(".logout").each(function(i, logoutBtn){
    $(logoutBtn).click(function(){
      //remove all the set cookies
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      localStorage.setItem('loggedOutRecently', "true");
      window.location.replace(`/`);
    });
  });

  function search_box_responsive(){
    console.log("responsive");
    $(".search_box").each(function(i, searchBox){
      $(searchBox).click(function(event){

        event.stopPropagation();
        $(this).addClass("search_box_visible");
        $(this).find("input[type='search']").removeClass("max-[830px]:hidden");
        $(this).find("input[type='search']").addClass("max-[830px]:block");
      })
    })
  }

  $(document).click(function() {
    $('.pfpDropDown').addClass('hidden'); 
    $(".city_list").empty();
    $(".search_box").removeClass("search_box_visible");
    $(".search_box").find("input[type='search']").removeClass("max-[830px]:block");
    $(".search_box").find("input[type='search']").addClass("max-[830px]:hidden");
    //prevent the propagation of search box

  });
window.addEventListener("resize", function(){
  if(window.innerWidth<830){
   search_box_responsive();
  }
});

search_box_responsive();

  // MAIN APP STARTS HERE

  // SEARCH BOX FUNCTIONALITY
  let selectedIndex =-1;
  $("#search_city").keydown(function (e) {
    let city_list = $(".city_list");
    let cityItems = city_list.children();

    if (e.keyCode == 38) { // up arrow
        if (selectedIndex > 0) {
            selectedIndex--;
            updateSelection();
        }
    } else if (e.keyCode == 40) { // down arrow
        if (selectedIndex < cityItems.length - 1) {
            selectedIndex++;
            updateSelection();
        }
    } else if (e.keyCode == 13) { // Enter key
        let selectedCity = cityItems.eq(selectedIndex);
        selectedCity.click();
        city_list.empty();
    }
});

function updateSelection() {
    let city_list = $(".city_list");
    let cityItems = city_list.children();
    console.log(selectedIndex);
    cityItems.removeClass('selected');
    cityItems.eq(selectedIndex).addClass('selected');
    cityItems[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

  $("#search_city").on("keyup", function(e) {
    let value = $(this).val().toLowerCase();
    $("#search_city").val(value);
    let city_list = $(".city_list");
    if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13){
    if(value.trim().length>0){
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value.trim()}&count=15&language=en&format=json`).then(res=>res.json()).then(data=>{
        if(data.results){
        let cities=data.results;

        city_list.empty();

        cities.forEach(city=>{
          let cityLi = $("<li></li>")
          .addClass("border-b border-b-black px-4 py-2 flex flex-row items-center cursor-pointer hover:bg-[lightgray] ")
          .html(
            `<i class="fa-solid fa-location-dot text-3xl mr-4"></i>
            <div class="flex flex-col">
              <span class="font-medium text-lg"> ${city.name}, ${city.admin1 ? city.admin1+",": ""} ${city.country? city.country:""}</span>
              <div class="text-sm text-gray-600">
                <span>${city.latitude ? "Lat: "+ city.latitude +", " : ""}</span>
                <span>${city.longitude ? "Lon: "+ city.longitude : ""}</span>
              </div>
            </div>
           `
            )
          .click(async function(){
            let isSearched=true;
            let location =`${city.name}, ${city.admin1 ? city.admin1+",": ""} ${city.country? city.country:""} `;
            let location2 =`${city.name}, ${city.admin1 ? city.admin1: ""} `;
            
            let latitude= city.latitude;
            let longitude= city.longitude;
            localStorage.setItem('location', location2);
            localStorage.setItem('lat', latitude);
            localStorage.setItem('lon', longitude);

            if(window.location.pathname!=="/"){
            redirect(isSearched);
            return;
            }
            $("#search_city").val(location);
            city_list.empty();
            $(".shimmer, .dark-shimmer, .dark-sub-shimmer").css("display", "inline-block");
            loadHomePage(latitude, longitude,location2, isSearched);

          });
          
          city_list.append(cityLi);
        })
      }
      })
    }
  }
  });

  async function searchCity(lat,lon,location){
    let isSearched=true;
    console.log("searchCity is called");
    localStorage.setItem('location', location);
            localStorage.setItem('lat', lat);
            localStorage.setItem('lon', lon);
            $("#search_city").val(location);
            $(".shimmer, .dark-shimmer, .dark-sub-shimmer").css("display", "inline-block");
            redirect(isSearched);
  }

  function redirect(isSearched){
          localStorage.setItem('isSearched', isSearched);
            window.location.href="/";
          console.log("True");
}

  function loadMainCard(location,min,max,currDate,precipitation,humidity,feelsLike,temp,desc, weatherIcon,weatherBg){
    $(".location span").html(location);

    let min2= convertTemp(min, tempWord);
    let max2 = convertTemp(max, tempWord);
    $(".min").html(`Min: ${min2.temp2}${min2.tempUnit2}`);
    $(".max").html(`Max: ${max2.temp2}${max2.tempUnit2}`);

    console.log("Hour",hourFormat24);
    if(hourFormat24 == "true"){
    let currDate2= convertTo24Hour(currDate);
    $(".date span").html(currDate2);
    } else{
    $(".date span").html(currDate);
    }

    let precipitation2= convertPrecipitation(precipitation, precipitationUnit);
    $(".precipitation span").html(`Precipitation: ${precipitation2}${precipitationUnit} `);

    $(".humidity span").html(`Humidity: ${humidity}%`);
    let feelsLike2 = convertTemp(feelsLike, tempWord);
    $(".feelsLike span").html(`Feels Like: ${feelsLike2.temp2} ${feelsLike2.tempUnit2}${tempWord}`);

    let {temp2, tempUnit2}= convertTemp(temp, tempWord);
    $(".main_temp").html(`<span class="temperature font-bold text-[3rem] min-[1400px]:text-[5rem]">${temp2}${tempUnit2}</span>${tempWord}</div>`);

    $(".status").html(desc);
    $(".weatherIcon").attr("src", weatherIcon);
  }

  function convertTo24Hour(timeStr) {
    const [fullDate, timePart] = timeStr.split(' | ');
    let [time, period] = timePart.split(' ');

    let [hours, minutes] = time.split(':');
    hours = +hours; // convert to number

    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    // Ensure hours and minutes are two digits
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.padStart(2, '0');

    return `${fullDate} | ${hours}:${minutes}`;
}

  function convertPrecipitation(precipitation, precipitationUnit){
    if(precipitationUnit==="mm"){
      return precipitation
    } else if(precipitationUnit==="in"){
      return Math.round(precipitation/25.4);
    }else if (precipitationUnit==="cm"){
      return Math.round(precipitation/10);
    }
  }
  function convertTemp(temp, tempWord){
    if(tempWord==="C"){
      return {temp2:temp, tempUnit2: "&#176;"};
    }else if(tempWord==="F") {
      return {temp2:Math.round((temp*9/5)+32), tempUnit2: " "};
    }else if(tempWord==="K"){
      return {temp2:Math.round(temp+273.15), tempUnit2: " "};
    }
  }

  function getWindStatus(windSpeed) {
    if (windSpeed < 1) {
      return 'Calm';
    } else if (windSpeed <= 5) {
      return 'Light Air';
    } else if (windSpeed <= 11) {
      return 'Light Breeze';
    } else if (windSpeed <= 19) {
      return 'Gentle Breeze';
    } else if (windSpeed <= 28) {
      return 'Moderate Breeze';
    } else if (windSpeed <= 38) {
      return 'Fresh Breeze';
    } else if (windSpeed <= 49) {
      return 'Strong Breeze';
    } else if (windSpeed <= 61) {
      return 'Near Gale';
    } else if (windSpeed <= 74) {
      return 'Gale';
    } else if (windSpeed <= 88) {
      return 'Strong Gale';
    } else if (windSpeed <= 102) {
      return 'Storm';
    } else if (windSpeed <= 117) {
      return 'Violent Storm';
    } else {
      return 'Hurricane Force';
    }
  }

  function getPressureCategory(pressure) {
    if (pressure < 980) {
        return {
            pressure_status: 'Very Low Pressure',
            pressure_deg: -105
        };
    } else if (pressure <= 1000) {
        return {
            pressure_status: 'Low Pressure',
            pressure_deg: -65
        };
    } else if (pressure <= 1013) {
        return {
            pressure_status: 'Normal Pressure',
            pressure_deg: 0
        };
    } else if (pressure <= 1030) {
        return {
            pressure_status: 'High Pressure',
            pressure_deg: 60
        };
    } else {
        return {
            pressure_status: 'Very High Pressure',
            pressure_deg: 113
        };
    }
}
  function getVisibilityCategory(visibility) {
    if (visibility > 10) {
      return 'Excellent Visibility';
    } else if (visibility >= 5) {
      return 'Good Visibility';
    } else if (visibility >= 2) {
      return 'Moderate Visibility';
    } else if (visibility >= 1) {
      return 'Poor Visibility';
    } else {
      return 'Very Poor Visibility';
    }
  }
  function getUVIndexCategory(uvIndex) {
    if (uvIndex <= 2) {
        return {
            uv_status: 'Low UV Index',
            uv_degree: -105
        };
    } else if (uvIndex <= 5) {
        return {
            uv_status: 'Normal UV Index',
            uv_degree: -65
        };
    } else if (uvIndex <= 7) {
        return {
            uv_status: 'Moderate UV Index',
            uv_degree: 0
        };
    } else if (uvIndex <= 10) {
        return {
            uv_status: 'High UV Index',
            uv_degree: 60
        };
    } else {
        return {
            uv_status: 'Extreme UV Index',
            uv_degree: 113
        };
    }
}
  function getEAQICategoryAndDescription(eaqi) {
    let category, description, aqui_deg;

    if (eaqi <= 25) {
      category = 'Very Low (Good)';
      description = 'The air is very good, you can breathe freely. 😊';
      aqui_deg = -90;
    } else if (eaqi <= 50) {
      category = 'Low (Good)';
      description = 'The air quality is good, enjoy the fresh air! 😊';
      aqui_deg = -45;

    } else if (eaqi <= 75) {
      category = 'Moderate';
      description = 'Air quality is acceptable, but sensitive individuals may experience slight health effects. 🌤️';
      aqui_deg = 0;

    } else if (eaqi <= 100) {
      category = 'High';
      description = 'Members of sensitive groups may experience health effects. Take precautions if needed. 😷';
      aqui_deg = 50;

    } else if (eaqi <= 150) {
      category = 'Very High';
      description = 'Everyone may begin to experience adverse health effects. Consider reducing outdoor activities. 🚫';
      aqui_deg = 70;
    } else {
      category = 'Extremely High';
      description = 'Health warnings of emergency conditions. Take immediate actions to protect yourself. 🚨';
      aqui_deg = 105;
    }

    return { category, description, aqui_deg};
  }
  function convertTime(time) {
    let dateObj = new Date(time);
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let period = hours >= 12 ? 'PM' : 'AM';

    if (hourFormat24 == "true") {
      // For 24-hour format, we don't need to adjust hours or add a period
      hours = hours < 10 ? '0' + hours : hours;
    } else {
      // For 12-hour format, adjust hours and add period
      hours = hours % 12;
      hours = hours ? hours : 12; 
      hours = hours < 10 ? '0' + hours : hours;
    }

    minutes = minutes < 10 ? '0' + minutes : minutes;
    let timeStr = hourFormat24 == "true" ? hours + ':' + minutes : hours + ':' + minutes + ' ' + period;
    return timeStr;
  }
  function convertWindSpeed(wind_speed, windUnit){
    if(windUnit==="km/h"){
      return wind_speed.toFixed(3);
    } else if(windUnit==="m/s"){
      return (wind_speed / 3.6).toFixed(3);
    } else if(windUnit==="mph"){
      return (wind_speed * 0.621371).toFixed(3);
    } else if(windUnit==="knots"){
      return (wind_speed * 0.539957).toFixed(3);
    }
  }

  function convertPressure(pressure, pressureUnit){
    if(pressureUnit==="hPa"){
      return pressure.toFixed(3);
    } else if(pressureUnit==="inHg"){
      return (pressure / 33.863886666667).toFixed(3);
    } else if(pressureUnit==="psi"){
      return (pressure * 0.0145038).toFixed(3);
    } else if(pressureUnit==="kPa"){
      return (pressure / 10).toFixed(3);
    }
  }

  function convertVisibility(visibility, visibilityUnit){
    if(visibilityUnit==="m"){
      return visibility.toFixed(3);
    } else if(visibilityUnit==="km"){
      return (visibility / 1000).toFixed(3);
    } else if(visibilityUnit==="miles"){
      return (visibility / 1609.344).toFixed(3);
    }
  }

  function loadDetailCards(wind_speed,pressure,uv_index,visibility,air_pm25,air_pm10,aqi,sunrise,sunset)
  {
    let wind_speed2= convertWindSpeed(wind_speed, windUnit);
    $(".wind_speed").html(`${wind_speed2} ${windUnit}`);
    $(".wind_status").html(`${getWindStatus(wind_speed)}`);

    let pressure2 = convertPressure(pressure, pressureUnit);
    $(".pressure").html(`${pressure2} ${pressureUnit}`);
    let { pressure_status, pressure_deg } = getPressureCategory(pressure);
    $(".pressure_status").html(`${pressure_status}`);
    $(".pressure_dark_dial").css("transform", `rotate(${pressure_deg}deg)`);
    $(".pressure_light_dial").css("transform", `rotate(${pressure_deg}deg)`);

    $(".uv_index").html(`${uv_index} UV`);
    let { uv_status, uv_degree } = getUVIndexCategory(uv_index);
    $(".uv_index_status").html(`${uv_status}`);
    $(".uv_dark_dial").css("transform", `rotate(${uv_degree}deg)`);
    $(".uv_light_dial").css("transform", `rotate(${uv_degree}deg)`);

    let visibility2 = convertVisibility(visibility, visibilityUnit);
    $(".visibility").html(`${visibility2} ${visibilityUnit}`);
    $(".visibility_status").html(`${getVisibilityCategory(visibility)}`);

    $(".air_pm25").html(`Pm2.5: ${air_pm25} &#181;g/m<sup>3</sup>`);
    $(".air_pm10").html(`Pm10: ${air_pm10} &#181;g/m<sup>3</sup>`);
    $(".aqi").html(`European AQI: ${aqi} EAQI`);
    let { category, description, aqui_deg } = getEAQICategoryAndDescription(aqi);
    $(".aqi_status").html(`${category}`);
    $(".aqi_description").html(`${description}`);
    $(".air_dial").css("transform", `rotate(${aqui_deg}deg)`);
    
    $(".sunset_time").html(`${convertTime(sunset)}`);
    $(".sunrise_time").html(`${convertTime(sunrise)}`);

  }
  
  function load24HourChart(hourly_temp,weather_code){
    let three_hour=[1,4,7,10,13,16,19,22];  
    let hourly_temp_3_hour=[];
    let weather_code_3_hour=[];
    for(let i =0; i<8; i++){
      let three_hour2= convertTemp(hourly_temp[three_hour[i]], tempWord);
      hourly_temp_3_hour.push(three_hour2.temp2);
      weather_code_3_hour.push(weather_code[three_hour[i]]);
    }
    let dataValues=hourly_temp_3_hour;
    globalDataValues=dataValues;
    chart.destroy();
    createChart(dataValues);
    calculatePositions(canvas, dataValues);
    window.addEventListener("resize", () => calculatePositions(canvas, dataValues));
    
  }
  
let globalLat=0;
let globalLon=0;
$('tr[id]').each(function() {
  $(this).on('click', function() {
    const targetRow = $(`tr[data-target="${this.id}"]`);
    targetRow.find('.dropdown-content').toggleClass('h-[150px]');
    targetRow.find('.dropdown-content').toggleClass('opacity-0');
    targetRow.find('.dropdown-content').toggleClass('h-[0px]');
    targetRow.toggleClass('tr_margin_bottom');
  })})

  function closeAllForecastCards(){
    console.log("closeAllForecastCards");
  $('tr[id]').each(function() {
    const targetRow = $(`tr[data-target="${this.id}"]`);
    targetRow.find('.dropdown-content').removeClass('h-[150px]');
    targetRow.find('.dropdown-content').addClass('opacity-0');
    targetRow.find('.dropdown-content').addClass('h-[0px]');
    targetRow.removeClass('tr_margin_bottom');
  })
}

  function loadForecastHourly(){
    $('tr[id]').each(function() {
      $(this).on('click', function() {
        loadOnClick(globalLat,globalLon, $(this));
      });
    });
    }
    function convertLabelTime(label) {
      let [hour, period] = label.split(" ");
  
      hour = parseInt(hour);
  
      if (period === "PM" && hour !== 12) {
          hour += 12;
      } else if (period === "AM" && hour === 12) {
          hour = 0;
      }
  
      return hour.toString().padStart(2, '0').padEnd( 5,":00");
  }

  function loadOnClick(lat, lon, data_target){
      const targetRow = $(`tr[data-target="${data_target.attr("id")}"]`);
      if(targetRow.attr('infoSet') === 'false'){
        let date = data_target.attr('forecast_date');
        fetch(`${backend_Url}/hourlyForecast?lat=${lat}&lon=${lon}&startDate=${date}`).then(res=>res.json()).then(data=>{
          targetRow.attr('infoSet', 'true');
          let hourlyObj= data.hourObj;
          for(let i=0; i<hourlyObj.length; i++){
            targetRow.find(".dropdown-item").eq(i).find(".detail_icon").attr("src", hourlyObj[i].weatherIcon);

            let labelTime2= convertLabelTime(hourlyObj[i].label);
            targetRow.find(".dropdown-item").eq(i).find(".detail_time").html(labelTime2);

            let detail_temp= convertTemp(hourlyObj[i].temperature, tempWord);
            targetRow.find(".dropdown-item").eq(i).find(".detail_temp").html(`${detail_temp.temp2} ${detail_temp.tempUnit2}${tempWord}`);
          }
        targetRow.find(".dark-sub-shimmer").css("display", "none");

        })
      }
     
    }

  loadForecastHourly();

  function loadForecastSection(lat,lon){
    return new Promise((resolve, reject)=>{
      try{
    let forecastSelect= document.getElementById("forecast");
    let forecast= forecastSelect.value;

    fetch(`${backend_Url}/forecast?lat=${lat}&lon=${lon}&forecast_days=${forecast}`).then(res=>res.json()).then(data=>{
      let forecastArray= data.forecastArray;
      for(let i =0; i<forecastArray.length; i++){
        let forecast= forecastArray[i];
        let day= forecast.day;
        let desc = forecast.weatherDescription;
        let min= forecast.temperature_min;
        let max= forecast.temperature_max;
        let weatherIcon= forecast.weatherIcon;
        let forecast_id= `row${i+1}`;
        let forecastRow= $(`#${forecast_id}`);
        let date= forecast.date;
        forecastRow.attr("forecast_date", date);
        forecastRow.find(".forecast_day").html(day);
        forecastRow.find(".forecast_desc").html(desc);
        forecastRow.find(".forecast_desc").attr("title", desc);

        let min2= convertTemp(min, tempWord);
        forecastRow.find(".forecast_min").html(`${min2.temp2} ${min2.tempUnit2}${tempWord}`);
        let max2= convertTemp(max, tempWord);
        forecastRow.find(".forecast_max").html(`${max2.temp2} ${max2.tempUnit2}${tempWord}`);
        forecastRow.find(".forecast_icon").attr("src", weatherIcon);
      }
    })
    resolve(true);
  }
    catch(err){
      reject(err);
    }
  })
  }

  function forecastSelectVisible(forecast){
    let numberOfForecastVisible = $("tr[id]:not(.hidden)").length;
    if(forecast>numberOfForecastVisible){
      for(let i=numberOfForecastVisible; i<forecast; i++){
    for(let i=0; i<forecast; i++){
    $("tr[id]").eq(i).removeClass("hidden");
    // console.log($("tr[data-target]").eq(i));
    $("tr[data-target]").eq(i).removeClass("tr-hidden");
    }
  } }
  else if(forecast<numberOfForecastVisible){
    for(let i=forecast; i<numberOfForecastVisible; i++){
      $("tr[id]").eq(i).addClass("hidden");
      $("tr[data-target]").eq(i).addClass("tr-hidden");
      }
    } 
}

  $("#forecast").on("change", function(){
    let forecast= $(this).val();
    forecastSelectVisible(forecast);
  })

  let email=null;
  let cookies = document.cookie.split('; ');
  if(cookies.length>1){
  email = cookies.find(row => row.startsWith('email=')).split('=')[1];
  console.log(email)
}
console.log("Email: ", email);

  function loadHomePage(lat,lon, location, isSearched=false){
  globalLat=lat;
  globalLon=lon;
  closeAllForecastCards();
  let forecast= document.getElementById("forecast").value;
  forecastSelectVisible(forecast);
  console.log("Frontend query lat, lon, location :", lat, lon,location);
  console.log(`${backend_Url}/weather?lat=${lat}&lon=${lon}&current=temperature_2m&forecast_days=1`);
    fetch(`${backend_Url}/weather?lat=${lat}&lon=${lon}`).then(res=>res.json()).then(data=>{

      //Received all the data now retrieving data for main Card
      const now = new Date();
      const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      let weatherData= data.WeatherData;
      let weatherImg= data.weatherImg;
      let weatherDescription= data.weatherDescription;

      //Main cards info

      const currDate = now.toLocaleString('en-US', options).replace(' at ', ' | ');
      const temp=weatherData.current.temperature_2m;
      const min= weatherData.daily.temperature_2m_min[0];
      const max= weatherData.daily.temperature_2m_max[0];
      const feelsLike= weatherData.current.apparent_temperature;
      const humidity= weatherData.current.relative_humidity_2m;
      const precipitation= weatherData.current.precipitation;
      const weatherIcon= weatherImg.icon;
      const weatherBg= weatherImg.url;
      console.log("Weather Bg obtained: ",weatherBg);
      const desc= weatherDescription.desc;

      loadMainCard(location,min,max,currDate,precipitation,humidity,feelsLike,temp,desc, weatherIcon,weatherBg);

     //Send the city card data to mongo

     let date = new Date(Date.now());
     let optionsDB = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' };
     currentDateDb= date.toLocaleDateString('en-US') + ', ' + date.toLocaleTimeString('en-US', optionsDB);

     let searchedArg = localStorage.getItem('isSearched');
     if(searchedArg === 'true'){
    isSearched =searchedArg;
    localStorage.setItem('isSearched', false);
  }
  console.log("BEfore search", isSearched);
     if(isSearched && email){
            fetch(`${backend_Url}/addCity`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: email,
                location: location,
                lat: lat,
                lon: lon,
                current_temp: temp,
                min: min,
                max: max,
                precipitation: precipitation,
                humidity: humidity,
                icon: weatherIcon,
                date: currentDateDb
              }),
            }).then(res => {
              return res.json();
            }).then(data=>{
              console.log("Data is added to mongo Successfully: ",data);
            }).catch(err=>{
              console.log("Mongo Error",err.message);
              $(".homePage .error").html(`<img src="./resources/error.svg" alt="Error">
              <span>Some error occured. Please search another location.</span>`).addClass("errorInfoVisible");
              setTimeout(() => {
                $(".homePage .error").removeClass("errorInfoVisible");
              }, 3000);
              throw new Error("Mongo Error",err.message);
            });
          }else{
            console.log("Email not provided or is not being searched");
          }

      let img = new Image();

      if(weatherBg && weatherBg.code != "not_found"){
        img.src = weatherBg;
      } else {
        weatherBg = "https://f005.backblazeb2.com/file/WeatherApp/windy.png";
        img.src = weatherBg;
      }

      img.onload = function() {
        console.log("Weather bg loaded");
        $(".weather_main_card_before").css("background", `url(${weatherBg})`);
        $(".weather_main_card .dark-sub-shimmer").css("display", "none");
        $(".weather_main_card .dark-shimmer").css("display", "none");
        $("#search_city").val("");
      }
     
      //Loadiing Detail Cards
      const currentHour= new Date().getHours();
      const wind_speed= weatherData.current.wind_speed_10m;
      const pressure= weatherData.current.pressure_msl;
      const uv_index= weatherData.daily.uv_index_max[0];
      const visibility = weatherData.hourly.visibility[currentHour];
      const air_pm25 = data.AirQuality.current.pm2_5;
      const air_pm10 = data.AirQuality.current.pm10;
      const aqi = data.AirQuality.current.european_aqi;
      const sunrise = weatherData.daily.sunrise[0];
      const sunset = weatherData.daily.sunset[0];

      loadDetailCards(wind_speed,pressure,uv_index,visibility,air_pm25,air_pm10,aqi,sunrise,sunset);
      $(".detail_cards .dark-sub-shimmer").css("display", "none");

      //Load 24 3-hour chart
      let hourly_temp= weatherData.hourly.temperature_2m;
      let weather_code= weatherData.hourly.weather_code;

      load24HourChart(hourly_temp,weather_code);
      $(".dayHourChart .dark-sub-shimmer").css("display", "none");


      //Last thing - Load Forecast Section
      $("tr[infoSet='true']").each(function(i, row){
       $(this).attr("infoSet", "false");
      })
      
      loadForecastSection(lat,lon).then(()=>{
        console.log("Forecast loaded");
        $(".forecast_instance .dark-sub-shimmer").css("display", "none");
      });
    }).catch(err=>{
      console.log(err);
      $(".homePage .error").html(`<img src="./resources/error.svg" alt="Error">
      <span>Some error occured. Please search another location.</span>`).addClass("errorInfoVisible");
      setTimeout(() => {
        $(".homePage .error").removeClass("errorInfoVisible");
      }, 3000);
    })
  }

  var element = document.querySelector('.status');
  if(element)
  $clamp(element, {clamp: 2});
  //check if the link url is of index
  let url = window.location.pathname;
  let location= localStorage.getItem('location');
  let lat= localStorage.getItem('lat');
  let lon= localStorage.getItem('lon');

  if(url === '/'){
    lat= parseFloat(lat);
    lon= parseFloat(lon);
  if(location && typeof location === 'string' && lat && typeof lat === 'number' && lon && typeof lon === 'number'){
    console.log("local storage found: ", location, lat, lon );
    loadHomePage(lat,lon,location);
  }else{
    console.log("false local storage found: ", location, lat, lon );
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    function geoSuccess(pos) {
      let crd = pos.coords;
      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&apiKey=5f1c5a1a3ba542738941b4df2036f8a9`).then(res=>res.json()).then(data=>{
        console.log(data);
        let city= data.features[0].properties.city;
        let state = data.features[0].properties.state;
        let location = `${city}, ${state}`;
        loadHomePage(crd.latitude, crd.longitude, location);
    });
    }
    function geoError(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      loadHomePage(25,81,"Prayagraj, Uttar Pradesh");
    }
    // loadHomePage(25,81,"Prayagraj, Uttar Pradesh");
  }
  }

  //My city home page script

  let searchHistory = "";

  function loadSearchHistory(searchHistory){
    // console.log("load: ",searchHistory);
    let searchHistoryLength = searchHistory.length;
    let numberOfCities = $(".city").length;
    let citiesToView = searchHistoryLength - numberOfCities-6;
    if(searchHistoryLength == 0 ){
      console.log("No cities to display");
      $(".cities").append("<span class='text-left text-lg text-gray-500 dark:text-gray-400'>No cities to display</span>")
      $(".see_more").css("display", "none");
      $("#deleteHistory").attr("disabled", true);
      return;
    }
    for(let i= searchHistoryLength-numberOfCities-1; i >= citiesToView; i--){
      // console.log(i);
      let city = searchHistory[i];
      // console.log(city);
      if(city){
      let cityName= city.location;
      let min= city.min;
      min= convertTemp(min, tempWord).temp2;
      let max= city.max;
      max= convertTemp(max, tempWord).temp2;
      let temp= city.current_temp;
      temp= convertTemp(temp, tempWord).temp2;
      let precipitation= city.precipitation;
      precipitation = convertPrecipitation(precipitation, precipitationUnit);
      let humidity= city.humidity;
      let weatherIcon= city.icon;
      let date= city.date;
      let lat = city.lat;
      let lon = city.lon;
      
      let cityCard = $(`<div class="city bg-[#EEF6FF] dark:bg-[#ffffff1f] outline-1 outline-white dark:outline rounded-[10px] xl:min-w-[300px] xl:max-w-[410px] md:min-w-[250px] md:max-w-[510px] 2xl:max-w-[1000px] h-[240px] max-[1024px]:h-[340px] max-[1024px]:gap-[5px] flex flex-col items-center max-[1024px]:justify-center justify-around p-4 pt-0 max-[1024px]:p-2 max-[1024px]:pt-0 hover:cursor-pointer relative" title="Click to view in real time" lat="${lat}" lon="${lon}">

      <span class="city_date relative w-full text-right text-gray-500 dark:text-gray-400 text-sm">${date}</span>

      <div class="w-full flex flex-row justify-between max-[1024px]:flex-col gap-[10px]">

          <div class="myCityLocation items-start flex flex-col gap-2 h-fit relative">
          <div class="dark-sub-shimmer"></div>
              <div class="flex gap-2">
                  <img class="w-[25px] dark:hidden mt-1 h-[30px]" src="./resources/dark_profile/map-pin-2-fill.png">
                  <img class="w-[25px] hidden dark:block mt-1 h-[30px]" src="./resources/darkModeIcons/location.svg">
                  <span class="font-bold text-2xl max-[1024px]:text-[1.3rem] max-[1024px]:font-semibold city_location">${cityName}</span>
              </div>
              <span class="ml-7 font-semibold text-xl">Temperature: ${temp}${tempUnit}${tempWord}</span>
              <span class="ml-7">Min: ${min}${tempUnit}${tempWord}</span>
              <span class="ml-7">Max: ${max}${tempUnit}${tempWord}</span>
          </div> 
        <div class="flex flex-col justify-center items-center min-w-[132px] min-h-[130px] relative">
        <div class="dark-sub-shimmer w-[130px] max-[1024px]:m-auto"></div>
        <img src="${weatherIcon}" class="w-[130px] max-[1024px]:m-auto">
        </div>
      </div>
      <div class="w-full pl-7 flex items-center justify-between max-[1024px]:p-0 relative">
      <div class="dark-sub-shimmer"></div>
          <span>Precipitation: ${precipitation} ${precipitationUnit}</span>
          <span>Humidity: ${humidity}%</span>
      </div>
      </div>`);
      
      let city_location = cityCard.find(".city_location");
      $clamp(city_location[0], {clamp: 1});
      $(".cities").append(cityCard);
      cityCard.click(function(){
        let lat = $(this).attr("lat");
        let lon = $(this).attr("lon");
        let location = $(this).find(".city_location").html();
        searchCity(lat, lon, location);
      });
      let img = cityCard.find('img[src="' + weatherIcon + '"]');
      img.on('load', function() {
        cityCard.find(".dark-sub-shimmer").css("display", "none");
      });
      }else{
        console.log("No city tp display");
        return;
      }
    }
  }

  $(".see_more").click(function(){
    loadSearchHistory(searchHistory);
  })
  function loadMyCities(){
    console.log("Loading my cities");
    // let email = localStorage.getItem('email');
    if(email){
    fetch(`${backend_Url}/getCities?email=${email}`).then(res=>res.json()).then(data=>{
      searchHistory = data.searchHistory;
      loadSearchHistory(searchHistory);
      console.log(data);
    })
  }
  }
  if(url === "/myCities"){
    loadMyCities();
  }

  let signUpPage = localStorage.getItem("signUpPage")||"false";

  $("#emailSignUp").on("keyup", function(e) {
    // console.log($(this).val())
    if($(this).val().includes("@gmail.com")) {
      $(".emailToVerify").removeClass("disabledVerify");
    }else{
      $(".emailToVerify").addClass("disabledVerify");
    }
  });
  if($("#emailSignUp").val().includes("@gmail.com")){
    $(".emailToVerify").removeClass("disabledVerify");
  }

  $("#verifyEmail").click(function(e){
    e.preventDefault();
    console.log("clicked");
  
    let emailToVerify = $("#emailSignUp").val();
    if(!emailToVerify.includes("@gmail.com")){
      $(this).addClass("disabledVerify");
      return;
    }
    $(this).removeClass("disabledVerify");
    
    $(".otp-input").each(function(i, input){
      $(input).val("");
    })
  
    //send email the otp
    fetch(`${backend_Url}/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailToVerify }),
    })
    .then(response => response.json())
    .then(data => {
      otp=data.otp;
      $(".loginPage .info").html( 
        `<img src="./resources/info.svg" alt="Success">
        <span>Otp Successfully sent!!. Please check spam folder in case otp is not send or try again later.</span>`
       ).addClass("errorInfoVisible");
      setTimeout(() => {
        $(".loginPage .info").removeClass("errorInfoVisible");
      }, 5000);
      console.log("Otp generated is: ",otp);
      console.log('Success:', data);
    })
    .catch((error) => {
  
      console.error('Error:', error);
      $(".loginPage .error").html(`<img src="./resources/error.svg" alt="Error">
      <span>Some error occured. Please try again.</span>`).addClass("errorInfoVisible");
      setTimeout(() => {
        $(".loginPage .error").removeClass("errorInfoVisible");
      }, 3000);
  
    });
  
    //make visible the otp box
      $("#otpParent").removeClass("hidden").addClass("flex");
      $(".otp-input")[0].focus();
      $("#otpParent").on("keydown",function(e){
        console.log(e.target.id, e.key);
        if(e.key === "Enter"){
          $("#otpBtn").click();
        }
      });
      
  
      $("#otpBtn").click(function(){
        const otpInputs = Array.from(document.querySelectorAll('.otp-input'));
        const otpValues = otpInputs.map(input => input.value);
        let otpEntered = otpValues.join('');
        otpEntered = parseInt(otpEntered);
        console.log(otpEntered);
        $("#otpParent").removeClass("flex").addClass("hidden");
        
      if(otpEntered == otp){
        $("#verifiedTick").removeClass("hidden").addClass("flex");
        $("#verifyEmail").addClass("hidden");
        $("#signUpSubmit").attr("disabled", false);
        $("#emailSignUp").attr("disabled", true);
        $(".editEmail").removeClass("hidden");
      }else{
        $(".loginPage .error").html(`<img src="./resources/error.svg" alt="Error">
        <span>Wrong OTP entered. Please try again.</span>`).addClass("errorInfoVisible");
        setTimeout(() => {
          $(".loginPage .error").removeClass("errorInfoVisible");
        }, 3000);
      
      }
  })
  })
  
  $(".editEmail").click(function(){
    $("#verifiedTick").removeClass("flex").addClass("hidden");
    $("#verifyEmail").removeClass("hidden");
    $("#signUpSubmit").attr("disabled", true);
    $("#emailSignUp").attr("disabled", false);
  });
  $("#signUpRedirect").each(function(i, redirect){
    console.log(redirect);
    if(signUpPage === "true"){
      $("#loginFormParent").removeClass("flex");
      $("#loginFormParent").addClass("hidden");
      $("#signUpFormParent").removeClass("hidden");
      $("#signUpFormParent").addClass("flex");
    }
    $(redirect).on("click",function(){
      console.log("Redirecting to signup");
      localStorage.setItem("signUpPage", "true");
      window.location.href="/login";
    })
    });

    $("#loginRedirect").each(function(i, redirect){ 
    console.log(redirect);

      if(signUpPage === "false"){
        $("#signUpFormParent").removeClass("flex");
        $("#signUpFormParent").addClass("hidden");
        $("#loginFormParent").removeClass("hidden");
        $("#loginFormParent").addClass("flex");
      }
      $(redirect).on("click",function(){
      console.log("Redirecting to login");

        localStorage.setItem("signUpPage", "false");
        window.location.href="/login";
      })
    });
    function generateOtp(){
      let otp = Math.floor(100000 + Math.random() * 900000);
      return otp;
    }
let otp="";


  $('.unit-options input[type=radio]').each(function() {
    $(this).on('change', function() {
      let unitOptionsId = $(this).closest('.unit-options').attr('id');
      let selectedValue = $(this).val();
      if(unitOptionsId === 'tempUnit'){
      localStorage.setItem("tempWord", selectedValue);
      if(selectedValue !== "C"){
      localStorage.setItem("tempUnit", " ");
      }else if(selectedValue ==="C"){
      localStorage.setItem("tempUnit", "\u00B0");
      }
      $(".settingPage .info").addClass("errorInfoVisible");
      setTimeout(function() {
      $(".settingPage .info").removeClass("errorInfoVisible");
      }, 2000);
      }else{
        localStorage.setItem(unitOptionsId, selectedValue);
        $(".settingPage .info").addClass("errorInfoVisible");
        setTimeout(function() {
        $(".settingPage .info").removeClass("errorInfoVisible");
        }, 2000);
      }
    });
  });

  $(".unit-options input[type=radio]").each(function(i, radio){
    let unitOptionsId = $(radio).closest('.unit-options').attr('id');
    let selectedValue = "";
    if(unitOptionsId =="tempUnit"){
      selectedValue = localStorage.getItem("tempWord");
    }else{
     selectedValue = localStorage.getItem(unitOptionsId);
    }
    if(selectedValue){
      $(radio).each(function(i, radio){
        if($(radio).val() === selectedValue){
          $(radio).prop("checked", true);
        }
      })
    }
  });

  $("#toggle-12hour").each(function(i, toggle){
    let isChecked = localStorage.getItem('hourFormat24');
    if(isChecked === "true"){
      $(toggle).prop("checked", true);
    }
  });

  $("#toggle-12hour").on("change", function(){
    let isChecked = $(this).is(':checked');
    localStorage.setItem('hourFormat24', isChecked);

    $(".settingPage .info").addClass("errorInfoVisible");
    setTimeout(function() {
    $(".settingPage .info").removeClass("errorInfoVisible");
    }, 2000);
  });
  
  $("#deleteHistory").click(function(){
    if(email){
      console.log("Deleting data", email);
    fetch(`${backend_Url}/deleteCity?email=${email}`).then(res=>res.json()).then(data=>{
      console.log(data);
      $(".myCitiesPage .info").html(`<img src="./resources/info.svg" alt="Success">
      <span>History deleted successfully!!</span>`).addClass("errorInfoVisible");
      setTimeout(function() {
      $(".myCitiesPage .info").removeClass("errorInfoVisible");
      }, 2000);
      $(".cities").empty();
    })
  }
  })
});
