defmodule CaptureCampus.Users.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string
    field :totalGames, :integer
    field :wins, :integer
    field :password, :string, virtual: true

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    IO.inspect(Map.get(attrs, :name))
    user
    |> cast(attrs, [:name, :email, :password_hash, :wins, :totalGames])
    |> unique_constraint(:email)
    |> validate_required([:name, :email, :password_hash, :wins, :totalGames])
    |> validate_format(:email, ~r/@/)
  end
end
