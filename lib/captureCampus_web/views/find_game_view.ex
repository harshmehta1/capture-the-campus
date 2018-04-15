defmodule CaptureCampusWeb.FindGameView do
  use CaptureCampusWeb, :view

  def render("channelNo.json", %{channel_no: channelNo}) do
    %{
      channel_no: channelNo,
    }
  end
end
