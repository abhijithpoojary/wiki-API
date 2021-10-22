

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
  };
  
  const Article = mongoose.model("Article", articleSchema);

  ////////////////////////////////// operation on All Article////////////////////////////////////////////
  app.route("/articles")

  //fetch all articles
.get( function(req, res){
    Article.find(function(err, foundArticles){
        res.send(foundArticles);
    });
})

//create one new artcicle
.post( function(req, res){
const newArticle= new Article({
    title: req.body.title,
    content: req.body.content 
});
newArticle.save(function(err){
    if(!err){
        res.send("successfully added");
    }else{
        res.send(err);
    }
});
})


//delete all article
.delete( function(req, res){
    Article.deleteMany(function(err){
      if (!err){
        res.send("Successfully deleted all the articles in wikiDB.");
      } else {
        res.send(err);
      }
    });
  
  });

////////////////////////For individual article////////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    } else {
      res.send("No article with that title found.");
    }
  });
})

.put(function(req, res){

  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    //{overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      }else{
        res.send(err);
      }
    }
    );
})

.patch(function(req, res){

  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Successfully updated(patch) the content of the selected article.");
      }else{
        res.send(err);
      }
    }
    );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the content of the selected article.");
      }else{
        res.send(err);
      }
    }
    );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

////////////Abhijith BE///////////////