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

function getThemes() {
    return new Promise(function (resolve, reject) {
        var JsonPath = path.join(__dirname, '/public/themes/themes.json');
        var themes = null;
        var fs = require('fs');

        fs.readFile(JsonPath, 'utf8', function (error, fileBuffer) {
            if (error)
                reject(Error(error));
            themes = JSON.parse(fileBuffer);
            resolve(themes);
        });
    });
}
function *themes() {
    getThemes();
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
    for (var theme in listOfThemes) {
        if (Math.random() < 1 / ++count)
            result = theme;
    }
    return result;
}
function fillCampaign() {
    return new Promise(function (resolve, reject) {
        getThemes().then(function (listOfThemes) {
            if (error)
                reject(Error(error));
            var id = uuid.v4();
            var theme = getRandomTheme(listOfThemes);
            var name = 'Name ' + randomString.generate(10);
            var goal = 'Goal ' + randomString.generate(25);
            var description = 'Description ' + randomString.generate(100);
            var campaign = new Campaign(id, theme, name, goal, description);
            resolve(campaign);
        });
    });
}

/**
 * Post listing.
 */

function *campaigns() {
    var campaigns = [Promise.resolve(fillCampaign()), Promise.resolve(fillCampaign())];
    this.body = yield render('campaigns.jade', {campaigns: campaigns});
}

/**
 * Show new campaign form
 */

function *newCampaign() {
    // var themeList = getThemes().then(function(themes) {
    //     return resolve(themes);
    // });
    this.body = getThemes().then((themes) => {
        return render('new.jade', {themes: themes});
    });

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