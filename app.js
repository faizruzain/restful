const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// ########################## MongoDB ##########################
// getting-started.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//a connection to database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to the server');
});

//schema
const articlesSchema = new mongoose.Schema({
  title: String,
  content: String

});

//model
const Articles = mongoose.model('Article', articlesSchema);
// ########################## MongoDB ##########################

//tell our app to use EJS
app.set('view engine', 'ejs');

//tell our app to use body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

//tell express serever to use static file called "public" or whatever
app.use(express.static('public'));

app.get('/articles', (req, res) => {

  Articles.find({}, (err, docs) => {
    if(!err) {
      res.send(docs);
    } else {
      res.send(err);
    }
  });

});

app.post('/articles', (req, res) => {

  const newArticle = new Articles ({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save((err) => {
    if (!err) {
      console.log('title: '+req.body.title+' has been saved');
      console.log('content: '+req.body.content+' has been saved');
      res.redirect('/articles');
    } else {
      res.send(err);
    }
  });

});








// listening port
app.listen(process.env.PORT || port, () => {
  console.log('Server is running on port ' + port);
});
