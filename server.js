/**
 * Dependencies.
 */

var randomString = require('randomstring'),
    uuid = require('node-uuid'),
    path = require('path'),
    render = require('./lib/render'),
    logger = require('koa-logger'),
    route = require('koa-route'),
    serve = require('koa-static-folder'),
    koa = require('koa'),
    app = koa();

const Jade = require('koa-jade');
const jade = new Jade({
    viewPath: './views',
    app: app
});


// Let's store a database locally, not great for production, obviously, but great for tests.

var database = [];

// Logger

app.use(logger());

// Routes

app.use(route.get('/', campaigns));
app.use(route.get('/new', newCampaign));
app.use(route.get('/campaign/:id', campaign));
app.use(route.post('/create', create));

app.use(serve('./public'));


// Route Definitions

function getThemes(callback) {
    var JsonPath = path.join(__dirname, '/public/themes/themes.json');
    var themes = null;
    var fs = require('fs');

    return new Promise((resolve, reject) => {

        fs.readFile(JsonPath, 'utf8', function (error, fileBuffer) {
            if (error) return callback(error);
            themes = JSON.parse(fileBuffer);
            resolve(themes);
        });

    })
}
function *themes(callback) {
    getThemes(callback);
}

// function *renderPage(page) {
//     try {
//         var html = yield [render(page)];
//         html = html.join('');
//         return html;
//     } catch (error) {
//         render404.call(this, error);
//     }
// }

// function *render404(error) {
//     html = yield [render('404.jade')];
//     html = html.join('');
//     this.body = html;
//     throw error;
// }

function Campaign(id, theme, name, goal, description) {
    this.id = id;
    this.theme = theme;
    this.name = name;
    this.goal = goal;
    this.description = description;
}

function getRandomTheme(listOfThemes) {
    var result;
    var count = 0;
    for (var theme in listOfThemes)
        if (Math.random() < 1 / ++count)
            result = theme;
    return result;
}
function fillCampaign() {
    return getThemes().then(listOfThemes => {
         // if (error) return error;
        var id = uuid.v4();
        var theme = getRandomTheme(listOfThemes);
        var name = 'Name ' + randomString.generate(10);
        var goal = 'Goal ' + randomString.generate(25);
        var description = 'Description ' + randomString.generate(100);
        var campaign = new Campaign(id, theme, name, goal, description);
        return Promise.resolve(campaign);
    })
}

/**
 * Post listing.
 */

function *campaigns() {
    var campaigns = [fillCampaign(), fillCampaign(), fillCampaign()];
    
    var campaigns =  yield Promise.all(campaigns);
    console.log(campaigns);
    this.body = yield render('campaigns.jade',{campaigns: campaigns});
}

/**
 * Show new campaign form
 */

function *newCampaign() {
    renderPage.call(this, 'new.jade');
}

/**
 * Show a single campaign
 */

function *campaign(id) {

}

/**
 * Create a campaign
 */

function *create() {
    themes(function *(error, themes) {
        renderPage.call(this, 'new.jade', themes);
    });
}


// Listen

app.listen(3000);
console.log('Server running: http://localhost:3000');