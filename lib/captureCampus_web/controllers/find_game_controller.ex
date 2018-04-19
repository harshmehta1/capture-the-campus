defmodule CaptureCampusWeb.FindGameController do
  use CaptureCampusWeb, :controller
  alias CaptureCampus.GamesList
  alias CaptureCampus.Users

  action_fallback CaptureCampusWeb.FallbackController

  def findGame(conn, %{"user_id" => user_id, "game_size" => game_size}) do
    user = Users.get_user!(user_id)
    if user.totalGames != 0 do
      rank = div(user.wins, user.totalGames) * 100
    else
      rank = 0
    end
    #rank = 0
    IO.inspect("RANK")
    IO.inspect(rank)
    IO.inspect(game_size)
    cond do
      game_size == 2 ->
        cond do
          rank in 0..25 ->
            {players, channelNo} = GamesList.load(12) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(12, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(12, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end

            #############################################

          rank in 26..50 ->
            {players, channelNo} = GamesList.load(22) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(22, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(22, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end

            #############################################

          rank in 51..75 ->
            {players, channelNo} = GamesList.load(32) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(32, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(32, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end

            ############################################

          rank in 76..100 ->
            {players, channelNo} = GamesList.load(42) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(42, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
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
          if length(players) == game_size do
            GamesList.save(14, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          else
            players = [user_id]
            GamesList.save(14, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          end

          ####################################################################

        rank in 26..50 ->
          {players, channelNo} = GamesList.load(24) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
          if !Enum.member?(players, user_id) do
            players = players ++ [user_id]
          end
          if length(players) == game_size do
            GamesList.save(24, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          else
            players = [user_id]
            GamesList.save(24, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          end

          ##################################################################

        rank in 51..75 ->
          {players, channelNo} = GamesList.load(34) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
          if !Enum.member?(players, user_id) do
            players = players ++ [user_id]
          end
          if length(players) == game_size do
            GamesList.save(34, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          else
            players = [user_id]
            GamesList.save(34, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          end

          ###################################################################

        rank in 76..100 ->
          {players, channelNo} = GamesList.load(44) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
          if !Enum.member?(players, user_id) do
            players = players ++ [user_id]
          end
          if length(players) == game_size do
            GamesList.save(44, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          else
            players = [user_id]
            GamesList.save(44, {players, channelNo})
            conn
            |> put_status(:created)
            |> render("channelNo.json", channel_no: channelNo)
          end

          ##################################################################

      end
      game_size == 6 ->
        cond do
          rank in 0..25 ->
            {players, channelNo} = GamesList.load(16) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(16, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(16, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end

            ###############################################################

          rank in 26..50 ->
            {players, channelNo} = GamesList.load(26) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(26, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(26, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end

            #############################################################

          rank in 51..75 ->
            {players, channelNo} = GamesList.load(36) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(36, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(36, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end

            ###############################################################

          rank in 76..100 ->
            {players, channelNo} = GamesList.load(46) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(46, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(46, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end

            ###############################################################

        end
      game_size == 8 ->
        cond do
          rank in 0..25 ->
            {players, channelNo} = GamesList.load(18) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(18, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
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
            if length(players) == game_size do
              GamesList.save(28, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(28, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 51..75 ->
            {players, channelNo} = GamesList.load(38) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(38, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(38, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
          rank in 76..100 ->
            {players, channelNo} = GamesList.load(48) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
            if !Enum.member?(players, user_id) do
              players = players ++ [user_id]
            end
            if length(players) == game_size do
              GamesList.save(48, {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            else
              players = [user_id]
              GamesList.save(48, {players, channelNo})
              conn
              |> put_status(:created)
              |> render("channelNo.json", channel_no: channelNo)
            end
        end
    end
  end
end
