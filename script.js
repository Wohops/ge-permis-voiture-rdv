function moveAppointment() {
  var form = getElement("selectExamens")
  var columns = form.getElementsByClassName("column");
  var lastColumn = columns[columns.length -1];
  var link = lastColumn.getElementsByTagName("a")[0];
  link.click();
}

function searchFirstAvailableDate() {
  var tableHalfDays = document.getElementById("idDivTablePlaceLibre");
  var halfDays = tableHalfDays.getElementsByClassName("columnHalfDay");
  var found = false;
  for (let halfDay of halfDays) {
    var links = halfDay.getElementsByTagName("a");
    if (links.length >= 1) {
      console.log("found! " + links[0].href);
      console.log(links[0]);
      found = true;
      break;
    }
  }
  if (!found) {
    document.getElementById("nextWeek").click();
  }
}

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

/* 2. moveAppointment(); */
/* 3. searchFirstAvailableDate(); */
