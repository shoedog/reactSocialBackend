process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../app/user/userModel');
const chai = require('chai');
const server = require('../index');
const should = chai.should();

chai.use(require('chai-http'));

const TEST_URI = 'http://localhost:5000';

// upon successful login
var TOKEN = '';
var USER_ID = '';

describe('Users', () => {
  before((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

  /**
   * Test GET request
   * @list
   *
   */
  describe('/GET user', () => {
      it('it should GET all the users', (done) => {
        chai.request(TEST_URI)
        .get('/user')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
      });
  });


  /**
   * Test POST request
   * @create
   *
   */
  describe('/POST user', () => {
     it('it should create a user and persist in the db', (done) => {
       const test_user = {
         username: "testUser1",
         password: "testpassword1"
       }
       chai.request(TEST_URI)
       .post('/user')
       .send(test_user)
       .end((err, res) => {
         res.should.have.status(201); // 201 == created
         res.body.should.be.a('object');
         console.log(res.body);
         res.body.should.have.property('user');
         res.body.should.have.property('token');
         done();
       });
     });
  });

  /**
   * Test GET request
   * @list again
   *
   */
  describe('/GET user', () => {
    it('it should GET all the users', (done) => {
      chai.request(TEST_URI)
      .get('/user')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
    });
  });


  /**
  * Test POST request
  * @login
  *
  */
  describe('/POST user/login', () => {
    it('it should LOGIN the user and get a token', (done) => {
      chai.request(TEST_URI)
        .post('/user/login')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send('username=testuser1&password=testpassword1')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          if (res.body.token) {
          TOKEN = res.body.token;
          }
          done();
        });
    });
  });


  /**
  * Test GET request for specific user
  * @read (authenticated)
  *
  */
  describe('/GET user/{username?}', () => {
    it('it should GET a specific user', (done) => {
      chai.request(TEST_URI)
        .get('/user/testuser1')
        .set('Authorization', 'Bearer ' + TOKEN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('_id');
          if (res.body._id) {
            USER_ID = res.body._id;
          }
          res.body.should.have.property('username');
          res.body.should.have.property('password');
          done();
        });
    });
  });

  /**
   * Test PUT request
   * @udpate (authenticated)
   *
   */
  describe('/PUT user/{id?}', () => {
      it('it should UPDATE a users email', (done) => {
        chai.request(TEST_URI)
        .put('/user/' + USER_ID)
        .set('Authorization', 'Bearer ' + TOKEN)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send('email=user1@gmail.com')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('email');
          res.body.email.should.be.eql('user1@gmail.com');
          done();
        });
      });
  });

  /**
   * Test DELETE request
   * @destroy (authenticated)
   *
   */
  describe('/DELETE user', () => {
    it('it should DELETE a specific user', (done) => {
      chai.request(TEST_URI)
      .delete('/user/' + USER_ID)
      .set('Authorization', 'Bearer ' + TOKEN)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body);
        done();
      });
    });
  });


}); // end of parent block
