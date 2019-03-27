![Logo](/public/assets/img/readme/logo.png)

# Progressive Scraper

Progressive Scraper is a web scraper that displays ten of the most recent progressive rock album reviews from Prog Archives. Users can save reviews to their favorites list and leave comments on their saved reviews. Comments can be individually deleted, and articles can be deleted in batches.

This project was created as an assignment from Penn LPS Coding Bootcamp.

## Assignment Parameters

* Create an app that accomplishes the following:

  1. Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. At a minimum, the app should scrape and display the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

  2. Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.

* Beyond these requirements, be creative and have fun with this!

## Getting started

Click the 'Scrape Reviews' button to populate some reiews! You can also delete the reviews with the 'Clear Reviews' button.

![Scraping reviews](/public/assets/img/readme/scrape.gif)

Click the green 'Save Review' button to add reviews to your favorites list. Your favorites can be viewed by clicking the 'Saved Reviews' link on the navigation bar. Saved reviews can be unsaved by clicking the red 'Remove' button.

![Saving reviews](/public/assets/img/readme/save.gif)

Leave comments on a saved review by clicking the blue 'Comments' button. Type in your name and comment in the form that pops up. After clicking the 'Add Comment' button, your comment will display next time you click the blue 'Comments' button. Comments can be deleted by clicking the red 'X' button next to the review you want to delete.

![Commenting on reviews](/public/assets/img/readme/comment.gif)

## About

This app uses Express in conjunction with Node.js to create the server. Cheerio and Axios scrapes the site and the targeted elements are stored in a Mongo database using Mongoose. Handlebars.js is the view engine and renders the JSON responses from the server. Bootstrap supplies most of the CSS. This application follows the MVC design pattern.

Technologies used: MongoDB, Mongoose, Cheerio, Node.js, Express, Handlebars.js, jQuery, Bootstrap

## Links

- Deployed: http://progressive-scraper.herokuapp.com/
- Repository: https://github.com/sdreyes/Progressive-Scraper
- Prog Archives: http://www.progarchives.com/

## Author

- Shelby Reyes: https://sdreyes.github.io/