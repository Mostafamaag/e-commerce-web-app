# Ask Me

This is a RESTful API for a questions platform (people ask you, you answer them) built with Node.js, Express.js, and MySQL. 
The API allows users to ask questions, provide answers, and manage content through a role-based access control system. 
The project includes user authentication, authorization, input validation, and comprehensive error handling. 

## Features
- <p align="left"><strong> Authentication & Authorization: </strong> Sign up and login. JWT-based authentication with role-based access control</p>
- <p align="left"><strong> User Roles: </strong>Users and Admins with different access permissions.</p>
- <p align="left"><strong> CRUD Operations: </strong>Full CRUD for questions and answers.</p>
- <p align="left"><strong> Validations: </strong>Input validation for all API requests to ensure data integrity.</p>
- <p align="left"><strong> Error Handling: </strong>Comprehensive error handling with descriptive messages.</p>

## Technologies Used
- <p align="left"><strong> Backend: </strong>Express.js, Node.js, RESTful API with JSend.</p>
- <p align="left"><strong> Database: </strong>MySql, Sequelize.</p>
- <p align="left"><strong>Authentication: </strong>JSON Web Tokens (JWT).</p>
- <p align="left"><strong>Validation: </strong>Express Validator.</p>


## Run
  To run this project locally, follow these steps:
  
    git clone https://github.com/Mostafamaag/askme-api
    cd askme-api
    npm install

  Create a .env file in the root directory and add the following:
  
    DATABASE_HOST = 'your-data-base-host'
    DATABASE_USER = 'data-base-user'
    DATABASE_PASSWORD = 'data-base-password'
    DATABASE_DIALECT = 'mysql'
    PORT = port
    JWT_SECRET_KEY = 'jwt-secret-key'


