cs419-backend
---

Usage
---

Start the server with this command:

```
node index.js
```

Docker
---

To build from the docker image, run this shell script:

```
$ ./dockerTask.sh build release
```

Once it has finished building, run this command line to launch:

```
docker run -p 5000:5000 moonwalk:latest
```

The app will be running at 0.0.0.0:5000

Use

```
docker stop <container id>
```

to stop the app/container. You will also want to delete the container before you build it again. This can be done by:

```
docker rm <container id>
```

use docker ps to see all running docker containers, and docker ps -a to see all
containers that have been exited but not destroyed.


Structure
---

This is strictly an API, so no front end. Use Postman or other to test the endpoints.

This follows the RESTful API paradigm, complete with GET, POST, PUT, DELETE commands.


Create a user by sending a POST request containing a username and password to /user.
You will get back BOTH a token and a user object (password stripped out for security).


see app/user/userRoutes to see all methods and routes available.


Testing
---

Run

```
npm test
```
