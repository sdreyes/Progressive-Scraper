$(function () {
  $(".scrape-reviews").on("click", function (event) {
    event.preventDefault();
    $("#scraping-articles-modal").modal("show");
    $.ajax({
      url: "/scrape",
      type: "GET",
      success: function (result) {
        $("#scraping-articles-modal").modal("hide");
        $(".modal-body").text(result.message);
        $("#articles-scraped-modal").modal("show");
      },
      error: function () {
        $("#scraping-articles-modal").modal("hide");
        $(".modal-body").text("Could not scrape at this time");
        $("#articles-scraped-modal").modal("show");
      }
    });
  });

  $(".clear-reviews").on("click", function (event) {
    event.preventDefault();
    $.ajax({
      url: "/scrape",
      type: "DELETE"
    }).then(function () {
      location.reload();
    })
  })

  $("#articles-scraped-modal").on("hidden.bs.modal", function () {
    location.reload();
  });

  $(".comments-modal").on("hidden.bs.modal", function () {
    location.reload();
  });

  $(".save-article").on("click", function (event) {
    event.preventDefault();
    let articleId = $(this).attr("data-id")
    $.ajax({
      url: "article/" + articleId,
      type: "PUT",
      data: { saved: true }
    }).then(function () {
      location.reload();
    });
  });

  $(".unsave-article").on("click", function (event) {
    event.preventDefault();
    let articleId = $(this).attr("data-id")
    $.ajax({
      url: "article/" + articleId,
      type: "PUT",
      data: { saved: false }
    }).then(function () {
      location.reload();
    });
  });

  $(".add-comment").on("click", function (event) {
    event.preventDefault();
    let articleId = $(this).attr("data-id");
    $("#comments-modal-" + articleId).modal("show");
  })

  $(".submit-comment").on("click", function (event) {
    event.preventDefault();
    let articleId = $(this).attr("data-id");
    let name = $("#name-input-" + articleId).val();
    let body = $("#comment-area-" + articleId).val();
    if (name && body) {
      $.ajax({
        url: "/article/" + articleId,
        type: "POST",
        data: {
          name: name,
          body: body
        }
      }).then(function () {
        $("#comments-modal-" + articleId).modal("hide");
      })
    }
    else {
      console.log("Needs all fields filled out");
    }
  })

  $(".delete-comment").on("click", function (event) {
    event.preventDefault();
    let commentId = $(this).attr("data-id");
    let articleId = $(this).parent().parent().attr("data-id");
    $.ajax({
      url: "/article/" + articleId + "/comment/" + commentId,
      type: "DELETE"
    }).then(function () {
      $("#comments-modal-" + articleId).modal("hide");
    })
  })

});
