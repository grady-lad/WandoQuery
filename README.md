# WandoQuery

Submission for Wando.

Screenshots of the app can be found under 'screenGrab'

Installation Instructions
--------------------------
To run the web app locally, You must have node installed. Once installed, navigate to the root directory of the project and run "npm install" to install the required dependencies. Once installed run 'node server' and open 'localhost:3000' to play with the app :)

Technologies Used and Why
-------------------
- Gulp 
  - Build tool I used for the js and sass files. Makes my life a lot easier :)
- Broswerify 
  - Easy way to create and share my code as modules in a node.js like way.
- React (The main body of work in the application)
  - Because of the actual size of the app, React seemed like the obvious 
    choice for me, it allowed me to easily create components and not worry about
    so much DOM manipulation because everything React creates is a 'virtual DOM'.
  - Even though in my last point I said I chose React because the app was small,
    I believe that in my approach it would be a lot easier to create new components
    to the app and allow people or teams to work without much interruption, But this
    may mean that the introduction of flux would be required, allowing a developer to
    create an efficent way for components to react with eachother (Something I am still learning).
  - Its fast! React works with a virtual dom, and hopefully you will be able to see 
    this within the web app that it is quite fast. 
  - And it is also quite easy to work with and speed up the workflow of the project.
- Node
  - Solely used as a server to host the app and server up the homepage.
- Sass 
  - Allowed for more dynamic creation of CSS 

Bonus
--------
For the bonus round which was focused on the usecase "what to show/do while a user is waiting"

- I implemented a recently searched cached, so if the user performs the same search again or a search
  that contains keywords from previous searches, they will see related products while they wait for their search
  results.

- This was just a quick implementation, basically what I did was get the 1st item from the API response and
  cache it using the html5 localstorage feature. Then when a returning user searched for products
  that were similar to their previous searches, I would display the item while they are waiting on
  their current search result.

- For this feature I only took the 1st result from the API and cached it just as quick hack, but for sure we could
  store more results for each search term. The localstorage feature uses actual disk space to store results and
  there is no experation date for how long the results will be stored, so this functionality may need to be added.
  
- I added a timeout for 1 second on the search results so the user could actually see the previous searched results
  if any, thus adding to the actual search results time (May not be the best approach, would love to hear feedback).

Another approach would be not use a REST API at all, and switch to web sockets, so that when each response item is received by the client it is rendered instantly, allowing the user to see results a lot more quicker!


Known Issues 
--------------
- Results are not persisted when the page is refreshed. 
- The transition for the "previously searched items" component messes with the main container when working with
  smaller screens. Need to make it more responsive.

Any other issues you find please let me know!

----------
The entry point down the rabbit hole is located at dev/app/client/init.js
Enjoy!
