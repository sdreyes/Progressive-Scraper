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

    $(".comments-modal").on("hidden.bs.modal", function() {
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

    $(".add-comment").on("click", function(event) {
        event.preventDefault();
        let articleId = $(this).attr("data-id");
        $("#comments-modal-" + articleId).modal("show");
    })

    $(".submit-comment").on("click", function(event) {
        event.preventDefault();
        let articleId = $(this).attr("data-id");
        $.ajax({
            url: "/article/" + articleId,
            type: "POST",
            data: {
                name: $("#name-input-" + articleId).val(),
                body: $("#comment-area-" + articleId).val()
            }
        }).then(function() {
            $("#comments-modal-" + articleId).modal("hide");
        })
    })

    $(".delete-comment").on("click", function(event) {
        event.preventDefault();
        let commentId = $(this).attr("data-id");
        let articleId = $(this).parent().attr("data-id");
        $.ajax({
            url: "/article/" + articleId + "/comment/" + commentId,
            type: "DELETE"
        }).then(function() {
            $("#comments-modal-" + articleId).modal("hide");
        })
    })
});
