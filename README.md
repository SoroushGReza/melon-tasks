
# My Plans - Calender Application

## Backend (Django REST Framework API)
## Overview
This API is part of a calender application. It allows users register, login, logout, update/delete account, create tasks, organize tasks by filter, search for users, give other users permission to read and comment tasks. 

## Feautures
- **Accounts Managment**: Users can *register*, and manage their accounts.
- **Tasks Managment**: Users can *create, update, view* and *delete* tasks. Tasks have *duedates*, *priorities*, *categories*, for better organisation. <br>

## Technologies
- Django REST Framework
- Python
- SQLite (for development)
- PostgreSQL (ElephantSQL for production)

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

# REMEMBER TO COMPRESS IMAGES LATER

## Tests

### TDD Tests





