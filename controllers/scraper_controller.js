const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");
require("dotenv").config();
const Spotify = require("node-spotify-api");
const spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

router.get("/", function (req, res) {
  db.Article.find({ "saved": false }).sort({ _id: -1 }).limit(10)
    .then(function (dbArticle) {
      const hbsObject = {
        articles: dbArticle
      };
      res.render("index", hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });
})

router.get("/saved", function (req, res) {
  db.Article.find({ "saved": true }).sort({ _id: -1 })
    .populate("comments")
    .then(function (dbArticle) {
      const hbsObject = {
        articles: dbArticle
      };
      res.render("saved", hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });
})

router.get("/scrape", function (req, res) {
  axios.get("http://www.progarchives.com/")
    .then(function (response) {
      const $ = cheerio.load(response.data);
      let numArticles = 0;
      let numAttempts = 0;
      const previewLength = 400;
      $("div.reviewbox").each(function (i, element) {
        const result = {};
        result.artist = $(this)
          .children(".review-text-zone")
          .children("a").eq(1)
          .text();
        result.album = $(this)
          .children(".review-text-zone")
          .children("a").first()
          .text();
        result.link = "http://www.progarchives.com/" + $(this)
          .children(".review-text-zone")
          .children(".review-footer")
          .children(".icon-permalink")
          .attr("href");
        result.review = $(this)
          .children(".review-text-zone")
          .children("div").first()
          .text();
        // Prog Archives no longer allows hotlinking for images:
        // result.image = $(this)
        //   .children(".review-cover-zone")
        //   .children("a").first()
        //   .children("img")
        //   .attr("src");
        result.author = $(this)
          .children(".review-text-zone")
          .children("p").first()
          .children("a")
          .text();
        // Prog Archives adds a header if the album had never been reviewed before, so I need to check for that and capture the second div instead of the first if that's the case
        if (result.review === "— First review of this album —") {
          result.review = $(this)
          .children(".review-text-zone")
          .children("div").eq(1)
          .text();
        }
        // Shorten the summary to less characters instead of capturing the entire paragraph
        result.review = result.review.substring(0, previewLength);

        // Using Spotify to capture the album art since Prog Archives does not allow hotlinking
        spotify.search({
          type: 'album',
          query: result.artist + " " + result.album,
          limit: 1
        }, function (err, data) {
          if (err) return console.log("Error occured: " + err);
          // If there is a match
          if (data.albums.items.length > 0) {
            // And if if there are images available
            if (data.albums.items[0].images.length > 0) {
              result.image = data.albums.items[0].images[0].url;
            } else {
              result.image = "https://via.placeholder.com/640x640?text=ART+UNAVAILABLE";
            }
          } else {
            result.image = "https://via.placeholder.com/640x640?text=ART+UNAVAILABLE";
          }
          console.log(result);
          db.Article.create(result)
          .then(function (dbArticle) {
            numArticles++;
            renderArticles(numArticles);
          })
          .catch(function (err) {
            renderArticles(numArticles);
            console.log(err);
          })
        })
      });
      function renderArticles(numArticles) {
        numAttempts++
        if (numAttempts === 10) {
          let hbsObject;
          if (numArticles === 0) {
            hbsObject = {
              message: "There are no new reviews"
            }
          }
          else {
            hbsObject = {
              message: numArticles + " review(s) scraped!",
            }
          };
          res.json(hbsObject);
        }
      }
    });
});

router.put("/article/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, {
    $set: { saved: req.body.saved }
  })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
})

router.post("/article/:id", function (req, res) {
  db.Comment.create(req.body)
    .then(function (dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment._id } }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
})

router.delete("/article/:articleId/comment/:commentId", function (req, res) {
  db.Comment.deleteOne({ _id: req.params.commentId })
    .then(function () {
      return db.Article.findOneAndUpdate({ _id: req.params.articleId }, { $pull: { comments: req.params.commentId } });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
})

router.delete("/scrape", function (req, res) {
  db.Article.deleteMany({})
    .then(function () {
      return db.Comment.deleteMany({});
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
})

module.exports = router;
