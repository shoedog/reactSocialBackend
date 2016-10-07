cs419-backend
---

Usage
---

Start the server with this command:

```
node index.js
```

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
