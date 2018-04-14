defmodule CaptureCampus.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :email, :string
      add :password_hash, :string
      add :wins, :integer
      add :totalGames, :integer

      timestamps()
    end

  end
end
