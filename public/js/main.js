document.addEventListener('DOMContentLoaded', function() {

  function addToSheets(field, callback) {
    var http = new XMLHttpRequest();
    var url = "/api/sheets/add";
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
    var url = "/api/sheets/read";
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
    var value = inputElement.value.trim();
    if(value && e.keyCode === 13){
      var rowElement = document.createElement('div');
      rowElement.textContent = value;
      inputElement.value = '';
      outputContainer.appendChild(rowElement);
      addToSheets(value);
    }
  });

  function updateOutput(){
    outputContainer.innerHTML = '';
    readFromSheets(function(rows){
      rows.forEach(function(row){
        var rowElement = document.createElement('div');
        rowElement.textContent = row.field;
        outputContainer.appendChild(rowElement);
      });
    });
    window.setTimeout(updateOutput, 3000);
  }

  updateOutput();


  window.addToSheets = addToSheets;
  window.readFromSheets = readFromSheets;

});
