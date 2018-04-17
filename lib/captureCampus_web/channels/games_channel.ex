defmodule CaptureCampusWeb.GamesChannel do
  use CaptureCampusWeb, :channel
  alias CaptureCampus.GameBackup
  alias CaptureCampus.Game
  alias CaptureCampus.GamesList

  def join("games:" <> channel_no, %{"user_id" => user_id}, socket) do
    IO.inspect("JOIN")
    game = CaptureCampus.GameBackup.load(channel_no) || Game.new(channel_no)
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
  # def handle_in("addUser", payload, socket) do
  #   game = Game.addPlayer(payload["user_id"], GameBackup.load(socket.assigns[:channel_no]))
  #   GameBackup.save(socket.assigns[:channel_no], game)
  #   broadcast socket, "shout", %{"game" => game}
  #   {:noreply, socket}
  # end
  #
  # def handle_in("deleteUser", payload, socket) do
  #   game = Game.removePlayer(payload["user_id"], GameBackup.load(socket.assigns[:channel_no]))
  #   GameBackup.save(socket.assigns[:channel_no], game)
  #   cond do
  #     payload["win_percent"] in 0..24 ->
  #       {players, channelNo} = GamesList.load(1)
  #       if Enum.member?(players, payload["user_id"]) do
  #         players = List.delete(players, payload["user_id"])
  #         GamesList.save(1, {players, channelNo})
  #       end
  #     payload["win_percent"] in 25..49 ->
  #       {players, channelNo} = GamesList.load(2)
  #       if Enum.member?(players, payload["user_id"]) do
  #         players = List.delete(players, payload["user_id"])
  #         GamesList.save(2, {players, channelNo})
  #       end
  #     payload["win_percent"] in 50..74 ->
  #       {players, channelNo} = GamesList.load(3)
  #       if Enum.member?(players, payload["user_id"]) do
  #         players = List.delete(players, payload["user_id"])
  #         GamesList.save(3, {players, channelNo})
  #       end
  #     payload["win_percent"] in 75..100 ->
  #       {players, channelNo} = GamesList.load(4)
  #       if Enum.member?(players, payload["user_id"]) do
  #         players = List.delete(players, payload["user_id"])
  #         GamesList.save(4, {players, channelNo})
  #       end
  #   end
  #   broadcast socket, "shout", %{"game" => game}
  #   {:noreply, socket}
  # end
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
