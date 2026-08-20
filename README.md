# Frog Biometric Identification and Management System

## Code

The app can be started using Docker. 

```bash
 docker compose -f docker-compose.dev.yml up
```
It contains containers for the backend, frontend, postgres database and pgadmin. 

### 1 Backend

The backend of the application is structured in directories as follows:

- `CORF3D_ACF` - contains all the machine learning training code from Fabian.
- `crud` - contains the logic behind each endpoint. File names denote the API endpoints subpath (e.g. /frog/... are in *frogs.py*)
- `models`- contains the database models, how the different entities look in the database
- `routers` - contains the endpoints for the API. Files are structured the same way as for `crud`
- `schemas` - contains the schemas that reference the same database entities, but for API requests and responses
- `util` - contains different utility methods used throught the backend, from permission access to authentication logic

### 2 Frontend

The frontend of the application is structured in directories as follows:

- `components` - contains smaller React components (e.g. confirmation boxes, modals) and layout components (e.g. website header, left sidebar)
- `hooks` - contains custom made hooks, mostly for fetching data
- `pages` - contains all React components that represent pages in the app, each in their own subdirectory
- `services` - contains code for interacting with the API and the custom made providers
- `util` - contains utility functions used throught the frontend (e.g. icons library, input validation)

## Good to know

### **Updating the application** 
I am mostly doing this step manually. I have tried using GitHub actions, but building the docker images took very long, so I decided to avoid using it.

#### Instructions
1. Log In into Harbor registry through the terminal. If you are already logged in, you can skip this step.

2. Tag the image backend/frontend image with the tag *latest*.
```bash
docker tag frogtastic-backend registry.webhosting.rug.nl/kamenzlab/frogrepo-backend:latest
```

3. Push the image to the Harbor registry. If it succeded, you should be able to see the images [here](https://registry.webhosting.rug.nl/). 
```bash
docker push registry.webhosting.rug.nl/kamenzlab/frogrepo-backend:latest
```

4. After this, the deployments for the frontend and backend **should** pull the new images after a while. If you are inpatient (like me), you can go to the [Rancher dashboard](https://prod.k8s.rug.nl/dashboard/), and redeploy them both and ensure that the changes you made have made it and they do not break the app :)

### **Modifying the database**
You can access the database itself and change stuff directly there through PgAdmin. You can find the connection details in the [Rancher dashboard](https://prod.k8s.rug.nl/dashboard/), in the Secrets menu. NOT RECOMMENDED THO... With a lot of power comes a lot of responsibility.

## Can be improved/added

### **Testing** 
The *origin/testing* branch has a few tests for the backend. I have not finished writing tests for all endpoints. I have not wrote any tests for the frontend.

### **Resource access control system**
The current system is a bit too fine-grained. I believe a better way to approach this would be to have viewer/editor/admin roles per organization, as it would ease the access verification upon requests.

### **Multi-thread backend**
Allow the backend to process multiple requests simultaneously as currently I believe there is just one main thread that executes everything, so for multiple users using the app at the same time, might increase request processing times.

### **Pretty much anything else**
This is the first web application that I have made at this level of complexity and I am sure that anywhere you look, you can see something that can be improved. Sometimes, while working on adding a new feature, I would be somewhat hindered by the previous implementation and need to work around it or completely rebuild a part of the app, and most of the time it was the first one. So, if you, the reader, have the necessary knowledge and time to work on making this better, be my guest. I believe in you!


## Contact
For any questions you can contact me at tonieserban@yahoo.ro