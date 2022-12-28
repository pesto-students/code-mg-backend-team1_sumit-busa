![Logo](./favicon.ico) 
# Code MG

CodeMg provides a way for teachers to evaluate coding assignments effectively by automating code compilation and checking assignments for plagiarism.
CodeMG is a single platform for all coding assignments with compiler and test cases.

## Table of Contents

#### Demo

#### Installation

#### Technology Stack

#### Authors

#### License

## Demo

http://65.1.177.115:3000/login

## Installation

In the project directory, run:

#### `npm install`



Installs all the necessary dependency in the project

### Set process.env

create a file .env and copy content of .env.dev to it

- in the DB_URI
    - update your postgresql db connection values in following format

    ```postgresql://username:password@hostname:port/db_name?schema=public```

    example : 

    ```postgresql://postgres:12345678@localhost:5432/codeMg_dev?schema=public```

#### Run: 
```npx prisma migrate dev```

#### `npm run dev`

Runs the app in the development mode.


You are ready to go


## Technology Stack

 - NodeJs with Typescript
 - ExpressJs
 - Prisma
 - Socket.io

## Authors

- Rockey Pandit
- Suraj Wadje

## Licence

MIT Licence