defmodule CaptureCampusWeb.GamesChannel do
  use CaptureCampusWeb, :channel
  alias CaptureCampus.GameBackup
  alias CaptureCampus.Game
  alias CaptureCampus.GamesList
  alias CaptureCampus.Users

  def join("games:" <> channel_no, %{"user_id" => user_id, "game_size" => game_size, "is_ranked" => is_ranked}, socket) do
    IO.inspect("JOIN")
    game = CaptureCampus.GameBackup.load(channel_no) || Game.new(channel_no, game_size, is_ranked)
    game = Game.add_user(game, user_id)

    IO.inspect(game)
    send(self, {:after_join, game})
    socket = socket
      |> assign(:game, game)
      |> assign(:channel_no, channel_no)
      |> assign(:user_id, user_id)
    {:ok, %{"join" => channel_no, "game" => Game.client_view(game)}, socket}
  end

  def handle_info({:after_join, game}, socket) do
    IO.inspect("AFTER_JOIN")
    broadcast! socket, "state_update", game
    {:noreply, socket}
  end

  def handle_in("broadcast_my_state", game, socket) do
    broadcast! socket, "state_update", game
    {:noreply, socket}
  end

  def handle_in("ko", payload, socket) do
    broadcast! socket, "player_kod", payload
    {:noreply, socket}
  end

  def handle_in("capture_building", %{"game" => game, "building" => building, "team" => team}, socket) do
    game = Game.captureBuilding(game, building, team)
    broadcast! socket, "state_update", game
    {:noreply, socket}
  end

  def handle_in("cancel_attack", %{"game" => game, "building" => building}, socket) do
    game = Game.cancelAttack(game, building)
    broadcast! socket, "state_update", game
    {:noreply, socket}
  end

  def handle_in("update_state", game, socket) do
    IO.inspect("broadcast received")
    IO.inspect(game)
    game = Game.update_state(game)
    CaptureCampus.GameBackup.save(socket.assigns[:channel_no], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("revive", %{"game" => game, "user_id" => user_id, "team" => team}, socket) do
    game = Game.revivePlayer(game, user_id, team)
    broadcast! socket, "state_update", game
    {:noreply, socket}
  end

  def handle_in("defend", %{"game" => game, "building" => building, "team" => team}, socket) do
    game = Game.defendBuilding(game, building, team)
    broadcast! socket, "state_update", game
    {:noreply, socket}
  end

  def handle_in("attack", %{"building" => building, "game" => game, "attackingTeam" => team, "user_id" => user_id, "start_time" => currTime}, socket) do
    game = Game.handleAttack(game, building, team, user_id, currTime)
    broadcast! socket, "attack_incoming", game
    # IO.inspect(game)
    {:noreply, socket}
  end

   def handle_in("deleteUser", %{"user_id" => user_id, "game_size" => game_size, "game" => game}, socket) do
     game = Game.removePlayer(game, user_id)
     if (length(Map.get(game, "team1")) + length(Map.get(game, "team2")) == 0) do
       GameBackup.save(socket.assigns[:channel_no], nil)
     else
       GameBackup.save(socket.assigns[:channel_no], game)
     end
     if Map.get(game, "is_ranked") do
       user = Users.get_user!(user_id)
       if user.totalGames != 0 do
         rank = div(user.wins, user.totalGames) * 100
       else
         rank = 0
       end
       cond do
         game_size == 2 ->
           cond do
            rank in 0..25 ->
             {players, channelNo} = GamesList.load(12)
             if Enum.member?(players, user_id) do
               players = List.delete(players, user_id)
               GamesList.save(12, {players, channelNo})
             end
             rank in 26..50 ->
              {players, channelNo} = GamesList.load(22)
              if Enum.member?(players, user_id) do
                players = List.delete(players, user_id)
                GamesList.save(22, {players, channelNo})
              end
              rank in 51..75 ->
              {players, channelNo} = GamesList.load(32)
              if Enum.member?(players, user_id) do
                players = List.delete(players, user_id)
                GamesList.save(32, {players, channelNo})
              end
              rank in 76..100 ->
               {players, channelNo} = GamesList.load(42)
               if Enum.member?(players, user_id) do
                players = List.delete(players, user_id)
                GamesList.save(42, {players, channelNo})
               end
           end
         game_size == 4 ->
         cond do
          rank in 0..25 ->
           {players, channelNo} = GamesList.load(14)
           if Enum.member?(players, user_id) do
             players = List.delete(players, user_id)
               IO.inspect("Players After Delete#{players}")
             GamesList.save(14, {players, channelNo})
           end
           rank in 26..50 ->
            {players, channelNo} = GamesList.load(24)
            if Enum.member?(players, user_id) do
              players = List.delete(players, user_id)
              GamesList.save(24, {players, channelNo})
            end
            rank in 51..75 ->
            {players, channelNo} = GamesList.load(34)
            if Enum.member?(players, user_id) do
              players = List.delete(players, user_id)
              GamesList.save(34, {players, channelNo})
            end
            rank in 76..100 ->
             {players, channelNo} = GamesList.load(44)
             if Enum.member?(players, user_id) do
              players = List.delete(players, user_id)
              GamesList.save(44, {players, channelNo})
             end
         end
         game_size == 6 ->
         cond do
           rank in 0..25 ->
             {players, channelNo} = GamesList.load(16)
             if Enum.member?(players, user_id) do
               players = List.delete(players, user_id)
               GamesList.save(16, {players, channelNo})
             end
           rank in 26..50 ->
             {players, channelNo} = GamesList.load(26)
             if Enum.member?(players, user_id) do
               players = List.delete(players, user_id)
               GamesList.save(26, {players, channelNo})
             end
           rank in 51..75 ->
             {players, channelNo} = GamesList.load(36)
             if Enum.member?(players, user_id) do
               players = List.delete(players, user_id)
               GamesList.save(36, {players, channelNo})
             end
           rank in 76..100 ->
             {players, channelNo} = GamesList.load(46)
             if Enum.member?(players, user_id) do
               players = List.delete(players, user_id)
               GamesList.save(46, {players, channelNo})
             end
          end
          game_size == 8 ->
          cond do
            rank in 0..25 ->
              {players, channelNo} = GamesList.load(18)
              if Enum.member?(players, user_id) do
                players = List.delete(players, user_id)
                GamesList.save(18, {players, channelNo})
              end
            rank in 26..50 ->
              {players, channelNo} = GamesList.load(28)
              if Enum.member?(players, user_id) do
                players = List.delete(players, user_id)
                GamesList.save(28, {players, channelNo})
              end
            rank in 51..75 ->
              {players, channelNo} = GamesList.load(38)
              if Enum.member?(players, user_id) do
                players = List.delete(players, user_id)
                GamesList.save(38, {players, channelNo})
              end
            rank in 76..100 ->
              {players, channelNo} = GamesList.load(48)
              if Enum.member?(players, user_id) do
                players = List.delete(players, user_id)
                GamesList.save(48, {players, channelNo})
              end
          end
       end
     else
       {players, channelNo} = GamesList.load(0)
       if Enum.member?(players, user_id) do
         players = List.delete(players, user_id)
         GamesList.save(0, {players, channelNo})
       end
     end
     broadcast! socket, "state_update", game
     {:noreply, socket}
   end
  #
  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (games:lobby).
  # def handle_in("shout", payload, socket) do
  #   broadcast socket, "shout", payload
  #   {:noreply, socket}
  # end

  # chat functionality
  def handle_in("sendMsg", payload, socket) do
    broadcast! socket, "sendMsg", %{"msg" => payload["message"], "srcTeam" => payload["team"]}
    {:noreply, socket}
  end


  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
