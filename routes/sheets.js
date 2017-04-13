var GoogleSpreadsheet = require('google-spreadsheet');
var request = require("request");

var profanity = require('profam').Profanity();
profanity.setDownloadUrl(process.env.APPLICATION_URI + '/assets/profanity.json');
profanity.addLanguages('en');
profanity.setModes('asterisks-full');

var lru = require('lru-cache');
var cache = lru({
  max: 10000,
  maxAge: 4000,
  length: function(n, key){return n.length}
});
var Guid = require('guid');

var sheets = {
  "add": function(req, res) {
    var channel = req.params.channel;
    var field = req.body.field;

    var entry = "entry.822808207";
    var url = "https://docs.google.com/a/mozillafoundation.org/forms/d/e/1FAIpQLSfV0ftx4u7-kjrwkyKfo_CnTZqJyS31ku7l1Uo5zbR6e52HBg/formResponse";

    if (channel === "email") {
      url = "https://docs.google.com/a/mozillafoundation.org/forms/d/e/1FAIpQLSfpus8QLCU9XWuDKtv4YUqudjCHoWdnPG5gUh-5RqpSkbR3aQ/formResponse";
    } else if (channel === "snippet") {
      url = "https://docs.google.com/a/mozillafoundation.org/forms/d/e/1FAIpQLSes41ijlryRi_flk9io6Nbq2Cfco3iUxSnukHGps9qySyIK3w/formResponse";
    }

    var formData = {};
    formData[entry] = field;

    request({
      method: 'POST',
      url: url,
      form: formData
    }, function(err, payload) {
      if (err) {
        res.status(500).send({error: err});
      } else {
        res.sendStatus(200);
      }
    });
  },
  "read": function(req, res) {
    var channel = req.params.channel;
    var rows = cache.get(channel);
    if (typeof rows !== 'undefined') {
      res.json(rows);
      return;
    }

    var doc = new GoogleSpreadsheet('1DiYGiYHZbdrL0Jb0cPKIqrc7La3LWYr6wmqIIKjB9IA');
    if (channel === "email") {
      doc = new GoogleSpreadsheet('1seK0ySZrJA3Qo-U0_UwMimmwWJ_slKr0mVeIbCPxuq8');
    } else if (channel === "snippet") {
      doc = new GoogleSpreadsheet('1LjpxVtvBK4N7ncpiSykYYV0y5NZzmvTR20O3cd3II_k');
    }

    doc.getRows(1, {
      limit: 200,
      reverse: true,
      orderby: "timestamp"
    }, function(err, results) {
      var rows = [];
      if (err) {
        res.status(500).send({error: err});
      } else {
        rows = results.map(function(obj) {
          var filteredWord = profanity.run(obj.field)[0]['asterisks-full'];
          if (filteredWord !== obj.field) {
            filteredWord = 'unicorns';
          }
          return {
            field: filteredWord
          };
        });

        var results = {
          guid: Guid.create(),
          rows: rows
        };

        cache.set(channel, results);

        res.json(results);
      }
    });
  }
}

module.exports = sheets;
