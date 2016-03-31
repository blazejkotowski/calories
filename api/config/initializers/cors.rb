Rails.application.config.middleware.insert_before 0, "Rack::Cors" do
  allow do
    origins 'localhost:9000'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :head, :options]
  end
end
