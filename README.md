# Calories App

Calories is an application for controlling the calories consumption. It is an final effect of a part of recruitment process by TopTal.

### Tech
Application consists of two main parts:
- First part is the API implemented as a *Ruby on Rails 4* application.
- Second part is a frontend implemented using *Angular.js*

### Setting up the environment
To start the application you have to clone the repository to the development environemnt. **ruby**, **node.js**, **bundler**, **bower** and **grunt** should be already installed in the system.

##### API
After cloning the repository, install *API* dependencies.:

```sh
$ cd api
$ bundle install
```

You have to create the database configuration before starting the app. Database configuration file is located in *api/config/database.yml*. A file content should like similiar to the following:

```yaml
development:
  adapter: postgresql
  pool: 5
  timeout: 5000
  host: localhost
  database: development_database
  user: database_user
  password: database_password
```

After that, you are ready to migrate the database and start the *API* on your local machine:

```sh
$ bundle exec rake db:setup
$ bundle exec rails server RAILS_ENV=development
```

You can also start the tests to ensure *API* behaves as expected:
```sh
$ bundle exec rspec spec
```

##### Front-end
To start the front-end application you have to install dependencies with **bower** first. Type the following from the root directory of repository:

```sh
$ cd client
$ bower install
```

Now run build and run the app on local server:

```sh
$ grunt build
$ grunt serve:dist
```

Application is available at http://localhost:9000 now.

### API 
A few words about *API*:
- It is driven by lightweight Ruby on Rails application. Lightweight means that only railties necessary to run the API backend were used. API controllers inherit from ActionController::Metal and include necessary modules.
- It is fully rest which means it is also stateless. The authentication is realized using **JWT** standard.

### Author
Błażej Kotowski (kotowski.blazej@gmail.com)
