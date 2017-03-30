var GoogleSpreadsheet = require('google-spreadsheet');
var request = require("request");

var sheets = {
  "add": function(req, res) {
    var doc = new GoogleSpreadsheet('1DiYGiYHZbdrL0Jb0cPKIqrc7La3LWYr6wmqIIKjB9IA');
    var field = req.body.field;
    var formData = {
      "entry.822808207": field
    };
    request({
      method: 'POST',
      url: "https://docs.google.com/a/mozillafoundation.org/forms/d/e/1FAIpQLSfV0ftx4u7-kjrwkyKfo_CnTZqJyS31ku7l1Uo5zbR6e52HBg/formResponse",
      form: formData
    }, function(err, payload) {
      if (err) {
        res.status(500).send({error: err});
      } else {
        res.sendStatus(200);
      }
    });

    /*doc.addRow(1, {field: field, Timestamp: "30/03/2017 13:02:09"}, function(err, result) {
      if (err) {
        res.status(500).send({error: err});
      } else {
        res.send("OK");
      }
    });*/
    
  },
  "read": function(req, res) {
    var doc = new GoogleSpreadsheet('1DiYGiYHZbdrL0Jb0cPKIqrc7La3LWYr6wmqIIKjB9IA');

    doc.getRows(1, {}, function(err, results) {
      var rows = [];
      if (err) {
        res.status(500).send({error: err});
      } else {
        rows = results.map(function(obj) {
          return {
            field: obj.field
          };
        });

        res.json(rows);
      }
    });
  }
}

module.exports = sheets;
