import express from "express";

//익스프레스의 라우터 생성 1-15 5:55
const routers = express.Router();

//1. 상품생성 api. mongoose, 
import mongoose from "mongoose";
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

//연습1저장 맞는지 조회후 확인할 것
const allGoods = [];
allGoods.push(createdGoods); 

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
  // const createdAt = createdGoods.createdAt;
  const findAll = await Goods.find().sort('-createdAt').exec();
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
  const {id} = req.params;
  //조회는 id로
  const { name, description, manager, password } = req.body;
  const order = [name, description, manager, password];
  //바꾸고 싶은 항목은 order 

  //현재 나의 order가 무엇인지 알아야함
 const currentId = await Goods.findById(id).exec();
if(!currentId) {
  return res.status(404).json ({
    errorMessage: '상품 id가 존재하지 않습니다.'
  });
}
 if(order){
  const findOrder = await Goods.find({order}).exec();
  if(findOrder) {
    findOrder.order = currentId.order;
    await findOrder.save();
  }
  currentId.order = order;
 }
 await currentId.save();
 return res.status(200).json({message: '상품 수정에 성공했습니다.'});
});

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