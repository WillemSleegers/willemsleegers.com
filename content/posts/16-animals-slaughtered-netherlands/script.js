window.onload = function () {
  let count = 0; 
  const counter = document.getElementById("counter")
  
  function start_counter () {
    count = count + 0.01715604
    counter.innerHTML = Math.round(count);
  }
  
  setInterval(start_counter, 1);
}