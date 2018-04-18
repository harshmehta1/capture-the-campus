defmodule CaptureCampus.Game do

  def new(channel_no, game_size) do
    %{
      team1: [],
      team2: [],
      team_size: game_size,
      channel_no: channel_no,
      buildings: Enum.take_random(buildingList(), game_size + 1),
      team1Attacks: [],
      team2Attacks: [],
    }
  end

  def client_view(game) do
    %{
      team1: game.team1,
      team2: game.team2,
      team_size: game.team_size,
      channel_no: game.channel_no,
      buildings: game.buildings,
      team1Attacks: game.team1Attacks,
      team2Attacks: game.team2Attacks,
    }
  end

  def update_state(game) do
    %{
      team1: Map.get(game, "team1"),
      team2: Map.get(game, "team2"),
      team_size: Map.get(game, "team_size"),
      channel_no: Map.get(game, "channel_no"),
      buildings: Map.get(game, "buildings"),
      team1Attacks: Map.get(game, "team1Attacks"),
      team2Attacks: Map.get(game, "team2Attacks"),
    }
  end

  def buildingList() do
    [%{:name => "West Village H", :lat => 42.33857, :lng => -71.092355, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "" },
      %{:name => "Dodge Hall", :lat => 42.340324, :lng => -71.08785, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "" },
      %{:name => "Marino Center", :lat => 42.340272, :lng => -71.090269, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "" },
      %{:name => "ISEC", :lat => 42.337733, :lng => -71.086912, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "" },
      %{:name => "Ryder Hall", :lat => 42.336605, :lng => -71.090850, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "" },
      %{:name => "MFA", :lat => 42.339381, :lng => -71.094048, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "" },
      %{:name => "Matthews Arena", :lat => 42.341235, :lng => -71.084523, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => ""},
      %{:name => "Internation Village", :lat => 42.335102, :lng => -71.089176, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => ""},
      %{:name => "Shillman Hall", :lat => 42.337553, :lng => -71.090191, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "" },
      %{:name => "East Village", :lat => 42.340437, :lng => -71.086879, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "" }]
  end

  def handleAttack(game, building, team) do
    if (team == "team1") do
      currTeam1Attacks = Map.get(game, "team1Attacks")
      if currTeam1Attacks != nil do
        newTeam1Attacks = currTeam1Attacks ++ [building]
      else
        newTeam1Attacks = [building]
      end
      game = Map.replace!(game, "team1Attacks", newTeam1Attacks)
    else
      currTeam2Attacks = Map.get(game, "team2Attacks")
      if currTeam2Attacks != nil do
        newTeam2Attacks = currTeam2Attacks ++ [building]
      else
        newTeam2Attacks = [building]
      end
      game = Map.replace!(game, "team2Attacks", newTeam2Attacks)
    end
    game
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
