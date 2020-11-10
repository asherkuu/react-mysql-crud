/*
    server folder의 index.js 는 server config 역할을 한다.
    실행은 terminal > node index.js 로 실행하고
    index.js 파일 수정 후에는 재시작을 해주어야 정상 실행된다.

    실행시 terminal > nodemon index.js 로 실행하게되면 
    index.js 파일 수정 후 저장시에 재로딩이 되서 다시 실행할 필요가 없게된다.
*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// mysql 연동
const mysql = require("mysql");

// mysql 연결을 위한 정보
const db = mysql.createPool({
    host: "localhost",
    port: "3307",
    user: "root",
    password: "!!mysql1234",
    database: "CRUDDataBase",
});

// node index.js로 실행후 '/' 라는 url 로 호출하였을 경우 res.send() 를 통해 데이터를 넘겨주어라 라는 뜻
// req 는 require을 의미하고 res 는 response를 의미한다.
/* 
app.get('/', (req, res) => {

    실행시 insrt 문이 실행됨
    const sqlInsert = "INSERT INTO movie_reviews (movieName, movieReview) VALUES ('inception', 'good movie')";

    db.query(sqlInsert, (err, result) => {
        res.send(err);
    });
    
});
*/

app.use(cors());
app.use(express.json());
// post 데이터 처리시 bodyParser를 통해서 인코딩을 해주어야 한다.
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
    const sqlSelect = "SELECT * FROM movie_reviews";

    db.query(sqlSelect, (err, result) => {
        // 받아온 데이터보내주기 result 는 select되어진 mysql의 데이털르 json 형태로 반환한다.
        res.send(result);
    });
});
app.post("/api/insert", (req, res) => {
    // front 에서 넘겨준 데이터를 받아올때 require와 body를 이용하여 동일한 변수명(state keyName)으로 받아온다.
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;
    console.log(movieName, movieReview);
    const sqlInsert = "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?, ?)";

    db.query(sqlInsert, [movieName, movieReview], (err, result) => {
        console.log(result);
    });
});

app.delete("/api/delete/:movieName", (req, res) => {
    const name = req.params.movieName;

    const sqlDelete = "DELETE FROM movie_reviews WHERE movieName = ?";

    db.query(sqlDelete, name, (err, result) => {
        if (err) {
            console.log(err);
        }
    });
});

app.put("/api/update", (req, res) => {
    const name = req.body.movieName;
    const review = req.body.movieReview;

    const sqlUpdate = "UPDATE movie_reviews SET movieReview = ? WHERE movieName = ?";

    db.query(sqlUpdate, [review, name], (err, result) => {
        if (err) {
            console.log(err);
        }
    });
});

// terminal : node index.js  실행하면 3001 port로 실행됨
app.listen(3001, () => {
    console.log("server/index.js : running on port 3001");
});
