//1. 저장할 데이터 목록 : id, name, description, manager, (password), status, createdAt, updatedAt
//2.유저에게 받을 것 : name, description, manager, password 모두 스트링 & 필수, req.body로 전달 받는다
//2.받아도 되고 안받으면 기본값으로 둘 데이터 :status  /  유저에게 받지 않을 데이터 id, createdAt, updatedAt 


//1. 몽구스 가져오기
import mongoose from "mongoose";
//2. 스키마 작성
const goodsSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["FOR_SALE", "SOLD_OUT"],
    default: 'FOR_SALE',
    //enum사용 ; 저 중에서만 사용가능 - 피드백
  },
  password: {
    type: String,
    required: true, 
  },
  //패스워드 - 피드백
},
  {
    timestamps: true, // createdAt 및 updatedAt 자동 생성 - 피드백
  },
  );
  // createdAt: {
  //   type: Date,
  //   required: true,
  //   },
  //   //생성일시 기준으로 내림차순
  // updatedAt: {
  //   type: Date,
  //   default: new Date, - 기존작성 수식
    
    //미들웨어에서 수정되는 현재시간으로 바꿀 수 있는지
    //예시, schema.pre('save', function(next) {
    //     this.updatedAt = Date.now();
    //     next();
    //   });
      
  //}
  //패스워드도?

//3. 스키마 통해 모델 구현 몽구스의 모델을 통해서 구현할 수 있다.('모델이름'),어떤 스키마로 모델구현할건지;위에 지정한 스키마참고
//: 안되면 product_Schema 수정해볼것
export default mongoose.model('Goods', goodsSchema);
//4. 모델 외부로 보내기 :3번앞에 export default
