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
        })
    })

    $("#articles-scraped-modal").on("hidden.bs.modal", function() {
        location.reload();
    })
})
