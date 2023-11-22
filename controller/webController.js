const fsPromise = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');

const webData = {
    list:require('../model/webs.json') ,
    setWeb:function(data){
        this.list = data;
    }
};


const getAllData = (req , res) => {

    const dataAll =  webData.list.length > 0 ? webData.list : [];

    res.json({code:1 , list:dataAll});

}
const getDataPerID = (req , res) => {

    const paramsID = req.params.id;
    const findData = webData.list.find((ele) => ele.webID === parseInt(paramsID));
    if(findData === undefined) return res.json({code:6 , msg:"Data Not Found"});

    res.json({code:1 , list: findData});

}

const webUpdate = async (req , res) => {

    const paramsID = req.body.id;
    const findData = webData.list.find((ele) => ele.webID === parseInt(paramsID));
    if(findData === undefined) return res.json({code:6 , msg:"no data match"});
    let newObjs = {};
    let objContent = {};
    let newWebCon = [];
    let mergeData = [];
    let createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    newObjs["webID"] = findData.webID;
    newObjs["WebTitle"] = req.body.title;

    if(req.body.webContent){

        const dataWeb = JSON.parse(req.body.webContent);
       
        console.log(dataWeb)

        objContent["webConID"] = dataWeb.webConID;
        objContent["webConEn"] = JSON.stringify(dataWeb.webConEn);
        objContent["webConTh"] = JSON.stringify(dataWeb.webConTh);
        objContent["webPriority"] = dataWeb.webPriority;

        const otDataWeb = findData.webContent.filter((im) => im.webConID !== parseInt(dataWeb.webConID));

        newWebCon.push(objContent);

        mergeData = otDataWeb.concat(newWebCon)
        
        mergeData.sort((a ,b) => {
            return a["webConID"] - b["webConID"]
        })
    }

    newObjs["webContent"] = mergeData;
    newObjs["webLog"] = createdate;

    console.log(newObjs)

    const otherData = webData.list.filter((ele) => ele.webID !== parseInt(paramsID));

    webData.setWeb([...otherData , newObjs]);

    webData.list.sort((a ,b) => {
        return a["webID"] - b["webID"]
    })

    await fsPromise.writeFile(
        path.join(__dirname , ".." , "model" , "webs.json"),
        JSON.stringify(webData.list)
    )

    res.json({code:1})

}

const webAddContent = async (req , res) => {

    const titles = req.body.title;

    const findData = webData.list.find((ele) => ele.WebTitle === titles);

    let newsObjs  = {};

    if(findData === undefined) return res.json({code:6 , msg:"data Not found"});
    

     let objData  = [{
        webConID : findData.webContent.length > 0 ? findData.webContent[findData.webContent.length - 1].webConID + 1 : 1  ,
        webConEn : req.body.desen , 
        webConTh : req.body.desth , 
        webPriority :  findData.webContent.length > 0 ? findData.webContent[findData.webContent.length - 1].webPriority + 1 : 1  ,
    }];

    const mergeData = findData.webContent.concat(objData);

    console.log(mergeData)

    newsObjs = {
        webID:findData.webID , 
        WebTitle : titles , 
        webContent : mergeData , 
        webLog : findData.webLog
    }

    const otherData = webData.list.filter((ele) => ele.webID !== findData.webID);

    console.log(newsObjs)

    webData.setWeb([...otherData , newsObjs]);

    webData.list.sort((a ,b) => {
        return a["webID"] - b["webID"]
    })

    console.log(webData.list)

    await fsPromise.writeFile(
        path.join(__dirname , ".." , "model" , "webs.json"),
        JSON.stringify(webData.list)
    )

    res.json({code:1})
}

module.exports = {getAllData , getDataPerID , webUpdate , webAddContent}