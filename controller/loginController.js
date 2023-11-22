const users = {
    list:require('../model/username.json') ,
    setUser:function(data){
        this.list  = data
    }
}

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fsPromise = require('fs').promises;
const path = require('path');
dotenv.config();


const login = async(req , res) => {

   
    //const hash = bcrypt.hashSync('', 10);
    const chkUser = users.list.find((usr) => usr.userName ===req.body.data.user);
    if(chkUser === undefined) return res.json({code:6 , msg:"user not found"});
    const chkPassword = users.list.find((usr) => usr.passWord === req.body.data.pass);
    if(chkPassword === undefined) return res.json({code:7 , msg:"password not match"});

    const accessToken = jwt.sign(
        {username:chkUser.userName},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"}
    )

    const otherData = users.list.filter((ele) => ele.userID !== chkUser.userID );
    
    let userUpdata = {
        userID:chkUser.userID ,
        userName:chkUser.userName,
        passWord:chkUser.passWord,
        roles:chkUser.roles,
        logs:chkUser.logs,
        accessToken:accessToken
    }
    
    users.setUser([...otherData , userUpdata]);

    await fsPromise.writeFile(
        path.join(__dirname , '..' , 'model' , 'username.json'),
        JSON.stringify(users.list)
    )


    res.json({code:1 , list:{user:chkUser.userName, token:accessToken}})

}

const veriflyToken = (req , res , next) => {

   /* const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const tokens = authHeader.split(" ")[1];*/
    const usersData =  req.body.user;
    var msgSuccess = "";
    const findToken  =  users.list.find((ele) => ele.userName === usersData);
    if(findToken === undefined) return res.json({code:3 , msg:"Data No Token"})
    console.log(findToken)

    jwt.verify(
        findToken.accessToken , 
        process.env.ACCESS_TOKEN_SECRET ,
        (err , decoded) => {
            //console.log(err)
            if(err) return res.json({code:12 , msg :err.message }) // invalid Token
            console.log( usersData , decoded.username);
           
            if(usersData === decoded.username){
                    msgSuccess = "correct";
            }
            next();

        }
    )

     console.log(msgSuccess)


     res.json({code:1})


}

const logOut = async (req , res) => {


    if(req.body.type === "logout"){

        const authHeader = req.headers.authorization || req.headers.Authorization;
            if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
            const tokens = authHeader.split(" ")[1];

            //console.log(tokens)
            const findData = users.list.find((ele) => ele?.accessToken ===  tokens);
            if(findData === undefined) return res.json({code:2 , msg:"token Not match"}) 
            findData["accessToken"] = "";

            const otherData = users.list.filter((itm) => itm.userID !== findData.userID);

            users.setUser([...otherData , findData]);

            await fsPromise.writeFile(
                path.join(__dirname , '..' , 'model' , 'username.json'),
                JSON.stringify(users.list)
            )

        res.json({code:1})

    }
    else{
        res.json({code:4})
    }




}


module.exports = {login , veriflyToken , logOut}