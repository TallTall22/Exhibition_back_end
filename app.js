if(process.env.NODE_ENV!=='production'){
  require('dotenv').config()
}
const path=require('path')
const express = require('express')
const session=require('express-session')
const usePassport=require('./config/passport')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3001

app.use('/upload',express.static(path.join(__dirname,'upload')))

// use body-parser
app.use(express.urlencoded({extended:true}))

//use json
app.use(express.json({limit:'10mb'}))

//express-session
app.use(session({secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:true}))
//use passport
usePassport(app)

//CORS
app.use((req, res, next) => {
  // 設置允許跨域的源，可以使用 '*' 允許所有源，或指定特定的源
  res.header('Access-Control-Allow-Origin', '*');

  // 設置允許的HTTP方法
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');

  // 設置允許的HTTP頭
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 在處理實際請求之前，響應預檢請求（OPTIONS）
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// routes
app.use('/api',routes)

app.listen(port, () => {
  console.info(`App is listening on port${port}`)
})