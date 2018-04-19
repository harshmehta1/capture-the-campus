defmodule CaptureCampusWeb.Router do
  use CaptureCampusWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", CaptureCampusWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/users", PageController, :index
    get "/users/:id", PageController, :index
    get "/game", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api/v1", CaptureCampusWeb do
    pipe_through :api
    resources "/users", UserController, except: [:new, :edit]
    post "/token", TokenController, :create
    post "/newgame", FindGameController, :findGame
    post "/unrankedgame", FindGameController, :unrankedGame
  end

  # Other scopes may use custom stacks.
  # scope "/api", CaptureCampusWeb do
  #   pipe_through :api
  # end
end
