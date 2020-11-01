# FanBase
A small website which is based on the basics of html, css and javascript and doesn't use any javascript module. The website searches for information about movies and shows using api calls from various api providers.

The websites used are :
1. http://www.omdbapi.com/
2. https://tastedive.com/api/
3. https://rapidapi.com/hmerritt/api/imdb-internet-movie-database-unofficial
4. https://rapidapi.com/apidojo/api/imdb8
5. https://api.hillbillysoftware.com/api/swagger/ui/index

### Note : create a .apikeys.js file in the directory and add the code below in it

```javascript
const apiKeys = {
    tastedrive: "https://tastedive.com/api/similar?k=[YOUR_API_KEY]&info=1&limit=10&type=movies,shows&q=",
    omdb: "http://www.omdbapi.com/?apikey=[YOUR_API_KEY]&plot=full&t=",
    x_rapidapi_key: "[YOUR_API_KEY]",
    hillbilly: "[YOUR_API_KEY]"
} 
```
### Replace the [YOUR_API_KEY] with your api key from the respective websites.
