use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :captureCampus, CaptureCampusWeb.Endpoint,
  secret_key_base: "GyQMukQojScfvU1g5MXL/6lzQd/zloVPEU6CJDl7vvCOXcFnSG/oSTaG8+RwA2Kv"

# Configure your database
config :captureCampus, CaptureCampus.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "capturecampus",
  password: "postgres",
  database: "capturecampus_prod",
  pool_size: 15
