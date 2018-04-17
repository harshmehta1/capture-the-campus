defmodule CaptureCampus.Game do

  def new(channel_no, game_size) do
    %{
      team1: [],
      team2: [],
      team_size: game_size,
      channel_no: channel_no,
      buildings: [],
    }
  end

  def client_view(game) do
    %{
      team1: game.team1,
      team2: game.team2,
      team_size: game.team_size,
      channel_no: game.channel_no,
      buildings: game.buildings,
    }
  end

  def update_state(game) do
    %{
      team1: Map.get(game, "team1"),
      team2: Map.get(game, "team2"),
      team_size: Map.get(game, "team_size"),
      channel_no: Map.get(game, "channel_no"),
      buildings: Map.get(game, "buildings"),
    }
  end

  def add_user(game, user_id) do
    IO.inspect(user_id)
    IO.inspect(game)
    team1 = game.team1
    team2 = game.team2
    location = %{:lat => 0, :lng => 0}
    player = %{:user_id => user_id, :ko => false, :location => location}

    allPlayers = team1 ++ team2
    dupCheck = Enum.filter(allPlayers, fn(x) -> Map.get(x, "user_id") == user_id end)


    if length(dupCheck) == 0 do
      if length(team1) < div(game.team_size, 2) do
        team1 = team1 ++ [player]
        game = Map.replace!(game, :team1, team1)
      else
        if length(team2) < div(game.team_size, 2) do
          team2 = team2 ++ [player]
          game = Map.replace!(game, :team2, team2)
        end
      end
    end
    game
  end

  def addPlayer(user_id, state) do
    team1 = state.team1
    team2 = state.team2
    if length(team1) < 2 do
      team1 = team1 ++ [user_id]
      state = Map.put(state, :team1, team1)
    else
      team2 = team2 ++ [user_id]
      state = Map.put(state, :team2, team2)
    end
    state
  end

  def removePlayer(game, user_id) do
    team1 = Map.get(game, "team1")
    newTeam1 = Enum.filter(team1, fn(x) -> Map.get(x, "user_id")!=user_id end)
    team2 = Map.get(game, "team2")
    newTeam2 = Enum.filter(team2, fn(y) -> Map.get(y, "user_id")!=user_id end)
    game = Map.replace!(game, "team1", newTeam1)
    game = Map.replace!(game, "team2", newTeam2)
    
    IO.inspect("REMOVE")
    IO.inspect(game)
    game
  end

end
