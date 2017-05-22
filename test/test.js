//var assert = require('assert');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
var chaiHttp = require('chai-http');

var url = 'https://devapi.micloud.info'
chai.use(chaiHttp);
chai.request(url)
  .post('/')


describe('Login', function() {
  describe('Invalid Credentials', function() {
    it('should return invalid credentials with bad password', function(done) {
      chai.request('https://devapi.micloud.info')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          'username': 'Test-Agent-Circle',
          'password': 'Wrong_Password'
        })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          //as its treated likestring at this stage we can assert on it like string
          expect(res.text).to.have.equal('{"boxType":"error","loggedin":0,"message":"Bad username/password"}')
          done(); // <= Call done to signal callback end
        });
    });

    it('should return invalid credentials with bad username`', function(done) {
      chai.request('https://devapi.micloud.info')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          'username': 'Wrong_Username',
          'password': 'Test-Agent-Circle'
        })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.text).to.have.equal('{"boxType":"error","loggedin":0,"message":"Bad username/password"}')
          done(); // <= Call done to signal callback end
        });
    });
  })
  
  it('should login and get cookie', function(done) {
    chai.request('https://devapi.micloud.info')
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        'username': 'Test-Agent-Circle',
        'password': 'Test-Agent-Circle'
      })
      .end(function(err, res) {
        res.text = JSON.parse(res.text)
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('sessionId')
        expect(res.text).to.have.deep.property('firstName', 'Test-Agent-Circle')
        expect(res.text).to.have.deep.property('lastName', 'Test-Agent-Circle')
        expect(res.text).to.have.deep.property('organisation', 'Test-Agent-Circle')
        expect(res.text).to.have.deep.property('loggedin', 1)
        
        var sessionToken=/.+?(?=;)/.exec(res.header["set-cookie"])
        console.log(sessionToken);
        done(); // <= Call done to signal callback end
      });
  });
});