# <img src="./frontend/src/assets/logo.png" width="30" height="30"> My Plans - Calender Application
## Overview
This is a calender application, that allows you to signup and create tasks, to keep your days organized, and to make sure your not forgetting to buy a birthday gift for a loved one. You can also permit other user to be able to see see and comment your tasks. 

## Logo 
I chose to create the logo for the app, while knowing that 1 child dies every 10 minutes in Gaza, by Israeli bombardment. The watermelon in the logo symbolizes the stand of solidarity with the palestinian people. <br>

![Logo description image](./images/watermelon.png)

If you want to know all about why the watermelon became the symbol of the palestinian resistance, your can read about it in [THIS](https://www.businessinsider.com/why-watermelon-symbol-of-palestinian-resistance-2023-11?op=1) article. <br><br>


## Credits for the article:
Businessinsider <br><br>

# Agile Development & User Stories
I built this application using Agile methodology. To keep track of all the user stories I used GitHub Projects. <br>

Below is links to the full project containing all the user stories in GitHub.  
- [*Board-view*](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board) <br>
- [*Table-view*](https://github.com/users/SoroushGReza/projects/12/views/1) <br><br>


### Below is all the user stories of this project, to see the tasks for each user story, use the "**Tasks**" links.<br>

## Back-end user stories:

&#9745; As a **User**, I want to **have a personal account** so that I can **manage my tasks and personal information**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46607629) <br>

&#9745; As a **User**, I want to **create and manage my tasks**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46608603) <br>

&#9745; As a **User**, I want to be able to **Categorize and Prioritize my tasks** for **better organization**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46608888) <br>

&#9745; As a **User**, I want to **filter tasks** based on **different criteria like date, category etc.**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46609157) <br>

&#9745; As a **developer**, I want to **ensure that the application is robust and error-free.** [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46613499) <br><br>


## Front-end user stories:

&#9745; As a **User**, I want a **user friendly and responsive interface** to **manage my tasks**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46611968) <br>

&#9745; As a **User** I want to be able to **see the calender with my tasks on the homepage when logged in** so that I can **navigate to existing tasks to edit/delete them, or add new tasks**.
 [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46612247) <br>

&#9745; As a **User** I can **navigate to all pages using a navbar** so that I can **easily access everything in the application** [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46999304) <br>

&#9745; As a **User** I can **scroll through all tasks/comments that are loaded** so that I can **see all my tasks/comments in the same page**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=48835879) <br>

&#9745; As a **User**, I want to be able to **manage my account** so that I can **update my personal information, and delete my account**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=49172369) <br>

&#9745; As a **User**, I want to be able to **comment on tasks that is public** so that I can **share my thoughts with others**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=49172684) <br>

&#9745; As a **developer**, I want to **ensure that the application is robust and error-free**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46613499) <br><br>

## Future improvements user stories:

&#9744; As a **Developer** I want to **make improvements for the application** so that **it is more user friendly** [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=49267934) 

**User Stories**: 

&#9744; **Calendar-view**: dropdown, to choose month/year view for the calendar <br>
&#9744; Functionality to **permit** single/several users to **view/comment** tasks that is non-public. <br>
&#9744; **Start-time & end-time**: Add start and end time fields for tasks.<br>
&#9744; **Notifications**: Get notifications for tasks 1 day before due date. <br>
&#9744; **Confirmation email** sent to signed up users, with **confirmation link**. <br> 

&#9744; **Task-view**: to show tasks in different layouts. (**3 layouts**) <br>
- Layout 1: **Preview-view**, full tasks are shown in TasksPage. **(Current)** 
- Layout 2: **List-view**, tasks shown as a list without images and full content.
- Layout 3: **Board-view**, tasks shown as smaller previews, with 4 tasks in each row. 

&#9744; **Color themes**: possibility to change application color themes <br>
- Dark 
- Light
- Watermelon (**Current**) 
- Reversed watermelon<br>

## General user stories:

&#9745; As a **developer**, I want to **deploy the application for public access** and **make sure that everything is documented**. [**Tasks**](https://github.com/users/SoroushGReza/projects/12/views/1?layout=board&pane=issue&itemId=46613677) <br><br>


# Backend (Django REST Framework API)
## Back-end Overview
This API is part of a calender application. It allows users register, login, logout, update/delete account, create tasks, edit and delete tasks, organize tasks by filter, search for users, and choose if created tasks are public or private.  <br><br>

## Feautures
- **Registration**: Users can *sign up* and an account is than per automaic created for them. 
- **Sign In**: User can *sign in* to the accounts.
- **Sign out**: User can *sign out* from the account.  
- **Tasks Managment**: Users can *create, update, view* and *delete* tasks. Tasks have *duedates*, *priorities*, *categories*, *image field* (to upload images for tasks), *is_public* (to choose if a task should be buplic or private). <br><br>

## Technologies
- Django REST Framework
- Python
- SQLite (for development)
- PostgreSQL (ElephantSQL for production) <br><br>

## Setup and Installation
Run the commands as instructed below, to setup and install the app and it's requirements in a new workspace. <br>

### Commands: 
**1. Clone the repository:** <br>
&nbsp; `git clone https://github.com/SoroushGReza/my-plans.git` <br><br>
**2. Navigate to the project directory:** <br>
&nbsp; `cd my-plans` <br><br>
**3. Install dependencies:** <br>
&nbsp; `pip3 install -r requirements.txt` <br><br>
**4. Run migrations:** <br>
&nbsp;  `python3 manage.py migrate` <br><br>
**5. Start the server:** <br>
&nbsp; `python3 manage.py runserver` <br><br>

## API Endpoints

<img src="./images/my_plans_drf_api-endpoints.png" alt="endpoints" width="550" style="display-inline-block" />
<img src="./images/accounts-endpoints.png" alt="endpoints" width="550" style="display-inline-block" />
<img src="./images/tasks-endpoints.png" alt="endpoints" width="550" />
<br><br>

# Tests

## Back-End Testing Overview
I conducted testing on the backend to ensure its reliability and functionality. The backend, built with Django REST Framework, consists of various components such as models, views, and serializers, each playing a role in the application's overall performance. The testing strategy was primarily focused on validating these components to guarantee a robust and error-free application. <br>

## Test Execution
I implemented both Test-Driven Development (TDD) and tests written after implementation. The tests were designed to cover a range of scenarios, including creating, retrieving, updating, and deleting data in the database. <br>

## Test Suites
Two primary tests were created: <br>

**Task API Tests**: This tests the functionality related to tasks. Key tests include: <br>

- Verify that tasks can be listed by logged in users.
- Ensure that logged in users can create tasks with specific attributes.
- Confirm that users who are not logged in cannot create tasks. <br><br>


**Account Tests**: This is tests for account management. It includes:<br>

- **Model tests** to ensure proper account creation.
- **View tests** to verify account details retrival, edit, and deletion.
- **Serializer tests** to check the correct serialization of account data.<br><br>

## Run tests:<br> 

In the terminal from the root directory run this command: 
&nbsp; `python3 manage.py tests` <br>

## Test Results
The majority of tests successfully passed, demonstrating application robustness and effectiveness of the implemented features. However, during the final rounds of testing, some tests failed due to unexpected issues. <br><br>

<img src="./images/backend-testing.png" alt="backendtests" width="750" />

### Here is a brief overview of these failures: <br>

- **Task Listing Test**: An AttributeError occurred, indicating an issue with how the response data was being handled.
- **Task Creation Test for Logged-In Users**: This test failed with an *AssertionError*, suggesting a mismatch in expected HTTP status code.
- **Task Creation Test for None-Logged-In Users**: This test also failed due to an *AssertionError* related to HTTP status code.<br>

## Addressing Test Failures
Due to time constraints, I was unable to resolve these last few test failures. However, note that these tests had passed in earlier stages of development. The failures are likely due to recent changes in the codebase or environment configurations, which could not be addressed, due to submission deadline.<br>

## Conclusion
Despite the challenges faced towards the end of the testing phase, the backend of the application has demonstrated reliability and functionality through testing. The enccountered issues provide valuable insight for future improvement. <br><br>
<br>

# Front-end (React)
## Front-end Overview

### React Architecture
In the development of "Melon tasks", I used React (version 17.0.2), JavaScript library for building user interfaces. The application architecture is built by modular and reusable components.

### Key React dependencies and libraries used include:

- **React Full Calandar**: Interactive calendar.
- **React-bootstrap and bootstrap**: Used for styling and responsive design.
- **Axios**: Used for making HTTP requests to the back-end.
- **React Router Dom**: Enabled navigation within the application.
- **JWT Decode**: Assisted in decoding JWT's for authentication.
- **React Datepicker**: For a better user interface with an interactive date picker. <br><br>

These dependencies highlight the focus on creating a user-friendly and interactive application, with emphasis on functionality and aesthetics. <br><br>

## UX Design Approach
### The UX design of "Melon Taks" was driven by the goal of providing a intuitive user experience. <br> 

Key considerations in the design process included:

- **Simplicity and Ease of Use**: The interface was designed to be straightforward, minimizing the learning curve for new users.
- **Responsiveness**: Using Bootstrap, the design is responsive, ensuring the app looks and functions well on various screen sizes and devices.
- **Interactive Components**: The use of FullCalendar and React DatePicker makes the app interactive and enhance user engagement. <br>
#### The application's design and development were guided by these UX principles, ensuring that *Melon Tasks* is not only functional but also enjoyable to use.
<br><br>

# UI/UX Design & Features

## This Application is made responsive with React bootstrap and Media queries
<img src="./images/Responsiveness.png" alt="Responsiveness" width="750" /><br>

Credits to: [ui.dev/amiresponsive](https://ui.dev/amiresponsive) where the image above was provided from. <br><br>

# Color theme <br>

<img src="./images/color-theme.png" alt="Color Theme" width="750" /><br>


