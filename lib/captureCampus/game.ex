defmodule CaptureCampus.Game do
  alias CaptureCampus.Users

  def new(channel_no, game_size) do
    %{
      team1: [],
      team2: [],
      team_size: game_size,
      channel_no: channel_no,
      buildings: Enum.take_random(buildingList(), game_size + 1),
      team1Attacks: [],
      team2Attacks: [],
      team1Score: 0,
      team2Score: 0,
      status: "Waiting For Players",
      winner: "",
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
      team1Score: game.team1Score,
      team2Score: game.team2Score,
      status: game.status,
      winner: game.winner,

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
      team1Score: Map.get(game, "team1Score"),
      team2Score: Map.get(game, "team2Score"),
      status: Map.get(game, "status"),
      winner: Map.get(game, "winner"),
    }
  end

  def buildingList() do
    [%{:name => "West Village H", :lat => 42.33857, :lng => -71.092355, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => "" },
      %{:name => "Dodge Hall", :lat => 42.340324, :lng => -71.08785, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => "" },
      %{:name => "Marino Center", :lat => 42.340272, :lng => -71.090269, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => "" },
      %{:name => "ISEC", :lat => 42.337733, :lng => -71.086912, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => "" },
      %{:name => "Ryder Hall", :lat => 42.336605, :lng => -71.090850, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => "" },
      %{:name => "MFA", :lat => 42.339381, :lng => -71.094048, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => "" },
      %{:name => "Matthews Arena", :lat => 42.341235, :lng => -71.084523, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => ""},
      %{:name => "Internation Village", :lat => 42.335102, :lng => -71.089176, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => ""},
      %{:name => "Shillman Hall", :lat => 42.337553, :lng => -71.090191, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => "" },
      %{:name => "East Village", :lat => 42.340437, :lng => -71.086879, :captured => false, :underAttack => false, :attacker => %{}, :attackEnds => "", :owner => "" }]
  end

  def revivePlayer(game, user_id, team) do

    if team == "team1" do
      myTeam = Map.get(game, "team1")
      thisPlayer = Enum.find(myTeam, fn(x) -> Map.get(x, "user_id")==user_id end)
      myTeam = List.delete(myTeam, thisPlayer)
      thisPlayer = Map.replace!(thisPlayer, "ko", false)
      myTeam = myTeam ++ [thisPlayer]
      game = Map.replace!(game, "team1", myTeam)
    else
      myTeam = Map.get(game, "team2")
      thisPlayer = Enum.find(myTeam, fn(x) -> Map.get(x, "user_id")==user_id end)
      myTeam = List.delete(myTeam, thisPlayer)
      thisPlayer = Map.replace!(thisPlayer, "ko", false)
      myTeam = myTeam ++ [thisPlayer]
      game = Map.replace!(game, "team2", myTeam)
    end
    game
  end

  def defendBuilding(game, building, team) do

    attacker = Map.get(building, "attacker")
    userToKO = Map.get(attacker, "user_id")

    allBuildings = Map.get(game, "buildings")
    delBuildings = List.delete(allBuildings, building)
    newBuilding = Map.replace!(building, "underAttack", false)
    newBuilding = Map.replace!(newBuilding, "attacker", %{})
    newBuilding = Map.replace!(newBuilding, "attackEnds", "")
    newBuildings = delBuildings ++ [newBuilding]
    game = Map.replace!(game, "buildings", newBuildings)

    if team == "team1" do
      enemyTeam = Map.get(game, "team2")
      enemy = Enum.find(enemyTeam, fn(x) -> Map.get(x, "user_id")==userToKO end)
      enemyTeam = List.delete(enemyTeam, enemy)
      enemy = Map.replace!(enemy, "ko", true)
      enemyTeam = enemyTeam ++ [enemy]
      game = Map.replace!(game, "team2", enemyTeam)
      enemyAttacks = Map.get(game, "team2Attacks")
      enemyAttacks = List.delete(enemyAttacks, building)
      game = Map.replace!(game, "team2Attacks", enemyAttacks)
    else
      enemyTeam = Map.get(game, "team1")
      enemy = Enum.find(enemyTeam, fn(x) -> Map.get(x, "user_id")==userToKO end)
      enemyTeam = List.delete(enemyTeam, enemy)
      enemy = Map.replace!(enemy, "ko", true)
      enemyTeam = enemyTeam ++ [enemy]
      game = Map.replace!(game, "team1", enemyTeam)
      enemyAttacks = Map.get(game, "team1Attacks")
      enemyAttacks = List.delete(enemyAttacks, building)
      game = Map.replace!(game, "team1Attacks", enemyAttacks)
    end
    game
  end

  def handleAttack(game, building, team, user_id, currTime) do

    allBuildings = Map.get(game, "buildings")
    delBuildings = List.delete(allBuildings, building)
    building = Map.replace!(building, "underAttack", true)
    building = Map.replace!(building, "attacker", %{:user_id => user_id, :team => team})
    building = Map.replace!(building, "attackEnds", currTime)

    newBuildings = delBuildings ++ [building]

    game = Map.replace!(game, "buildings", newBuildings)


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

  def cancelAttack(game, building) do

    attacker = Map.get(building, "attacker")
    team = Map.get(attacker, "team")
    if(team == "team1") do
      currTeam1Attacks = Map.get(game, "team1Attacks")
      currTeam1Attacks = List.delete(currTeam1Attacks, building)
      game = Map.replace!(game, "team1Attacks", currTeam1Attacks)
    else
      currTeam2Attacks = Map.get(game, "team2Attacks")
      currTeam2Attacks = List.delete(currTeam2Attacks, building)
      game = Map.replace!(game, "team2Attacks", currTeam2Attacks)
    end


    allBuildings = Map.get(game, "buildings")
    delBuildings = List.delete(allBuildings, building)
    building = Map.replace!(building, "underAttack", false)
    building = Map.replace!(building, "attacker", %{})
    building = Map.replace!(building, "attackEnds", "")

    newBuildings = delBuildings ++ [building]


    game = Map.replace!(game, "buildings", newBuildings)
    game
  end

  def captureBuilding(game, building, team) do
    if team == "team1" do
      currentAttacks = Map.get(game, "team1Attacks")
      newAttacks = List.delete(currentAttacks, building)
      game = Map.replace!(game, "team1Attacks", newAttacks)
      currentScore = Map.get(game, "team1Score")
      currentScore = currentScore + 1;
      game = Map.replace!(game, "team1Score", currentScore)
    else
      currentAttacks = Map.get(game, "team2Attacks")
      newAttacks = List.delete(currentAttacks, building)
      game = Map.replace!(game, "team2Attacks", newAttacks)
      currentScore = Map.get(game, "team2Score")
      currentScore = currentScore + 1;
      game = Map.replace!(game, "team2Score", currentScore)
    end

    team1FinScore = Map.get(game, "team1Score")
    team2FinScore = Map.get(game, "team2Score")
    totalScore = team1FinScore + team2FinScore

    team1 = Map.get(game, "team1")
    team2 = Map.get(game, "team2")

    if totalScore == length(Map.get(game, "buildings")) do
      if team1FinScore > team2FinScore do
        game = Map.replace!(game, "winner", "team1")
        Enum.map(team1, fn(x) -> Users.addWins(Map.get(x, "user_id")) end)
        Enum.map(team1 ++ team2, fn(x) -> Users.addGames(Map.get(x, "user_id")) end)
      else
        game = Map.replace!(game, "winner", "team2")
        Enum.map(team2, fn(x) -> Users.addWins(Map.get(x, "user_id")) end)
        Enum.map(team1 ++ team2, fn(x) -> Users.addGames(Map.get(x, "user_id")) end)
      end
    end

    allBuildings = Map.get(game, "buildings")
    delBuildings = List.delete(allBuildings, building)
    building = Map.replace!(building, "underAttack", false)
    building = Map.replace!(building, "attacker", %{})
    building = Map.replace!(building, "attackEnds", "")
    building = Map.replace!(building, "captured", true)
    building = Map.replace!(building, "owner", team)
    newBuildings = delBuildings ++ [building]

    game = Map.replace!(game, "buildings", newBuildings)
    game

  end


  def add_user(game, user_id) do
    IO.inspect(user_id)
    IO.inspect(game)
    team1 = Map.get(game, :team1)
    team2 = Map.get(game, :team2)
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

    allPlayers = team1 ++ team2
    IO.inspect("ADDUSER")
    IO.inspect(length(allPlayers))
    IO.inspect(game.team_size)
    if length(allPlayers) == game.team_size do
      game = Map.put(game, :status, "start")
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
   if (Map.get(game, "status") == "start") && (length(newTeam1) == 0) do
     Enum.map(team2, fn(x) -> Users.addWins(Map.get(x, "user_id")) end)
     Enum.map(team1 ++ team2, fn(x) -> Users.addGames(Map.get(x, "user_id")) end)
     game = Map.put(game, "status", "Game Over!")
     game = Map.put(game, "winner", "team2")
   end
   if (Map.get(game, "status") == "start") && (length(newTeam2) == 0) do
     Enum.map(team1, fn(x) -> Users.addWins(Map.get(x, "user_id")) end)
     Enum.map(team1 ++ team2, fn(x) -> Users.addGames(Map.get(x, "user_id")) end)
     game = Map.put(game, "status", "Game Over!")
     game = Map.put(game, "winner", "team1")
   end
   game = Map.replace!(game, "team1", newTeam1)
   game = Map.replace!(game, "team2", newTeam2)

   IO.inspect("REMOVE")
   IO.inspect(game)
   game
  end

end
