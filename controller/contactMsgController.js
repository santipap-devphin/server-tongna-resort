const contactMsg = {
    list:require('../model/contactmsg.json') , 
    setMsg:function(data){
        this.list = data
    }
}

const fsPromise = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');

const contactAdd = async (req , res) => {

    const id = contactMsg.list.length > 0 ? contactMsg.list[contactMsg.list.length-1].id + 1  : 1;
    const name = req.body.name;
    const email = req.body.email;
    const msg = req.body.message;
    const tel = req.body.tel;
    let time =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;

    let newObj = {id:id , name:name , tel:tel , email:email , message :msg , time:time}

    contactMsg.setMsg([...contactMsg.list , newObj]);

    await fsPromise.writeFile(
        path.join(__dirname , ".." , "model" , "contactmsg.json"),
        JSON.stringify(contactMsg.list)
    )

    res.json({code:1});

}

const msgAll = (req , res) => {
    res.json({code:1 , list:contactMsg.list})
}


module.exports = {contactAdd , msgAll}