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

function openModal(title, text, description, link) {
  const parser = new DOMParser();

  var modalContentStart = `
    <div id="myModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <span class="close">&times;</span>
          <h3>${title}</h3>
        </div>
        <div class="modal-body">
          <p class="modal-main-message">${text}</p>
          <p class="modal-description">${description}</p>
    `;
  var modalContentMiddle = "";
  if (link) {
    modalContentMiddle = `
          <a href=${link}>CHANGER LA DATE</a>
    `;
  }
  var modalContentEnd = `
        </div>
        <div class="modal-footer">
        </div>
      </div>
    </div>
    `;

  var modalContent = modalContentStart + modalContentMiddle + modalContentEnd;

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
