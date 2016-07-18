/**
 * Dependencies.
 */

var path = require('path'),
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
/**
 * Post listing.
 */

function *campaigns() {
    try {
        var page = 'Hello world';
        getThemes(function (error, themes) {
            if (error) throw error;
            page = render('campaigns', themes);
            this.body = page;
        });
        this.body = page;
    } catch (error) {
        throw error
    }
}

/**
 * Show new campaign form
 */

function *newCampaign() {

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

}


// Listen

app.listen(3000);
console.log('Server running: http://localhost:3000');