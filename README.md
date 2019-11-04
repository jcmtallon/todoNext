# todoNext - productivity app
My first attempt to create a responsive single page application.
The tailor-made to do list app that I always wanted.

## Table of contents
* [App link](#app-link)
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [To do list](#to-do-list)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

# App link
https://todonext.herokuapp.com

## General info
todoNext allows you not only to register and manage your personal tasks in varied and simple ways, but it also provides you with all sort of tools so you can enrich such items by assigning them to different categories or projects, registering their progress, priority, adding notes to them, or even transforming them into habits so those tasks are automatically registered every certain period of time.
<kbd>
  <img src="https://github.com/trueStoryJapan/todoNext/img/todoNext_screenshot_01.gif" alt="Sample image 01" title="todoNext sample image 01" width="650" border="1" />
</kbd>


Do you rather having your tasks organized in a calendar view instead? todoNext provides also a calendar view so you can easily distribute your assignments in a more intuitive and seamless way.
<kbd>
  <img src="https://github.com/trueStoryJapan/todoNext/img/todoNext_screenshot_02.gif" alt="Sample image 02" title="todoNext sample image 02" width="650" border="1" />
</kbd>

Curious about your general progress? From the stats panel users will be able to see not only how much effort they have dedicated every day, week or month to complete their tasks, but they also will be able to filter the results in different fashions to have a even better insight of their work.
<kbd>
  <img src="https://github.com/trueStoryJapan/todoNext/img/todoNext_screenshot_03.gif" alt="Sample image 03" title="todoNext sample image 03" width="650" border="1" />
</kbd>


## Technologies
* Node.js - version 10.13
* Express - version 4.16
* Mongoose - version 5.3.11
* Passport - version 0.4.0
* socket.io - version 2.3.0
* Moment.js - version 2.23.0
* d3.js - version 5.12
* slip.js - version 2.1.1


## Setup

### Getting Started
- Run npm install to install all dependencies.
- Open a terminal window and run `npm run watch` for watching any changes in the repository.
- Open a second terminal and run `nodemon` to start the application. The front end will be available at http://localhost:8000.
- Open a third terminal and run `npm run css` to watch any changes in the scss and compile the  front end's main css file automatically each time.

These 3 scrips together will automatically compile all changes in the code and restart the node application in localhost:8000.


### Setting the development mode
To avoid using the database production collections while implementing new features, and for a more convenient testing and debugging, apply the following changes to the code.
- In `webpack.config.js` change the mode from `production` to `development`. (Line 3)
- In `appConfig/appConfig.js` mark `production` as false; (Line 7)

Note: I am positive there must be more elegant way to switch between both modes and it is a pending task to implement that sometime soon.


## To do list
* Implementing 'To remember' page. A very simple list where the user can register motivational advices, things to improve, quotes that the application will randomly display during the different user
sessions to keep the user motivated to continue their good work.
* Implementing 'Learnt' page. Another simple list view that will filter all the tasks and projects that were marked as Learnt projects. A simple feature to focus on those tasks that supposed an improvement to our skills or our knowledge about a specific matter. Just another idea to keep the user motivated to continue using the application.
* Implement 'lists' page. A space where the user can create simple lists to keep track of all sort of things like movies to watch, ideas they had, games to play, etc.
* Increasing the different Chrome Devtools audit scores to make the tool more accessible and performant.
* Other ideas to come.

## Status
Project is: _in progress_.
This has been and will continue being mostly a project for learning and practicing new things about programming. I started this application some months ago knowing literally nothing about how to create web apps and even though I tried to correct and refactor the code as much as possible during the process, I am confident the application must be packed with plenty of critical mistakes and horrendous decisions that definitely will need a brush up one day if I plan to share this app with the world. Therefore, any contribution to improve the code, make things more readable, solve vulnerabilities, etc. will be more than welcomed.

## Inspiration
Front-end design partially inspired by https://todoist.com/.

## Contact
Created by [@trueStoryJapan]
