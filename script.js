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

function openModal() {
  const parser = new DOMParser();

  var modalContent =
    '<div id="myModal" class="modal">'
    + '  <div class="modal-content">'
    + '    <div class="modal-header">'
    + '      <span class="close">&times;</span>'
    + '      <h2>Modal Header</h2>'
    + '    </div>'
    + '    <div class="modal-body">'
    + '      <p>Some text in the Modal Body</p>'
    + '      <p>Some other text...</p>'
    + '    </div>'
    + '    <div class="modal-footer">'
    + '      <h2>Modal Footer</h3>'
    + '    </div>'
    + '  </div>'
    + '</div>';

  var modal = parser.parseFromString(modalContent, "text/html").getElementById("myModal");
  document.getElementsByTagName('body')[0].appendChild(modal);

  var crossButton = modal.getElementsByClassName("close")[0];

  // display
  modal.style.display = "block";

  crossButton.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
}
