# Embedconsent

## Cookieconsent extension, written in Vanilla Javascript that toggles embeds from YouTube, Vimeo or Google Maps for better privacy.

**Embedconsent depends on cookieconsent. You can find it here:**
https://www.npmjs.com/package/cookieconsent

### Setup and Usage

`npm i @phijufa/embedconsent`

Check out the example folder. Everything is written in modern Javascript, so you might need Webpack/Babel to make it work for your environment.

There are two basic methods:
`embedconsent.init()` and `embedconsent.rerender()`. The `init()` method needs to be called the first time the page loads. The `rerender()` method will rerender the content based on the current cookie status.
