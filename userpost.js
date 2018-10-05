//wrapper for reddit api
const snoowrap = require('snoowrap');

//config file
const config = require('./config.json')

//create new snoowrap instance
const r = new snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    username: config.username,
    password: config.password
});

async function main(){
    const botSubmissions = await r.getUser('autolovepon').getSubmissions()
    //for each submission create a folder based on the title
    botSubmissions.forEach(function(submission){
        console.log('################################')
        console.log(submission.title.replace(/\s/g,''))
        console.log(submission.url)
        console.log(submission.score)
        //if pass certain comment threshold then pass to download function
        //or compare with a list of anime you follow
    })
}

main()