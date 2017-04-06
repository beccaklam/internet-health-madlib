document.addEventListener('DOMContentLoaded', function() {

  var channel = "social";
  var search = location.search;
  if (search) {
    search = search.replace("?", "");
    search = search.split("&");
    search.forEach(function(item) {
      item = item.split("=");
      if (item[0] === "channel") {
        if (item[1] === "email" || item[1] === "snippet") {
          channel = item[1];
        }
      }
    });
  }

  function addToSheets(field, callback) {
    var http = new XMLHttpRequest();
    var url = "/api/sheets/add/" + channel;
    callback = callback || function() {};

    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback("success");
      }
    };

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify({field: field}));
  }

  function readFromSheets(callback) {
    var http = new XMLHttpRequest();
    var url = "/api/sheets/read/" + channel;
    callback = callback || function() {};

    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);
        callback(result);
      }
    };

    http.open("GET", url, true);
    http.send();
  }

  var outputContainer = document.querySelector('.output-container');
  var inputElement = document.querySelector('.input');
  inputElement.addEventListener('keydown', function(e){
    var value = inputElement.value.trim().slice(0, 140);
    if(value && e.keyCode === 13){
      var rowElement = document.createElement('div');
      var firstChild = outputContainer.firstChild;
      rowElement.textContent = value;
      inputElement.value = '';
      if (!firstChild) {
        outputContainer.appendChild(rowElement);
      } else {
        outputContainer.insertBefore(rowElement, outputContainer.firstChild);
      }
      addToSheets(value);
    }
  });

  function updateOutput(){
    var cacheElement = document.createElement("div");
    readFromSheets(function(rows){
      rows.forEach(function(row){
        var rowElement = document.createElement('div');
        rowElement.textContent = row.field;
        cacheElement.appendChild(rowElement);
      });
      outputContainer.innerHTML = cacheElement.innerHTML;
      window.setTimeout(updateOutput, 4000);
    });
  }

  updateOutput();


  window.addToSheets = addToSheets;
  window.readFromSheets = readFromSheets;

});
