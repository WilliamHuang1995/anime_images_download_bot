const snoowrap = require('snoowrap');
const fs = require('fs');
const config = require('./config.json')
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
async function main() {
    const response = await r.getSubmission(thread).expandReplies({
        limit: Infinity,
        depth: 1
    })
    response.comments.forEach(function(comment){
        console.log(comment.body)
    })

}
main()
// r.getSubmission(thread).body.then(a=>console.log(a))
