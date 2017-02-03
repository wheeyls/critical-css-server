# Eliminate render-blocking CSS in above-the-fold content

If you've run Google Pagespeed Insights on your web app, you might have seen this message:

> *Eliminate render-blocking JavaScript and CSS in above-the-fold content*
>
> Your page has blocking CSS resources. This causes a delay in rendering your page.
> None of the above-the-fold content on your page could be rendered without waiting for the following resources to load. Try to defer or asynchronously load blocking resources, or inline the critical portions of those resources directly in the HTML.

This server generates the critical path CSS for you. It is designed to sit alongside your production app, and prepare the critical CSS asynchronously.

Builds can be started after each deploy, and a few minutes later, you'll be able to defer or asynchronously load blocking resources, and inline the critical portions for your page.

## Install

`npm install critical-path-server`

## Usage

#### Start the server

    npm start
    > Listening on port: 8080
    
#### Send a request with details about the page you want cached

The first request returns immediately, and starts generating the CSS in the background:

    curl curl -H "Content-Type: application/json" -X POST -d '{ "page": {"key":"easdfaasdfasdfdsf","url":"http://www.example.com/","css":"https://www.example.com/style.css"}' localhost:8080/api/v1/css`
    > Accepted
    
#### Eventually...
    
    curl curl -H "Content-Type: application/json" -X POST -d '{ "page": {"key":"easdfaasdfasdfdsf","url":"http://www.example.com/","css":"https://www.example.com/style.css"}' localhost:8080/api/v1/css`
    > .your-critical-css {}

## Similar Solutions

* [Penthoust](https://github.com/pocketjoso/penthouse)
* [CriticalCSS](https://github.com/filamentgroup/criticalCSS)
* [critical-path-css-rails](https://github.com/mudbugmedia/critical-path-css-rails)
