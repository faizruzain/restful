const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// ########################## MongoDB ##########################
// getting-started.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wikiDB', {useNewUrlParser: true,useUnifiedTopology: true});

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
app.use(bodyParser.urlencoded({extended: true}));

//tell express serever to use static file called "public" or whatever
app.use(express.static('public'));

// ############################ /articles ############################
app.route('/articles')

.get((req, res) => {

  Articles.find({}, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      res.send(err);
    }
  });

})

.post((req, res) => {

  const newArticle = new Articles({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save((err) => {
    if (!err) {
      res.send('Saved!');
    } else {
      res.send(err);
    }
  });

})

.delete((req, res) => {

  Articles.deleteMany({}, (err) => {
    if (!err) {
      res.send('Deleted!');
    } else {
      console.log(err);
    }
  });

});
// ############################ /articles ############################

// ############################ /articles/:params ############################
app.route('/articles/:articleTitle')

.get((req, res) => {

  const articleTitle = req.params.articleTitle;

  Articles.findOne({title: articleTitle}, (err, doc) => {
    if (doc) {
      res.send(doc);
    } else if (!doc) {
      res.send('No article was found');
    }
  });
})

.put((req, res) => {

  const articleTitle = req.params.articleTitle;
  // https://mongoosejs.com/docs/deprecations.html#update
  Articles.replaceOne(
    {title: articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    (err) => {
      if (!err) {
        res.send('Updated!')
      } else {
        console.log(err);
      }
    }
  );

})

.patch((req, res) => {

  const articleTitle = req.params.articleTitle;

  Articles.updateOne(
    {title: articleTitle},
    {$set: req.body},
    (err) => {
      if (!err) {
        res.send('Patched!');
      } else {
        res.send(err);
      }
    }
  );

})

.delete((req, res) => {

  const articleTitle = req.params.articleTitle;

  Articles.deleteOne(
    {title: articleTitle},
    (err) => {
      if (!err) {
        res.send('Deleted!');
      } else {
        res.send(err);
      }
    }
  );

});
// ############################ /articles/:params ############################







// listening port
app.listen(process.env.PORT || port, () => {
  console.log('Server is running on port ' + port);
});
