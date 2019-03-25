$(function () {
    $(".scrape-reviews").on("click", function(event) {
        event.preventDefault();
        $.ajax({
            url: "/scrape",
            type: "GET",
            success: function(result) {
                $("#articles-scraped-modal").modal("hide");
                $(".modal-body").text(result.message);
                $("#articles-scraped-modal").modal("show");
            },
            error: function() {
                $("#articles-scraped-modal").modal("hide");
                $(".modal-body").text("Could not scrape at this time");
                $("#articles-scraped-modal").modal("show");
            }
        });
    });

    $("#articles-scraped-modal").on("hidden.bs.modal", function() {
        location.reload();
    });

    $(".save-article").on("click", function(event) {
        event.preventDefault();
        let articleId = $(this).attr("data-id")
        $.ajax({
            url: "article/" + articleId,
            type: "PUT",
            data: {saved: true}
        }).then(function() {
            location.reload();
        });
    });

    $(".unsave-article").on("click", function(event) {
        event.preventDefault();
        let articleId = $(this).attr("data-id")
        $.ajax({
            url: "article/" + articleId,
            type: "PUT",
            data: {saved: false}
        }).then(function() {
            location.reload();
        });
    });
});
