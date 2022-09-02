const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const mariadb = require("mysql");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const con = mariadb.createConnection({
  host: "credot-rds.cccnip9rb8nn.ap-northeast-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "sandburg123",
  database: "credotClient",
});

con.connect(function (err) {
  if (err) throw err;
});

app.use(
  session({
    secret: "sandburg",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      // 로그인 성공
      console.log("req.user : " + JSON.stringify(user));
      var json = JSON.parse(JSON.stringify(user));

      // customCallback 사용시 req.logIn()메서드 필수
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        console.log(user);
        return res.send(json);
      });
    } else {
      // 로그인 실패
      console.log("/login fail!!!");
      res.send(false);
    }
  })(req, res, next);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pw",
    },
    function (username, password, done) {
      var sql = "SELECT * FROM client WHERE email=? AND pw=?";
      con.query(sql, [username, password], function (err, result) {
        if (err) console.log("mysql 에러");
        // 입력받은 email과 비밀번호에 일치하는 회원정보가 없는 경우
        if (result.length === 0) {
          console.log("결과 없음");
          return done(null, false, { message: "Incorrect" });
        } else {
          console.log(result);
          var json = JSON.stringify(result[0]);
          var userinfo = JSON.parse(json);
          console.log("test");
          console.log("userinfo " + userinfo);
          return done(null, userinfo); // result값으로 받아진 회원정보를 return해줌
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.email);
  console.log("시리얼라이즈");
});

passport.deserializeUser(function (email, done) {
  console.log("ddddd");
  var user;
  var sql = "SELECT * FROM client WHERE email=?";
  con.query(sql, [email], function (err, result) {
    if (err) console.log("mysql 에러");

    console.log("deserializeUser mysql result : ", result);
    var json = JSON.stringify(result[0]);
    user = JSON.parse(json);
    done(null, user);
  });
});

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/user", function (req, res) {
  console.log("userrouteron");
  console.log(req.user);
  res.send(req.user);
});

app.listen(8080, function () {
  console.log("listening on 8080");
});
