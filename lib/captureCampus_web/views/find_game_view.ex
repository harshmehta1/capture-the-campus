defmodule CaptureCampusWeb.FindGameView do
  use CaptureCampusWeb, :view

  def render("channelNo.json", %{channel_no: channelNo}) do
    %{
      channel_no: channelNo,
    }
  end

  def render("games.json", %{available_games: games}) do
    %{
      games: games,
    }
  end
end
