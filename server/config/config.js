const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/HRMS", { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to DB');
    }
});
mongoose.set('useCreateIndex', true);

module.exports = {
    port: 3000,
    secret: 'danish@zepto',
    mongoose,
    dbConfig : {
        "user": "rightapp",
        "password": "OhE9fF5lUV",
        "connectString": "82.70.105.116:1521/jbseeker.zepto.com"
    }
}
   