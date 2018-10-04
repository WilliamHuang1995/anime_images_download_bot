const snoowrap = require('snoowrap');
const fs = require('fs');
const config = require('./config.json')
const regex = /\[[.,"!\w\d\s-]+\]\(https:\/\/(i.imgur|imgur).com\/[\w]+(\/[\w]+|.png|.jpg|.gifv)\)/g
let link_comments = []
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
            let result = comment.body.match(regex)
            //store results into array
            if(Array.isArray(result)) link_comments = link_comments.concat(result)
            else link_comments.push(result)
        }
    })

}
main()