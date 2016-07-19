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

function *renderPageWithArgs(page, args) {
    try {
        var html = yield [render(page, params)];
        html = html.join('');
        this.body = html;
    } catch (error) {
        render404.call(this, error);
    }
}

function *render404(error) {
    html = yield [render('404.jade')];
    html = html.join('');
    this.body = html;
    throw error;
}
/**
 * Post listing.
 */

function *campaigns() {
    renderPageWithArgs.call(this, 'campaigns.jade', null);
}

/**
 * Show new campaign form
 */

function *newCampaign() {
    renderPageWithArgs.call(this, 'new.jade', null);
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
    getThemes(function *(error, themes) {
        renderPageWithArgs.call(this, 'new.jade', themes);
    });
}


// Listen

app.listen(3000);
console.log('Server running: http://localhost:3000');