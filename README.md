# CaptureCampus 

https://capture.mehtaharsh.me/

Introduction and App Description

We built a capture the flag type game, using real locations on Northeastern’s campus.  The game is a single page application played between two equal sized teams.  The objective of the game is to “capture” as many buildings as possible, and the team that captures the most at the end of the game wins.  In order to successfully capture a building, a player must be within a specified proximity of the building and activate the capture button.  Once the button is activated, they must wait 60 seconds at the spot.  If they leave the area within the 60 seconds, the building is not successfully captured.  In order to make things more interesting, during the 60 second window,  an opponent can run over to the building being captured and KO (defend) it so it is not captured.  If this happens, the player who was KO’d cannot capture or defend another building until they go to Snell Library and respawn.   

The front-end uses React/Redux and the back-end uses Elixir and the Phoenix Framework.   We chose to implement the front-end using React/Redux because the application is designed to be used with a mobile device.  As mobile devices have varying screen sizes/resolutions, it was imperative that our UI is responsive and rendered appropriately on all screens.  We leveraged the Google Maps API and HTML5 Geolocation to render maps and track player location, respectively.  Our game supports an unlimited number of concurrently running games and an unlimited number of users can register.  The user data (name, email, password hash and wins and total games played) is stored in a Postgres database.  Although our application works on Firefox and Chrome, we recommend using Chrome for the best experience.     


To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
