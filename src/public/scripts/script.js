$(document).ready(function(){
  let chart;
  const darkMode=$(".darkMode");
  // darkMode.click(function(){
  //   $("html").toggleClass("dark");
  // })
  darkMode.each(function(){
    $(this).click(function(){
      $("html").toggleClass("dark");
      chart.destroy();
      createChart();
    })
  })
  $('td[id]').each(function() {
    $(this).on('click', function() {
      const targetRow = $(`tr[data-target="${this.id}"]`);
      targetRow.find('.dropdown-content').toggleClass('h-[150px]');
      targetRow.find('.dropdown-content').toggleClass('opacity-0');
      targetRow.find('.dropdown-content').toggleClass('h-[0px]');
      targetRow.toggleClass('tr_margin_bottom');
    });
  });

  const canvas = document.getElementById('myChart');
  let ctx;
  if(canvas){
    ctx = canvas.getContext('2d');
}
  const labels=["1 AM","4 AM","7 AM","10 AM","1 PM","4 PM","7 PM","10 PM"];
  const dataValues = [20, 22, 25, 23, 26, 27, 24, 22];

function createChart(){
  let isDarkMode = document.documentElement.classList.contains('dark');
  let backgroundColor = isDarkMode ? '#ffffff40' : '#eef6ff';
  let labelColor = isDarkMode ? '#fff' : '#000';
  Chart.register(ChartDataLabels);
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
            display: false // Hide the grid lines on the y-axis
          },
          suggestedMax: Math.max(...dataValues) + 2, // Adjust based on data
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
            value = value + '°C';
            return value.toString();
          }
        }
    }
  }});

}

if(canvas)
  createChart();

  const imgWidth = 50; // Width of the image

  if(canvas)
  window.addEventListener("resize", () => calculatePositions(canvas, dataValues));

  function calculatePositions(canvas, data) {
    const chartArea = canvas.getBoundingClientRect();
    const scale = (chartArea.width - imgWidth) / (Math.max(...data) - Math.min(...data));

    const images = document.querySelectorAll('#graphContainer img');
    images.forEach((img, i) => {
        // const left = ((data[i] - Math.min(...data)) * scale) + chartArea.left;
        if(window.innerWidth<600){
          img.style.display="none";
          return;
        }
        let left =Math.floor(i*(100 / 7));
        
        console.log(left);
        if(i==0) {img.style.left="10px";}
        else if(i==images.length-1){
          left= `calc(${left}% - 50px)`;
          img.style.left = `${left}`;
        }
        else if(left<50) {
          img.style.left = `${left}%`;
        }
        else{
          left= `calc(${left}% - ${img.clientWidth -10}px)`;
          console.log(left);
          img.style.left = `${left}`;
        }

        if(window.innerWidth>1280)
        img.style.bottom= `${(dataValues[i]-20)*14}px`
        else{
          img.style.bottom= `${(dataValues[i]-20)*16}px`
        }
    });
}
// Call the function passing the canvas and data values
if(canvas){
calculatePositions(canvas, dataValues);
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
console.log("hello");
  $(".profileBtn").each(function(i, profileBtn){
    $(profileBtn).click(function(){
      console.log("clicked");
      $($('.pfpDropDown')[i]).toggleClass("hidden");
    });
  });

  // console.log(document.getElementById('loginForm'))
console.log("THe : ",backend_Url);
// backend_Url= backend_Url;
let loginUrl= `${backend_Url}/login`
console.log(loginUrl)
// let loginUrl= `${backend_Url}/login`
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
    
    }).then(res=>res.json()).then(data=>{
      console.log(data)
      document.cookie = `jwt0=${data.token}; path=/`;
      document.cookie = `loggedIn=${data.loggedIn}; path=/`;
      document.cookie = `email=${data.email}; path=/`;
      console.log("cookie set")
      window.location.replace(`/`);
    });

});}

  if(document.getElementById('signUpForm')){
  document.getElementById('signUpForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("clicked sign up");
    let name = document.getElementById('name');
    let password = document.getElementById('password');
    let confirmPass = document.getElementById('confirmPass');
    let phone = document.getElementById('phone');
    let emailField = document.getElementById('email');
    
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
      return res.json();
    }).then(data=>{
      if(data.status){
        window.location.replace(`/login`);
      }
    })
    .catch(err => {
      console.log("Error while redirecting: ", err);
    });

});}

});