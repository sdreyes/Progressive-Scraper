var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

router.get("/", function(req, res) {
    res.render("index");
})

router.get("/scrape", function(req, res) {
    axios.get("http://www.progarchives.com/")
        .then(function(response) {
            var $ = cheerio.load(response.data);
            console.log("scraped");
            var numArticles = 0;
            var scrapedArticles = [];
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
                result.image = $(this)
                    .children(".review-cover-zone")
                    .children("a").first()
                    .children("img")
                    .attr("src");
                console.log(result);
                scrapedArticles.push(result);
                numArticles++;
            });
            var hbsObject = {
                message: numArticles + "review(s) scraped!",
                scrapedArticles: scrapedArticles
            }
            res.send(hbsObject);
        });
});

router.get("/savedArticles")

router.post("/article/:id")

module.exports = router;
