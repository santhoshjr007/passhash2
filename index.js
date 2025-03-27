const express = require('express');
const { resolve } = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
const port = 3010;

require('dotenv').config(); 

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.log(err));
const UserSchema=new mongoose.Schema({
  username:{type:String,required:true},
  password:{type:String,required:true}
})
const User=mongoose.model('User',UserSchema);

app.post('/login',async(req,res)=>{
  const {username,password}=req.body;
  if (!username||!password){
    return(res.status(400).json({message:'Invalid input'}));
  }
  try{
    const user=await User.findOne({username});
    if(!user){
      return(res.status(400).json({message:'Invalid username or password'}));
    }
    const ismatch=await bcrypt.compare(password,user.password)
      if(!ismatch){
        return(res.status(400).json({message:"Invalid credentials"}));

      }
      res.status(200).json({message:"Login Succerssful"});
  }catch (err){
    res.status(500).json({message:"Internal server error"});
  }
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
