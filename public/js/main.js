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

  var timeOut;
  var paused = false;
  var outputContainer = document.querySelector('.output-container');
  var inputElement = document.querySelector('.input');

  function waiting(on) {
    if (on) {
      inputElement.disabled = true;
      var rowElement = document.createElement('div');
      var firstChild = outputContainer.firstChild;
      rowElement.innerHTML = "<span>.</span><span>.</span><span>.</span>";
      rowElement.classList.add("waiting");
      if (!firstChild) {
        outputContainer.appendChild(rowElement);
      } else {
        outputContainer.insertBefore(rowElement, outputContainer.firstChild);
      }
    } else {
      inputElement.disabled = false;
      var waitingElement = document.querySelector(".waiting");
      if (waitingElement && waitingElement.parentNode) {
        waitingElement.parentNode.removeChild(waitingElement);
      }
    }
  }

  inputElement.addEventListener('keydown', function(e){
    var value = inputElement.value.trim().slice(0, 50);
    if(value && e.keyCode === 13) {

      waiting(true);
      inputElement.value = '';
      document.querySelector('.thankyou').classList.add('show');
      clearTimeout(timeOut);
      timeOut = null;
      updateOutput(function() {
        addToSheets(value, function() {
          waiting(false);
          var rowElement = document.createElement('div');
          var firstChild = outputContainer.firstChild;
          rowElement.textContent = value;
          if (!firstChild) {
            outputContainer.appendChild(rowElement);
          } else {
            outputContainer.insertBefore(rowElement, outputContainer.firstChild);
          }
          timeOut = window.setTimeout(updateOutputTimeout, 4000);
        });
      });
    }
  });

  inputElement.focus();
  var previousGuid = "";

  function updateOutputTimeout() {
    updateOutput(function() {
      timeOut = window.setTimeout(updateOutputTimeout, 4000);
    });
  }

  function updateOutput(callback){
    callback = callback || function() {};
    var cacheElement = document.createElement("div");
    var waitingElement;
    readFromSheets(function(data){

      var rows = data.rows;
      var guid = data.guid;
      if (guid !== previousGuid && !paused) {
        var waitingElement = document.querySelector(".waiting");

        if (waitingElement) {
          cacheElement.appendChild(waitingElement);
        }
        rows.forEach(function(row){
          var rowElement = document.createElement('div');
          rowElement.textContent = row.field;
          cacheElement.appendChild(rowElement);
        });
        outputContainer.innerHTML = cacheElement.innerHTML;
        previousGuid = guid;
      }
      callback();
    });
  }

  timeOut = window.setTimeout(updateOutputTimeout);

  window.addEventListener("scroll", function() {
    var scrollY = window.scrollY;
    if (scrollY === 0) {
      paused = false;
    } else {
      paused = true;
    }
  });

  window.addToSheets = addToSheets;
  window.readFromSheets = readFromSheets;

  document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.thankyou').style.display = 'none';
  });

});
