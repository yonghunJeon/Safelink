require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');  // path 모듈 추가
const app = express();
const port = process.env.PORT || 3000;

// Body Parser 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 세션 설정
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS를 사용할 때만 true로 설정
}));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));  // public 폴더를 정적 경로로 설정

// MongoDB 연결 설정
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB 연결 성공'))
    .catch(err => console.log('MongoDB 연결 오류:', err));

// 사용자 스키마 및 모델 설정
const userSchema = new mongoose.Schema({
    //site: String,        // 관리 현장
    accesskey: String,   // 발급 키
    username: String,    // 아이디
    password: String,    // 비밀번호
    phone: String        // 전화번호
});

const User = mongoose.model('User', userSchema);

// 회원가입 라우트
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 비밀번호 해시화 디코드 불가
        const newUser = new User({
            //site: req.body.site,
            accesskey: req.body.accesskey,
            username: req.body.username,
            password: hashedPassword,
            phone: req.body.phone
        });

        await newUser.save();
        res.send('회원가입 성공!');
    } catch (err) {
        res.status(400).send('회원가입 실패: ' + err);
    }
});

// 로그인 라우트
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id;
            // 로그인 성공 시 JSON 형식으로 응답
            res.json({ status: 'success', message: '로그인 성공!' });
        } else {
            // 로그인 실패 시 JSON 형식으로 응답
            res.status(400).json({ status: 'fail', message: '잘못된 아이디 또는 비밀번호' });
        }
    } catch (err) {
        // 오류 발생 시 JSON 형식으로 응답
        res.status(400).json({ status: 'error', message: '로그인 중 오류 발생: ' + err });
    }
});

// 여러 줄로 된 ACCESS_KEYS를 배열로 변환
const validKeys = process.env.ACCESS_KEYS.split(/[\n,]+/).map(key => key.trim());
//console.log('Valid keys:', validKeys);

// 현장 인증 키 확인 라우트
app.post('/verify-access-key', (req, res) => {
    const providedKey = req.body.accesskey;
    //console.log('Received access key verification request:', req.body);
    //console.log('Valid keys:', validKeys);

    if (validKeys.includes(providedKey)) {
        //console.log('Access key matches');
        res.json({ success: true, message: '인증 완료' });
    } else {
        //console.log('Access key does not match');
        res.status(400).json({ success: false, message: '일치하지 않습니다!' });
    }
});

// 아이디 중복 확인 라우트
app.post('/check-username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            res.json({ exists: true, message: '이미 사용 중인 아이디입니다.' });
        } else {
            res.json({ exists: false, message: '사용 가능한 아이디입니다.' });
        }
    } catch (err) {
        res.status(500).json({ exists: false, message: '아이디 확인 중 오류가 발생했습니다.' });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 작동 중입니다.`);
});
