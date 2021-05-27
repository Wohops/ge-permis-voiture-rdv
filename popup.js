document.querySelector('#clickme').addEventListener("click", function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    chrome.tabs.update(tab.id, {url: 'https://ge.ch/cari-online/examensPublic'});
  });
});

document.querySelector('#check-meeting').addEventListener("click", function() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    var url = tabs[0].url;
    if (url !== "https://ge.ch/cari-online/examensPublic") {
      update_status('Veuillez vous rendre sur le site du Bureau des Autos en cliquant le liens ci-dessus.');
      return;
    }
    start_process();
  });
});

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_options);

function start_process() {

  inject_utility_script();

  login();

}

function login() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    var currentTab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: {tabId: currentTab.id, allFrames: true},
        function: login_with_form_values,
      },
      () => {
        // TODO call "deplacer"
        setTimeout(function() { update_status("Not yet implemented!"); }, 3000);
        debugger;
      }
    );
  });
}

function inject_utility_script() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    var currentTab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: {tabId: currentTab.id, allFrames: true},
        files: ['script.js']
      },
      () => { /* do nothing */ }
    );
  });
}

function login_with_form_values() {
  chrome.storage.local.get({
    "personId": "",
    "birthday": ""
  }, function(item) {
    getElement("noReg").value = item.personId;

    var birthday = new Date(item.birthday);
    getElement("dateJJ").value = pad(birthday.getUTCDate());
    getElement("dateMM").value = pad(birthday.getUTCMonth() + 1);
    getElement("dateAAAA").value = birthday.getUTCFullYear();

    getElement("valider").click();
  });
}

function update_status(text) {
  var status = document.getElementById('status');
  status.textContent = text;
  setTimeout(function() {
    status.textContent = '';
  }, 2000);
}

function reset_options() {
  save_all_options("", "", "");
}

function restore_options() {
  chrome.storage.local.get({
    "personId": "",
    "birthday": "",
    "maxDate": ""
  }, function(item) {
    document.getElementById('personId').value = item.personId;
    document.getElementById('birthday').value = item.birthday;
    document.getElementById('maxDate').value = item.maxDate;
  });
}

function save_options() {
  var personId = document.getElementById('personId').value;
  var birthday = document.getElementById('birthday').value;
  var maxDate = document.getElementById('maxDate').value;
  save_all_options(personId, birthday, maxDate);
}

function save_all_options(personId, birthday, maxDate) {
  document.getElementById('personId').value = personId;
  document.getElementById('birthday').value = birthday;
  document.getElementById('maxDate').value = maxDate;
  chrome.storage.local.set({
    "personId": personId,
    "birthday": birthday,
    "maxDate": maxDate
  }, function() {
    // Update status to let user know options were saved.
    update_status('Configuration sauvée.');
  });
}
