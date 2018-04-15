defmodule CaptureCampus do
  use Application

  @id_length Application.get_env(:battleship, :id_length)
  # ...
  # ...

  def generate_game_id do
    @id_length
    |> :crypto.strong_rand_bytes
    |> Base.url_encode64()
    |> binary_part(0, @id_length)
  end
  # ...

    def start(_type, _args) do
      import Supervisor.Spec, warn: false

      # ...

      children = [
        # ...
        supervisor(CaptureCampus.Game.Supervisor, []),
      ]
    end

    # ...
  # ...
end
