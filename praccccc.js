// import express from "express";

// //익스프레스의 라우터 생성 1-15 5:55
// const routers = express.Router();

// //1. 상품생성 api. mongoose, 
// import mongoose from "mongoose";
// import Goods from '../schemas/product_Schema.js';
// //스키마에서 지정한 굿즈 (../schemas/product_Schema.js 파일에 있음)

// //2. api 구현 틀리면 productsRouter 확인해볼것
// routers.post('/productsRouter', async(req, res) => {
// //3. 클라이언트로 부터 전달받은 데이터 가져온다. :name, description, manager, password
// const { name, description, manager, password, status } = req.body;

// // const updatedAt = new Date()
// //4. 상품명이 중복되지 않았는지 검사하고, 중복된다면 에러메세지 전달
// //find는 전체를 조회하므로 찾을 때 배열로 조회// 
// const findName = await Goods.find({name: name}).exec();
// if(findName.length) {
//   return res.status(400).json({errorMessage:'이미 등록 된 상품입니다.'});
// }
// // const todoMaxOrder = await Todo.findOne().sort('-order')
// //todo 컬렉션에서. 하나 찾을것. 내림차순으로******* 이따 할것
// //5. 상품(goods)생성
// //생성된 상품 정보를 클라이언트에게 응답반환
// const createdGoods = await Goods.create({
//   // id: "5", 
//   name: name,
//   description: description,
//   manager: manager,
//   password: password,
//   status: status,
//   updatedAt: new Date,
// });
// //연습.저장 Goods.push(createdGoods);    Goods 맞는지 확인.. 아닐수있음 
// //연습.

// return res.status(201).json({
//   //키: 메세지 , 벨류:상품생성에 성공했습니다
//   message : '상품 생성에 성공했습니다.',
//   data: createdGoods,
// });
// });

// //routers/products.router.js
// export default routers;
