function createColorItem(color){
  const colorPicker = document.querySelector('.color-picker');
  const newColor = document.createElement("div");
  newColor.setAttribute("class", "coloritem");
  newColor.setAttribute("id", color);

  newColor.style.backgroundColor = color;

  colorPicker.appendChild(newColor);
}

function setUserColor(){
  const displayColor = document.getElementById("display-color");
  const color = this.getAttribute("id");
  displayColor.style.backgroundColor = color;
}