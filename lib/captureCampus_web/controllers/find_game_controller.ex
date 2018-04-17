defmodule CaptureCampusWeb.FindGameController do
  use CaptureCampusWeb, :controller
  alias CaptureCampus.GamesList

  action_fallback CaptureCampusWeb.FallbackController

  def findGame(conn, %{"user_id" => user_id}) do
        {players, channelNo} = GamesList.load(1) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
        if !Enum.member?(players, user_id) do
          players = players ++ [user_id]
        end
        if length(players) <= 2 do
          GamesList.save(1, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        else
          players = [user_id]
          channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
          GamesList.save(1, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        end
end
end
