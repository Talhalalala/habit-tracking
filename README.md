# LAP 2 Portfolio Project: Habit Tracker

A project to create an app to track daily habits. A user creates an account and can then add any
habits they want to track and how much they want to do each day. They can see the habits that they
are currently tracking, add information about activities completed that day, see their most recent
completion streak, and delete a habit if they no longer want to track it. They can also see the days
in the past that they have tracked a particular habit.

View the finished site [here](https://tusmcbhtct-habit-tracker.netlify.app/).

## Installation & Usage

### Installation

- Clone or download the repository

### Usage

`bash _scripts/startDev.sh`

- starts api & database services
- runs database migrations
- seeds database for development
- serves api on localhost:3000

`bash _scripts/stop.sh`

- stop all running services
- keeps any updates to the database

`bash _scripts/teardown.sh`

- stop all running services
- removes containers
- removes volumes

To view the client side, open `index.html` in the browser.

## Technologies

- HTML/CSS for client side
- JavaScript for client/server side
- Jest for testing
- Docker
- Website deployment: Heroku/ Netlify
- Database: PostgreSQL

## Wins & Challenges

### Wins

- All requirements in the brief were met.
- Users can login and choose a habit they want to track.
- Users can update their progress towards the goal for a particular habit.
- Additional feature: Implemented a feature to show history of habits.

### Challenges

- Some tests for the front end weren't initially being recognised by jest.
- Deleting habits and adding new data to the habit for today caused some problems linking the fetch
  request to the server and then to the database.

## Contributors

- Emily Kral
- Jasmine Raja
- Talha Sadak
- Rahib Rahman
