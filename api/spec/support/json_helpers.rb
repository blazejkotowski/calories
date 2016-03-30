module Requests
  module JsonHelpers
    def json
      JSON.parse(response.body, quirks_mode: true)
    end
  end
end