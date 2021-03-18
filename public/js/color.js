function createColorItem(color){
  const colorPicker = document.querySelector('.color-picker-items');
  const newColor = document.createElement("div");
  newColor.setAttribute("class", "coloritem");
  newColor.setAttribute("id", color);

  newColor.style.backgroundColor = color;

  colorPicker.appendChild(newColor);
}

function setUserColor(){
  const colorItems = document.getElementsByClassName("coloritem");
  const displayColor = document.getElementById("display-color");
  const color = this.getAttribute("id");
  displayColor.style.backgroundColor = color;

  Array.from(colorItems).forEach((colorItems)=>{
    colorItems.classList.remove("color-item-active");
  });

  this.classList.add("color-item-active");
}