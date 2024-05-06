# Blogger App

Welcome to the Blogger App, a simple and intutive blogging platform built using the MEAN Stack (MongoDB,
Express, Angular, and Node.js) and adhering to the MCV (Model-View-Controller) architecture. This application allows users to manage blog posts and interact through comments and reasions.

## Features
* User Authentication: Secure login and registration functionality to manage personal accounts.
* Blog Management: Users can add, edit, and delete their blog posts
* Comments and Reactions: Ability to add comments to post and react to these comments

## Prerequisites

Before you begin, ensure you have the following installed on your system:
* Node.js
* npm (Node Package Manager)
* MongoDB
* Angular CLI

## Installation
To get the the Blogger App running locally, follow these steps:

#### Clone the repository
``` git clone https://github.com/almostTaklu/MEAN-Project.git```\
``` cd MEAN-Project```

#### Install dependencies
```npm install```

#### Set up the environment variables
Create a `.env` file in the root dectory and update it your MongoDB URI and any other configurations you might need:\
\
```DB_URI=mongodb://<username>:<password>@localhost/<DB>```\
```JWT_SECRET=secret``` \

`secret` can any string.

#### Run the application
`npm start`



