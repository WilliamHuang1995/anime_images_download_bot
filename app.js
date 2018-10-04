//wrapper for reddit api
const snoowrap = require('snoowrap');

//for downloading images
const fs = require('fs');
const Path = require('path');
const axios = require('axios');

//config file
const config = require('./config.json')

//regex
const regex_full = /\[[.,"!\w\d\s-]+\]\(https:\/\/(i.imgur|imgur).com\/[\w]+(\/[\w]+|.png|.jpg|.gifv)\)/g
const regex_comment = /[.,"!\w\d\s-]+/g
const regex_link = /https:\/\/(i.imgur|imgur).com\/[\w]+(\/[\w]+|.png|.jpg|.gifv)/g
const regex_file_name = /[\w]+(.png|.jpg|.gifv)/g

//arrays
let link_comments = []
let mapping = []
// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper
const r = new snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    username: config.username,
    password: config.password
});
let thread = '922bv4'
//run function every day
async function main() {
    //fetch user autolovepon
    //filter post by keyword provided by config
    //check if post already visited before by 
    //  comparing with some file?
    //  comparing with database?
    //parse through comments
    //download links using  cheerio parsing
    const response = await r.getSubmission(thread).expandReplies({
        limit: Infinity,
        depth: 1
    })
    //loop through all comments
    response.comments.forEach(function (comment) {
        //only care about comments with imgur links
        if (comment.body.includes('imgur.com')) {
            let result = comment.body.match(regex_full)
            //store results into array
            if(Array.isArray(result)) link_comments = link_comments.concat(result)
            else link_comments.push(result)
        }
    })
    split()
}

function split(){
    link_comments.forEach((ref)=>{
        let comment = ref.match(regex_comment)[0]
        let link = ref.match(regex_link)[0]
        //can't be bothered to deal with albums just yet
        if(!link.includes('/a/')){
            let filename = link.match(regex_file_name)[0]
            //handle gifv cases
            filename = filename.replace('.gifv','.mp4')
            
            download(link,filename)
        }
        //maybe add to database in the future
        mapping.push({link:link,comment:comment})
    })
    // console.log(mapping)
}

//download
async function download(link,filename){
    const path = Path.resolve(__dirname,'./image',filename)
    const response = await axios({
        method: 'GET',
        url: link,
        responseType: 'stream'
    })
    response.data.pipe(fs.createWriteStream(path))
    return new Promise((resolve,reject)=>{
        response.data.on('end',()=>{
            resolve()
        })
        response.data.on('error',err=>{
            reject(err)
        })
    })
       
}

main()