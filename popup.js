document.querySelector('#clickme').addEventListener("click", function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    chrome.tabs.update(tab.id, {url: 'https://ge.ch/cari-online/examensPublic'});
  });
});

document.querySelector('#check-meeting').addEventListener("click", function() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    var url = tabs[0].url;
    if (url !== "https://ge.ch/cari-online/examensPublic") {
      var status = document.getElementById('status');
      status.textContent = 'Veuillez vous rendre sur le site du Bureau des Autos avec le liens ci-dessus.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
      return;
    }
    debugger;
  });

});

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

function restore_options() {
  chrome.storage.local.get({
    "personId": '???????',
    "birthday": new Date()
  }, function(items) {
    document.getElementById('personId').value = items.personId;
    document.getElementById('birthday').value = items.birthday;
  });
}

function save_options() {
  var personId = document.getElementById('personId').value;
  var birthday = document.getElementById('birthday').value;
  chrome.storage.local.set({
    "personId": personId,
    "birthday": birthday
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Configuration sauvée.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

