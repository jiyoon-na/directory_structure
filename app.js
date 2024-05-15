// 실제 실행할 프로그램

import express from 'express';
import productsRouter from './src/routers/productsRouter.js';
import connect from './src/schemas/index.js';

const app = express();
const PORT = 3000;

connect(); //몽고디비연결하는 커넥트

//상품등록.json형태로 서버에 body 데이터를 전달하면, req.body에 데이터 변환하여 넣어준다. api 클라이언트 통해서 테스트시 필요,미들웨어
app.use(express.json());
//상품등록.form content type에서 body데이터를 전달하면 req.body에 데이터변환하여 넣어준다. 프론트엔드와 협업시 필요, 미들웨어
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//products 라우터 실행 ; api주소로 들어오면 프로덕트라우터 조회해라
app.use('/api', [productsRouter]);

//products에서의 '/', '/about' : 아래의 app.listen 으로 서버 열고, app.use에'/api' 경로로 []요청들어옴
//가장먼저 '/api'로 들어온 요청은 []로 전달
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});