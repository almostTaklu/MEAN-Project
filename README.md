# Blogger App

Welcome to the Blogger App, a simple and intuitive blogging platform built using the MEAN Stack (MongoDB, Express, Angular, and Node.js) and adhering to the MVC (Model-View-Controller) architecture. This application allows users to manage blog posts and interact through comments and reactions.

## Features
- User Authentication: Secure login and registration functionality to manage personal accounts.
- Blog Management: Users can add, edit, and delete their blog posts.
- Comments and Reactions: Ability to add comments to posts and react to these comments.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Node.js
- npm (Node Package Manager)
- MongoDB
- Angular CLI

## Installation

To get the Blogger App running locally, follow these steps:

### Clone the repository
```
git clone https://github.com/almostTaklu/MEAN-Project.git
cd MEAN-Project
```
### Install dependencies
`npm install`

### Set up the environment variables

Create a `.env` file in the root directory and update it with your MongoDB URI and any other configurations you might need:
```
DB_URI=mongodb://<username>:<password>@localhost/<DB>
JWT_SECRET=secret
```

Replace `<username>`, `<password>`, and `<DB>` with your actual MongoDB credentials and database name. The `JWT_SECRET` should be a secure, unique string.

### Run the application

`npm start` or `sudo node ./bin/www`


Navigate to `http://localhost` (Port 80) to view the app.

