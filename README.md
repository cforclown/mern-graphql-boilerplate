# MERN Stack Boilerplate

MERN stack boilerplate for dashboard app. Complete with login page with JWT authentication

## Project Structures

    .
    ├── app                                     # Client app (ReactJS + Webpack)
    ├── dump-log                                # generated on runtime (contain all error log per day)
    ├── public
    |   ├── prod                                # client production build (generated after build)
    |   └── staging                             # client staging build (generated after build)
    ├── src                                     # Source files
    |   ├── app                                 # express app
    |   ├── console-log                         # output log (with color)
    |   ├── controller                          # router controllers
    |   ├── dao                                 # data access object layer
    |   ├── database
    |   |   └── model                           # database schemas
    |   ├── dro                                 # data response object (server -> client)
    |   ├── dto                                 # data transfer object (client -> server)
    |   ├── error                               # error helper functions
    |   |   ├── api-error                       # api error exceptions
    |   |   └── error-dump                      # error logger (error log. log saved to file per day)
    |   ├── graphql                             # graphql
    |   |   ├── schema                          # graphql schemes
    |   |   ├── args-validator.js               # function to validate graphql request args
    |   |   ├── authentication-checker.js       # authenticate graphql request (function)
    |   |   ├── authorization-checker.js        # authorize graphql request (function)
    |   |   └── index.js                        # graphql root
    |   ├── helper                              # contains functions that may be useful
    |   ├── middleware                          # contains middleware functions, data validations, etc
    |   ├── migration                           # migration (run this script at the beginning of development)
    |   ├── passport-config                     # passport config, for authentication
    |   ├── router
    |   |   ├── api                             # api routers
    |   |   |   └── router                      # all api routers
    |   |   └── auth                            # authentication routers
    |   ├── server                              # server object
    |   ├── service                             # service layer
    |   └── index.js                            # main script
    ├── test                                    # Automated tests (alternatively `spec` or `tests`)
    ├── test-mock-data                          # Mock data for testing
    ├── LICENSE
    └── README.md

## FEATURES

-   **Beautiful Code**
-   **Unit testing**
-   **Dependency Injection**
-   **Simplified Database Query**
-   **Clear Structure** with different layers such as controllers, services, data access object, middlewares...
-   **Easy Exception Handling**
-   **Smart Validation**
-   **Custom Validators**
-   **API Documentation**
-   **API Monitoring**
-   **E2E API Testing**

## GETTING STARTED

-   clone this repository
-   npm install
-   create database
-   create development.env with this content ->

```sh
NODE_ENV=development
PORT=
APP_HOST=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
SESSION_SECRET=
SESSION_RESAVE=false
SESSION_SAVE_UNINITIALIZED=false
SESSION_COOKIE_MAX_AGE=3600
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXP_IN=3600
```

-   'npm run migrate-dev', or 'npm run migrate-prod' for production (run only once)

## DEVELOPMENT

-   'npm run dev' or 'npm run watch-dev'

## TESTING

-   'npm run test', to run all test
-   'npm run test-routers', to test only routers
-   'npm run test-services', to test only all services
-   'npm run test-coverage', to run coverage test

## SCRIPTS

-   "migrate-dev"
-   "migrate-prod"
-   "test"
-   "test-routers"
-   "test-services"
-   "test-coverage"
-   "dev"
-   "watch-dev"
-   "prod"
