$(function () {
    $(".scrape-reviews").on("click", function(event) {
        event.preventDefault();
        $.ajax({
            url: "/scrape",
            type: "GET",
            success: function(result) {
                $(".modal-body").text(result.message);
                $("#articles-scraped-modal").modal("show");
                displayArticles(result.scrapedArticles);
            },
            error: function (err) {
                console.log("error scraping");
            }
        })
    })

    function displayArticles(articles) {
        console.log(articles);
        $("#index-content").empty();
    }
})
