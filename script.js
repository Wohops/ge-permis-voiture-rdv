var myNoReg = 1234567;
var myBirthday = new Date();

function loginWithFormValues(personNumber, birthday) {
  getElement("noReg").value = personNumber;
  setTimeout(function() { /* do nothing */ }, 100);
  getElement("dateJJ").value = pad(birthday.getUTCDate() + 1);
  setTimeout(function() { /* do nothing */ }, 100);
  getElement("dateMM").value = pad(birthday.getUTCMonth() + 1);
  setTimeout(function() { /* do nothing */ }, 100);
  getElement("dateAAAA").value = birthday.getUTCFullYear();
  setTimeout(function() { /* do nothing */ }, 100);

  getElement("valider").click();
}

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
  for (var i = 0; i < halfDays.length; i++) {
    var links = halfDays[i].getElementsByTagName("a");
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

/* 1. */ loginWithFormValues(myNoReg, myBirthday);
/* 2. */ moveAppointment();
/* 3. */ searchFirstAvailableDate();