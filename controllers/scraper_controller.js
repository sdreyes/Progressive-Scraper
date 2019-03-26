const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

router.get("/", function(req, res) {
    db.Article.find({ "saved": false }).sort({ _id: -1 }).limit(10)
        .then(function(dbArticle) {
            console.log(dbArticle);
            const hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);
        })
        .catch(function(err) {
            res.json(err);
        });
})

router.get("/saved", function(req, res) {
    db.Article.find({ "saved": true }).sort({ _id: -1 })
        .then(function(dbArticle) {
            console.log(dbArticle);
            const hbsObject = {
                articles: dbArticle
            };
            res.render("saved", hbsObject);
        })
        .catch(function(err) {
            res.json(err);
        });
})

router.get("/scrape", function(req, res) {
    axios.get("http://www.progarchives.com/")
        .then(function(response) {
            const $ = cheerio.load(response.data);
            console.log("scraped");
            let numArticles = 0;
            let numAttempts = 0;
            const previewLength = 400;
            $("div.reviewbox").each(function(i, element) {
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

router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("comment")
        .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
    })
        .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});

router.put("/article/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, {
        $set: { saved: req.body.saved }
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
})

router.post("/article/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
})

module.exports = router;
