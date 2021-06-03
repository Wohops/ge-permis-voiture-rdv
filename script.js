function pad(num) {
  num = num.toString();
  while (num.length < 2) num = "0" + num;
  return num;
}

function getElement(elementName) {
  var element = document.getElementsByName(elementName);
  if (element.length != 1) {
    throw new Error("Can not find element '" + elementName + "'!");
  }
  return element[0];
}
