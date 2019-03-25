var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

router.get("/", function(req, res) {
    db.Article.find({}).sort({ _id: -1 }).limit(10)
        .then(function(dbArticle) {
            console.log(dbArticle);
            var hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);
        })
        .catch(function(err) {
            res.json(err);
        });
})

router.get("/scrape", function(req, res) {
    axios.get("http://www.progarchives.com/")
        .then(function(response) {
            var $ = cheerio.load(response.data);
            console.log("scraped");
            var numArticles = 0;
            var numAttempts = 0;
            const previewLength = 400;
            $("div.reviewbox").each(function(i, element) {
                var result = {};
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
                result.review = result.review.substring(0, previewLength);
                result.image = $(this)
                    .children(".review-cover-zone")
                    .children("a").first()
                    .children("img")
                    .attr("src");
                result.author = $(this)
                    .children(".review-text-zone")
                    .children("p").first()
                    .children("a")
                    .text();
                console.log(result);
                db.Article.create(result)
                    .then(function(dbArticle) {
                        numArticles++;
                        console.log("Number of articles is " + numArticles)
                        renderArticles(numArticles);
                    })
                    .catch(function(err) {
                        renderArticles(numArticles);
                        console.log(err);
                    })
            });
            function renderArticles(numArticles) {
                numAttempts++
                console.log("number of attempts is " + numAttempts);
                if (numAttempts === 10) {
                    var hbsObject;
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

router.get("/savedArticles")

router.post("/article/:id")

module.exports = router;
