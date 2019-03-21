var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

router.get("/", function(req, res) {
    axios.get("http://www.progarchives.com/")
        .then(function(response) {
            var $ = cheerio.load(response.data);
            console.log("scraped");
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
                console.log(result.artist, result.album, result.link, result.review, result.image);

                db.Article.create(result)
                    .then(function(dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
        });
    res.render("index");
});



module.exports = router;