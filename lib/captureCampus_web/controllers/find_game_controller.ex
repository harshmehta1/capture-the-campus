defmodule CaptureCampusWeb.FindGameController do
  use CaptureCampusWeb, :controller
  alias CaptureCampus.GamesList
  alias CaptureCampus.Users

  action_fallback CaptureCampusWeb.FallbackController

  def findGame(conn, %{"user_id" => user_id, "game_size" => game_size}) do
    user = Users.get_user!(user_id)
    if user.totalGames != 0 do
      rank = div(user.wins, user.totalGames)
    else
      rank = 0
    end
    cond do
      game_size == 2 ->
        cond do
          rank in 0..25 ->
            {players, channelNo} = GamesList.load(12) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(12, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(12, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 26-50 ->
            {players, channelNo} = GamesList.load(22) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(22, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(22, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 51-75 ->
            {players, channelNo} = GamesList.load(32) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(32, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(32, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 76-100 ->
            {players, channelNo} = GamesList.load(42) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(42, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(42, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
        end
      game_size == 4 ->
      cond do
        rank in 0..25 ->
          {players, channelNo} = GamesList.load(14) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
          if !Enum.member?(players, user_id) do
            players = players ++ [user_id]
          end
          if length(players) <= game_size do
            GamesList.save(14, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          else
            players = [user_id]
            channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
            GamesList.save(14, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          end
        rank in 26-50 ->
          {players, channelNo} = GamesList.load(24) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
          if !Enum.member?(players, user_id) do
            players = players ++ [user_id]
          end
          if length(players) <= game_size do
            GamesList.save(24, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          else
            players = [user_id]
            channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
            GamesList.save(24, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          end
        rank in 51-75 ->
          {players, channelNo} = GamesList.load(34) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
          if !Enum.member?(players, user_id) do
            players = players ++ [user_id]
          end
          if length(players) <= game_size do
            GamesList.save(34, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          else
            players = [user_id]
            channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
            GamesList.save(34, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          end
        rank in 76-100 ->
          {players, channelNo} = GamesList.load(44) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
          if !Enum.member?(players, user_id) do
            players = players ++ [user_id]
          end
          if length(players) <= game_size do
            GamesList.save(44, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          else
            players = [user_id]
            channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
            GamesList.save(44, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          end
      end
      game_size == 6 ->
        cond do
          rank in 0..25 ->
            {players, channelNo} = GamesList.load(16) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(16, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(16, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 26-50 ->
            {players, channelNo} = GamesList.load(26) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(26, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(26, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 51-75 ->
            {players, channelNo} = GamesList.load(36) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(36, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(36, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 76-100 ->
            {players, channelNo} = GamesList.load(46) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(46, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(46, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
        end
      game_size == 8 ->
        cond do
          rank in 0..25 ->
            {players, channelNo} = GamesList.load(18) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(18, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(18, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 26-50 ->
            {players, channelNo} = GamesList.load(28) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(28, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(28, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 51-75 ->
            {players, channelNo} = GamesList.load(38) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(38, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(38, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 76-100 ->
            {players, channelNo} = GamesList.load(4) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) <= game_size do
              GamesList.save(48, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
              GamesList.save(48, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
        end
    end
  end
end
