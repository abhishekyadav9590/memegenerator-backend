const db_url="mongodb://localhost:27017/meme-generator";
const mongoose=require("mongoose");

mongoose.connect(db_url,{
    useNewUrlParser:true,
    useUnifiedTopology: true
});
let db=mongoose.connection;

const connect=()=>{
    db.on('error', ()=>console.log('connection error:'));
    db.once('open',()=>console.log('connected'));
}

mongoose.set('debug',true);
module.exports={connect};