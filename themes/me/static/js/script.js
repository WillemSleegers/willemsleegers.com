function toggle() {
  console.log("toggling");
  console.log(this);
  
	var nav_content = document.getElementById("nav_toggle_content");
	nav_content.classList.toggle("nav-active");
	console.log(nav_content.classList);
}
