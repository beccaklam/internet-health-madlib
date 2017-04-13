require('habitat').load();

var express = require('express');
var app = express();
var routes = require('./routes');
var compression = require('compression');
var helmet = require('helmet');

var bodyParser = require('body-parser');

app.set('trust proxy', true);

app.use(bodyParser.json());
app.use(compression());
app.use(helmet.frameguard({
  action: "deny"
}));
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(helmet.contentSecurityPolicy({
  directives:{
    defaultSrc: [ "'none'" ],
    scriptSrc: ["'self'", "https://*.shpg.org/", "https://www.google-analytics.com/"],
    connectSrc:["'self'"],
    childSrc:["'self'"],
    styleSrc:["'self'"],
    fontSrc:["'self'"],
    imgSrc:["'self'", "https://www.google-analytics.com", "https://*.shpg.org/"],
    frameAncestors: ["'none'"]
  }
}));

app.use(helmet.hsts({
  maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
}));

app.use(function(req, res, next){
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] != 'https') {
      return res.redirect('https://' + req.host + req.url);
    }
  }

  next();
});

app.post('/api/sheets/add/:channel', routes.sheets.add);
app.get('/api/sheets/read/:channel', routes.sheets.read);

app.use(express.static('public'));

app.listen(process.env.PORT, function () {
  console.log('Running server at: ' + process.env.PORT + '!');
});
