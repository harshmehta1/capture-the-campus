defmodule CaptureCampusWeb.TokenView do
  use CaptureCampusWeb, :view

  def render("token.json", %{user: user, token: token}) do
    %{
      user_name: user.name,
      user_id: user.id,
      token: token,
    }
  end
end
