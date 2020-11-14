# Coding Assessment for Lucky App (CONFIDENTIAL)

> Node.js API + PostgreSQL + Redis cache

## Project description and tools
This is based on Nest.js Framework using TypeScript 4

- Support ES6/ES7 features
- Eslint + Prettier + Husky (git hooks)
- Docker Compose

## Features
##### RESTful API
##### JWT Authentication
##### Database/Cache persistence
##### Unit/Integration testing with Jest

## Requirements

- node >= 14.15.0 (LTS)
- npm >= 6
- postgres >= 13.0
- postgres >= 6.0
- typescript >= 4.0

## Structure

```
├── src
│├── config
││└── ...
││
│├── modules
││├── app
│││   └── ...
││├── auth
│││   └── ...
││└── users
││    └── ...
││
│├── dto
││└── ...
│├── middlewares
││└── ...
│├── decorators
││└── ...
│├── pipes
││└── ...
│├── guards
││└── ...
││
│└── main.ts
│
├── docker-compose.yml
├── index.js
├── nest-cli.json
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```


## Running the API
### Development
To start the application in localhost (watch) mode, run:

```
npm run start:dev
```

NestJS server listening on `http://localhost:5000/`
The developer mode will watch your changes then will transpile the TypeScript code and re-run the NodeJS application automatically.

### Docker
To start the application run:
``` 
  docker-compose up 
```
  
## Setup environment
In root folder you can find `.env` and `docker-compose.yml` files. 
You can change those for your purposes.


## Deploy 
### AWS Fargate
Check all urls to dbs if they are true, they must connect to dbs which located at them own servers like mongodb on Mlab
When you'll run npm run deploy:heroku you'll need to sign in on heroku. You will be redirected to login form.

```
npm run deploy:aws
```


## Swagger
Swagger documentation will be available at `http://localhost:5000/api`


## Stay in touch

Made with 🖤 by [GeroSalas](https://github.com/GeroSalas)
- LinkedIn - [https://www.linkedin.com/in/geronimops/](https://www.linkedin.com/in/geronimops/)
