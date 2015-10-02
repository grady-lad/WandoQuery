# WandoQuery

Submission for Wando. Can be found <INSERT URL HERE>

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
    to the app and allow people or teams to work without much interruption.
  - Its fast! React works with a virtual dom, and hopefully you will be able to see 
    in this web app that it is quite fast. 
  - And it is also quite easy to work with and speed up the workflow of the project.
- Node
  - Solely used as a server to host the app and server up the homepage.
- Sass 
  - Allowed for more dynamic creation of CSS 

Bonus
--------
For the bonus round which was focused on the usecase "what to show/do while a user is waiting"

- I implemented a recently searched cached, so if the user performs the same search again or a search
  that contains keywords from previous searches, they will see related products while they wait for there search
  results.

- This was just a quick implementation, basically what I did was get the 1st item from the API response and
  cached it used the localstorage Object. Then when a returning user searched for products that were similar to
  their previous searches, I would display the item while they are waiting on a their current search result.

- We could add to the cache functionality to show more products rather than one, but also localstorage works of
  actual diskspace, so to be honest I am not too sure if it is bad practice using it, especially if you have a
  user who searches for an insane amount of different products a day!

Another approach would be not use a REST API at all, and switch to web sockets, so that when each response item is received by the client it is rendered instantly, allowing the user to see results a lot more quicker!


Known Issues 
--------------
- Results are not persisted when the page is refreshed. 
- The transition for the "previously searched items" component messes with the main container when working with
  smaller screens.
- Few deployment issues with Heroku (separating build and dist folders for prod and dev)
- further enhancement (disable button during query???)

Any other issues you find please let me know!

----------
The entry point down the rabbit hole is located at dev/app/client/init.js
Enjoy!
