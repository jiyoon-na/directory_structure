import express from "express";

//익스프레스의 라우터 생성 1-15 5:55
const routers = express.Router();

//1. 상품생성 api. mongoose, 
// import mongoose from "mongoose"; - 피드백 사용안하는 것
import Goods from '../schemas/product_Schema.js';
//스키마에서 지정한 굿즈 (../schemas/product_Schema.js 파일에 있음)

//2. api 구현 틀리면 productsRouter 확인해볼것
routers.post('/productsRouter', async(req, res, next) => {
//3. 클라이언트로 부터 전달받은 데이터 가져온다. :name, description, manager, password
const { name, description, manager, password, status } = req.body;

//연습2 name, description, manager, password 정보 다 안넣고 입력시 에러뜨게
const requiredFields = [name, description, manager, password];
if(!requiredFields.every(Boolean)){
  return res.status(400).json({errorMessage:'상품 정보를 모두 입력해 주세요.'});
}

//4. 상품명이 중복되지 않았는지 검사하고, 중복된다면 에러메세지 전달
//find는 전체를 조회하므로 찾을 때 배열로 조회// 
const findName = await Goods.find({name: name}).exec();
if(findName.length) {
  return res.status(400).json({errorMessage:'이미 등록 된 상품입니다.'});
}
// const todoMaxOrder = await Todo.findOne().sort('-order')
//todo 컬렉션에서. 하나 찾을것. 내림차순으로******* 이따 할것
//5. 상품(goods)생성
//생성된 상품 정보를 클라이언트에게 응답반환
const createdGoods = await Goods.create({
  // id: "6", 
  name: name,
  description: description,
  manager: manager,
  password: password,
  status: status,
  createdAt: new Date,
});

//연습1저장 맞는지 조회후 확인할 것 - 피드백 : 사용안하는것
// const allGoods = [];
// allGoods.push(createdGoods); 

// const GoodsSave = new GoodsSave(data);
// await Goods.save();

return res.status(201).json({
  //키: 메세지 , 벨류:상품생성에 성공했습니다
  message : '상품 생성에 성공했습니다.',
  data: createdGoods,
});
});

//연습3. 상품목록조회 api
routers.get('/productsRouter', async(req, res, next) => {
  //연습3. 1 목록조회 진행 ; 내림차순으로
  // 피드백 - select 로 패스워드 숨길 수 있음
  const findAll = await Goods.find().sort('-createdAt').select("-password").exec();
  //연습3. 2 클라이언트에게 반환
  return res.status(200).json({
    message : "상품 목록 조회에 성공했습니다.",
    data: findAll});
});

//상품상세조회 localhost:3000/api/productsRouter/:id

// 문제 상황. 잘못된 값이 들어가면 404가 아닌 500으로 찐 오류가 뜸
routers.get('/productsRouter/:id', async(req, res, next) => {
//1.상품 아이디 조회
try {
  const id = req.params.id;
  const findId = await Goods.findById(id);
  //2. 상품 아이디와 일치하는 데이터 찾기
  if (!findId) {
  return res.status(404).json({message: '상품을 찾을 수 없습니다.'});
}
return res.status(200).json({
  message: '상품 상세조회에 성공했습니다.',
  data : findId,
});
} catch (err) {
  next(err);
  //해결할것ㅎ잘못된 값이 들어가면 404가 아닌 500으로 찐 오류가 뜸
}
});

//해야할일 수정: 일단순서변경강의 내용착안;:id경로매개변수에서 가져오므로 params 사용
routers.patch('/productsRouter/:id', async(req, res, next) => {
//path params 에서 아이디 가져오기
  const {id} = req.params;
//바디에서 수정할 정보를 가져옴.
  const { name, description, manager, password, status } = req.body;

  //id로 조회한 상품 찾기 (조회시 안나왔을 경우 메세지); 
  //goods에서 id로 찾은 상품;안에 내용이 있는 ; 위에 import 로 나와있음
  const good = await Goods.findById(id, { password: true }).exec();
  //튜터님강의- 비밀번호 확인
  const passWordMatched = password === good.password;
  //패스워드 포함하여 조회하기 
  //goods에서 id로 상품을 못찾는다면
  if(!good) {
    return res.status(404).json ({
      errorMessage: '상품 id가 존재하지 않습니다.'
    });
  }
  //비밀번호가 다르다면
  if(!passWordMatched) {
    return res.status(401).json({
      status: 401,
      message: '비밀번호가 일치하지 않습니다',
    });
  }
  // 튜터님 강의 스프레드 오퍼레이터 ...(name && {name}) 에서 name 이 있으면 {name} 반환;실행
  // 실행되면 ...({name})이런 형태로 남음. 무의미한 ()없애주고 {객체}가 ... 스프레더 오퍼레이터 만나면
  // {중괄호} 풀림
  const productInfo = {
    ...(name && {name}),
    ...(description && {description}), 
    ...(manager && {manager}),
    ...(status && {status}),
  };
const data = await Goods.findByIdAndUpdate(id, productInfo);
  //상품 항목중 바꾸고 싶은 항목 할당 : 위에 클라이언트가 요청한 const {} =req.body
  //{}내용 => name 이렇게 간단히 쓸 수 있게 수식이 되어있는 것
  //즉 여기서의 Name은 고객이 보낸 이름 => 상품의 이름은 고객이 보낸(req)한 이름이다 로 해설하면 될듯
  //if 문이 없고 good.name=name; 이렇게 식이 다 되어 있다면 5항목 모두 있어야 수정가능. if 문있어서 하나씩 따로 수정 가능
  // if(name) {
  //   good.name = name;
  // }
  // if(description) {
  //   good.description = description;
  // }
  // if(manager){
  //   good.manager = manager;
  // }
  // ///패스워드 동일한지 체크, 동일하면 수정가능 -> 수정 후 저장
  // //다음에 구현 해볼것..
  // if(password){
  //   good.password === password;
  // } 
  // if(status){
  //   good.status = status;
  // }

// 수정 후 데이터저장 얘는 어뜨케 해야하ㅏ지?
  // await good.save();
  //응답
 return res.status(200).json({
  status: 200,
  message: '상품 수정에 성공했습니다.',
  data
});
}
);

// 삭제//
routers.delete('/productsRouter/:id', async(req, res, next) => {
  const {id} = req.params;
  const product = await Goods.findById(id).exec();
  if(!product) {
    return res.status(404).json({
      errorMessage : '상품을 찾을 수 없습니다.'
    });
  }
  await product.deleteOne();
  return res.status(200).json({
    Message : '상품삭제에 성공했습니다',
    data : product
    // data : findById
  });
})

export default routers;
//////수정시작4////