/* ------------------------------------------------------------------------------------------ *
 * APPOINTMENT SEARCH PROCESS                                                                 *
 * ------------------------------------------------------------------------------------------ */

/*
 * Process steps:
 *
 * 1. LOGGING
 * 2. MOVING
 * 3. SEARCHING
 */

function start_process() {
  get_tab_id().then(tabId => login(tabId));
}

function get_tab_id() {
  return chrome.tabs.query({active: true, lastFocusedWindow: true})
   .then(tabs  => tabs[0].id)
   .then(tabId => {
      chrome.storage.local.set({ 'workTab': tabId });
      return tabId;
    });
}

function login(tabId) {
  chrome.tabs.onUpdated.addListener(move_appointment_listener);
  chrome.storage.local.set({ 'processStep': "LOGGING" });

  return chrome.scripting.executeScript({
    'target': { 'tabId': tabId, 'allFrames': true },
    function: login_in_page
  });
}

function login_in_page() {
  chrome.storage.local.get({ 'personId': "", 'birthday': "" }, function(item) {
    getElement("noReg").value = item.personId;

    var birthday = new Date(item.birthday);
    getElement('dateJJ').value = pad(birthday.getUTCDate());
    getElement('dateMM').value = pad(birthday.getUTCMonth() + 1);
    getElement('dateAAAA').value = birthday.getUTCFullYear();

    getElement('valider').click();
  });
}

function move_appointment_listener(tabId, changeInfo, tab) {
  chrome.storage.local.get({ 'workTab': "", 'processStep': "" }, function(item) {
    if (tabId === item.workTab && changeInfo.status === "complete" && item.processStep === "LOGGING") {
      chrome.tabs.onUpdated.removeListener(move_appointment_listener);
      move_appointment(tabId);
    }
  });
}

function move_appointment(tabId) {
  chrome.tabs.onUpdated.addListener(search_appointment_listener);
  chrome.storage.local.set({ 'processStep': "MOVING" });

  return chrome.scripting.executeScript({
    'target': { 'tabId': tabId, 'allFrames': true },
    function: move_appointment_in_page
  });
}

function move_appointment_in_page() {
  var form = getElement('selectExamens')
  var columns = form.getElementsByClassName('column');
  var lastColumn = columns[columns.length -1];
  var link = lastColumn.getElementsByTagName("a")[0];
  if (link) {
    link.click();
  } else {
    openModal(
      "Erreur - Operation impossible",
      "Impossible de déplacer l'examen.",
      "La date de votre examen est soit trop proche de la date actuelle, soit bloquée, soit la façon de remplir le formulaire à été changée depuis l'écriture de ce programme."
    );
  }
}

function search_appointment_listener(tabId, changeInfo, tab) {
  chrome.storage.local.get({ 'workTab': "", 'processStep': "" }, function(item) {
    if (tabId === item.workTab && changeInfo.status === "complete"
      && (item.processStep === "MOVING" || item.processStep === "SEARCHING")) {
      search_appointment(tabId);
    }
  });
}

function search_appointment(tabId) {
  chrome.storage.local.set({ 'processStep': "SEARCHING" });

  return chrome.scripting.executeScript({
    'target': { 'tabId': tabId, 'allFrames': true },
    function: search_appointment_in_page
  });
}

function search_appointment_in_page() {
  var tableHalfDays = document.getElementById("idDivTablePlaceLibre");
  var halfDays = tableHalfDays.getElementsByClassName("columnHalfDay");
  var found = false;
  for (const halfDay of halfDays) {
    var links = halfDay.getElementsByTagName("a");
    if (links.length >= 1) {
      openModal(
        "Examen - Date trouvée",
        "Une session libre a été trouvée. Clickez sur le lien suivant pour séletionner cette date, ou fermer le popup pour étudier les autres options possibles.",
        "",
        links[0].href
      );
      found = true;
      break;
    }
  }
  if (!found) {
    document.getElementById("nextWeek").click();
  }
}

/* ------------------------------------------------------------------------------------------ *
 * POPUP                                                                                      *
 * ------------------------------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_options);

document.querySelector('#clickme').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    chrome.tabs.update(tab.id, {url: 'https://ge.ch/cari-online/examensPublic'});
  });
});

document.querySelector('#check-meeting').addEventListener('click', function() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    var url = tabs[0].url;
    if (url !== "https://ge.ch/cari-online/examensPublic") {
      update_status('Veuillez vous rendre sur le site du Bureau des Autos en cliquant le liens ci-dessus.');
      return;
    }
    start_process();
  });
});

function update_status(text) {
  var status = document.getElementById('status');
  status.textContent = text;
  setTimeout(function() {
    status.textContent = '';
  }, 2000);
}

function reset_options() {
  save_all_options("", "");
}

function restore_options() {
  chrome.storage.local.get({
    'personId': "",
    'birthday': ""
  }, function(item) {
    document.getElementById('personId').value = item.personId;
    document.getElementById('birthday').value = item.birthday;
  });
}

function save_options() {
  var personId = document.getElementById('personId').value;
  var birthday = document.getElementById('birthday').value;
  save_all_options(personId, birthday);
}

function save_all_options(personId, birthday) {
  document.getElementById('personId').value = personId;
  document.getElementById('birthday').value = birthday;
  chrome.storage.local.set({
    'personId': personId,
    'birthday': birthday
  }, function() {
    update_status('Configuration sauvée.');
  });
}
