var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var fs = require('fs');
var https = require("https")
var mysql = require("mysql2")
const discordapp = require("discord-oauth2")
const oauth = new discordapp()
const cookieParser = require("cookie-parser")
const crypto = require("crypto");
const Cors = require("cors")

var options = {
  key: fs.readFileSync(''),
  cert: fs.readFileSync(''),
}


const db_dcalendar_setting ={
  host: '',
  user: '',
  password: '',
  database: ''
}

const conn = mysql.createConnection(db_dcalendar_setting)

conn.connect(err => {
  if(err != null) console.log(err)
  else console.log("db connected!")
})

const DISCORD_OAUTH2_DATA = {
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  REDIRECT_URL: ``,
  TOKEN_URL: ''
}

//新しいセッションidを返す
const createSessionId = () => {
  return `${crypto.randomUUID()}`;
}

app.use(express.static(__dirname  + "/dist/"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(Cors())

app.get("/",(req,res,n)=>{
  res.redirect("/")
})
//vueへ飛ばす
app.get(/.*/, function(req, res) {
  res.sendFile(__dirname + "/dist/index.html");
});

//ログイン認証し、データを返す
app.post("/login_auth", (req,res,e) =>{
  //パスワード認証
  const cookies = JSON.parse(JSON.stringify(req.cookies))
  conn.query(`select count(*) from users where sessionid='${cookies.dcalendar}'`, (err,result) => {
    let IsLogin = (err != null || result[0]["count(*)"] !== 0)

    if (IsLogin){
      //ログイン処理
      conn.query(`select name, schedule, group_list from users where sessionid='${cookies.dcalendar}'`,(err,result_userdata)=>{
        if(err != null){
          console.log(err)
          res.send({ message:"no"})
        }

        console.log(result_userdata)
        let name = result_userdata[0]["name"]
        let schedule = result_userdata[0]["schedule"]
        let group = result_userdata[0]["group_list"]

        res.send({
          message:"ok",
          name:name,
          schedule:schedule,
          group_list:group
        })
      })
    } else {
      res.clearCookie("dclaendar")
      res.send({ message:"no"})
    }
  })
})

//discordのcodeからdiscordユーザー情報を返す
app.post('/token_oauth2', function (req, res, next) {
  try {
    const code = req.body.code;
    if (code === "" || code === undefined || code === null) {
      res.send({ message:"no"})
    } else {
      //code→token
      oauth.tokenRequest({
        clientId: DISCORD_OAUTH2_DATA.CLIENT_ID,
        clientSecret: DISCORD_OAUTH2_DATA.CLIENT_SECRET,
        redirectUri: `https://${req.headers.host}/oauth2`,
        code: code,
        scope: "identify",
        grantType: "authorization_code"
      }).then(token => {
        if (token.access_token !== "") {
          oauth.getUser(token.access_token)
            .then(user_data => {
              /*
{
id: '1038450187326193754',
username: 'saito',
avatar: null,
avatar_decoration: null,
discriminator: '7787',
public_flags: 0,
flags: 0,
banner: null,
banner_color: null,
accent_color: null,
locale: 'ja',
mfa_enabled: false,
premium_type: 0
}*/
              const sid = createSessionId();
              let testjson = {data:"test_data"};
              testjson = JSON.stringify(testjson)
              conn.query(`select count(*) from users where accessid='${user_data.id}'`,(err,id_data)=>{
                if(err != null){
                  console.log(err)
                  res.send({
                    message:"no",
                  })
                }else{
                  // 過去にログインしていたか
                  if(id_data[0]["count(*)"] !== 0) {
                    conn.query(`update users set sessionid='${sid}', expires_in='${token.expires_in}' where accessid='${user_data.id}'`,(err, update_data)=> {
                      if (err != null) {
                        console.log(err)
                        res.send({
                          message: 'no'
                        })
                      }
                    })
                  } else {
                    // 新規ユーザー
                    conn.query(`INSERT into users(name, schedule, group_list, accessid, sessionid, expires_in) values ('${user_data.username}', '${testjson}', '${testjson}', '${user_data.id}', '${sid}', ${token.expires_in});`,(err, result, fields) => {
                      if(err != null){
                        console.log(err)
                        res.send({
                          message:"no",
                        })
                      }
                    })
                  }

                }
              })


              // login success
              //res.writeHead(200, {'Set-Cookie': `dcalendar=${sid};`});
              res.cookie("dcalendar",sid,token.expires_in)

              res.send({
                message:"ok"
              })
            }).catch(err => {
            console.log("err:" + err)
            res.send({ message:"no"})
          })
        }
      }).catch(err => {
        console.log("err:" + err)
        res.send({ message:"no"})
      })
    }
  }catch (e) {
    console.log(e)
    res.send({ message:"no"})
  }

})

//予定をDBに追加
app.post('/addSchedule', (req, res, n) => {
  const cookies = JSON.parse(JSON.stringify(req.cookies))
  conn.query(`select count(*) from users where sessionid='${cookies.dcalendar}'`, (err,result) => {
    let IsLogin = (err != null || result[0]["count(*)"] !== 0)
    if (!IsLogin) res.send({message: "no"})

    const schedule = JSON.stringify(JSON.parse(req.body.schedule))
    const name = req.body.name

    conn.query(`update users set schedule='${schedule}' where name='${name}'`, (err, result) => {
      if (err != null) res.send({message: "no"})
      else {
        res.send({message: "ok"})
      }
    })
  })
})


let server = https.createServer(options, app);
server.listen(443, function() {
  console.log("express is running port at 443")
});
