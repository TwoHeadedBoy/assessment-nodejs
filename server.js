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

    fs.readFile(JsonPath, 'utf8', function (error, fileBuffer) {
        if (error) return callback(error);
        themes = JSON.parse(fileBuffer);
        callback(null, themes);
    });
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

function fillCampaign(error, listOfThemes) {
    if (error) return error;
    var id = uuid.v4();
    var theme = listOfThemes[Math.floor(Math.random()*listOfThemes.length)];
    var name = 'Name ' + randomString.generate(10);
    var goal = 'Goal ' + randomString.generate(25);
    var description = 'Description ' + randomString.generate(100);
    return new Campaign(id, theme, name, goal, description);
}

/**
 * Post listing.
 */

function *campaigns() {
    var campaigns = [getThemes(fillCampaign(error, listOfThemes)), getThemes(fillCampaign(error, listOfThemes))];
    var html = yield [render('campaigns.jade')];
    html = html.join('');
    this.body = html;
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