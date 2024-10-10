require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, '..', 'public')));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB 연결 성공'))
    .catch(err => console.log('MongoDB 연결 오류:', err));

const userSchema = new mongoose.Schema({
    accesskey: String,
    username: String,
    password: String,
    phone: String
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
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

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id;
            res.json({ status: 'success', message: '로그인 성공!' });
        } else {
            res.status(400).json({ status: 'fail', message: '잘못된 아이디 또는 비밀번호' });
        }
    } catch (err) {
        res.status(400).json({ status: 'error', message: '로그인 중 오류 발생: ' + err });
    }
});

const validKeys = process.env.ACCESS_KEYS.split(/[\n,]+/).map(key => key.trim());

app.post('/verify-access-key', (req, res) => {
    const providedKey = req.body.accesskey;

    if (validKeys.includes(providedKey)) {
        res.json({ success: true, message: '인증 완료' });
    } else {
        res.status(400).json({ success: false, message: '일치하지 않습니다!' });
    }
});

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

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 작동 중입니다.`);
});
