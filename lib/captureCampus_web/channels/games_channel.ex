defmodule CaptureCampusWeb.GamesChannel do
  use CaptureCampusWeb, :channel
  alias CaptureCampus.GameBackup
  alias CaptureCampus.Game
  alias CaptureCampus.GamesList
  alias CaptureCampus.Users

  def join("games:" <> channel_no, %{"user_id" => user_id. "game_size" => game_size}, socket) do
    IO.inspect("JOIN")
    game = CaptureCampus.GameBackup.load(channel_no) || Game.new(channel_no, game_size)
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

  def handle_in("update_state", game, socket) do
    IO.inspect("broadcast received")
    IO.inspect(game)
    game = Game.update_state(game)
    CaptureCampus.GameBackup.save(socket.assigns[:channel_no], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end


  # # Channels can be used in a request/response fashion
  # # by sending replies to requests from the client
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end
  #
   def handle_in("addUser", payload, socket) do
     game = Game.addPlayer(payload["user_id"], payload["game_size"], GameBackup.load(socket.assigns[:channel_no]))
     GameBackup.save(socket.assigns[:channel_no], game)
     broadcast socket, "shout", %{"game" => game}
     {:noreply, socket}
   end
  #
   def handle_in("deleteUser", payload, socket) do
     game = Game.removePlayer(payload["user_id"], GameBackup.load(socket.assigns[:channel_no]))
     GameBackup.save(socket.assigns[:channel_no], game)
     user = Users.get_user!(payload["user_id"])
     if user.totalGames != 0 do
       rank = div(user.wins, user.totalGames)
     else
       rank = 0
     end
     cond do
       payload["game_size"] == 4 ->
       cond do
        rank in 0..25 ->
         {players, channelNo} = GamesList.load(14)
         if Enum.member?(players, payload["user_id"]) do
           players = List.delete(players, payload["user_id"])
           GamesList.save(14, {players, channelNo})
         end
         rank in 26..50 ->
          {players, channelNo} = GamesList.load(24)
          if Enum.member?(players, payload["user_id"]) do
            players = List.delete(players, payload["user_id"])
            GamesList.save(24, {players, channelNo})
          end
          rank in 51..75 ->
          {players, channelNo} = GamesList.load(34)
          if Enum.member?(players, payload["user_id"]) do
            players = List.delete(players, payload["user_id"])
            GamesList.save(34, {players, channelNo})
          end
          rank in 76..100 ->
           {players, channelNo} = GamesList.load(44)
           if Enum.member?(players, payload["user_id"]) do
            players = List.delete(players, payload["user_id"])
            GamesList.save(44, {players, channelNo})
           end
       end
       payload["game_size"] == 6 ->
       cond do
         rank in 0..25 ->
           {players, channelNo} = GamesList.load(16)
           if Enum.member?(players, payload["user_id"]) do
             players = List.delete(players, payload["user_id"])
             GamesList.save(16, {players, channelNo})
           end
         rank in 26..50 ->
           {players, channelNo} = GamesList.load(26)
           if Enum.member?(players, payload["user_id"]) do
             players = List.delete(players, payload["user_id"])
             GamesList.save(26, {players, channelNo})
           end
         rank in 51..75 ->
           {players, channelNo} = GamesList.load(36)
           if Enum.member?(players, payload["user_id"]) do
             players = List.delete(players, payload["user_id"])
             GamesList.save(36, {players, channelNo})
           end
         rank in 76..100 ->
           {players, channelNo} = GamesList.load(46)
           if Enum.member?(players, payload["user_id"]) do
             players = List.delete(players, payload["user_id"])
             GamesList.save(46, {players, channelNo})
           end
        end
        payload["game_size"] == 8 ->
        cond do
          rank in 0..25 ->
            {players, channelNo} = GamesList.load(18)
            if Enum.member?(players, payload["user_id"]) do
              players = List.delete(players, payload["user_id"])
              GamesList.save(18, {players, channelNo})
            end
          rank in 26..50 ->
            {players, channelNo} = GamesList.load(28)
            if Enum.member?(players, payload["user_id"]) do
              players = List.delete(players, payload["user_id"])
              GamesList.save(28, {players, channelNo})
            end
          rank in 51..75 ->
            {players, channelNo} = GamesList.load(38)
            if Enum.member?(players, payload["user_id"]) do
              players = List.delete(players, payload["user_id"])
              GamesList.save(38, {players, channelNo})
            end
          rank in 76..100 ->
            {players, channelNo} = GamesList.load(48)
            if Enum.member?(players, payload["user_id"]) do
              players = List.delete(players, payload["user_id"])
              GamesList.save(48, {players, channelNo})
            end
        end
     end
     broadcast socket, "shout", %{"game" => game}
     {:noreply, socket}
   end
  #
  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (games:lobby).
  # def handle_in("shout", payload, socket) do
  #   broadcast socket, "shout", payload
  #   {:noreply, socket}
  # end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
