const router = require('express').Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const checkJwt = require('../verify-jwt/verify');
const User = require('../model/user');
const config = require('../config/config');
const Data = require('../model/data');

router.get('/verify', checkJwt, (req, res) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
        if (err) throw err;

        if(!user) {
            res.status(404).json({
                success: false,
                message: 'Authentication failed, Invalid Token'
            }); 
        } else {
            res.json({
                success: true,
                user: user.name,
                message: 'Successful!'
            });
        }
    });
});

router.post('/signup', (req, res) => {
    let user = new User();
    let body = _.pick(req.body, ['name','email','password']);

    user.name = body.name;
    user.email = body.email;
    user.password = body.password;
    
    User.findOne({ email: body.email }, (err, existingUser) => {
        if (existingUser) {
            res.json({
                success: true,
                message: 'Account with that email already exists'
            });
        } else {
            user.save().then(user => {
                let token = jwt.sign({
                    user
                }, config.secret, {
                    expiresIn: '7d'
                });
    
                res.json({
                    success: true,
                    message: 'Your token',
                    token
                });
            }, (err) => {
                res.status(400).send(err);
            });
        }
    });
});

router.post('/login', (req, res) => {
    let body = _.pick(req.body, ['email','password']);

    User.findOne({ email: body.email }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Authentication failed, User do not exist'
            });
        } else if (user) {  
            let validPass = user.comparePassword(body.password);
            if(!validPass) {
                res.json({
                    success: false,
                    message: 'Authentication failed, Wrong Password'
                })
            } else {
                let token = jwt.sign({
                    user
                }, config.secret, {
                    expiresIn: '7d'
                });
    
                res.json({
                    success: true,
                    message: 'Your token',
                    token: token
                });
            }
        }
    });
});

router.post('/save', async (req, res) => {
    // let data = new Data();
    // let body = _.pick(req.body, ['date','dateObj','project','task','hours']);
    
    // data.date = new Date(body.date);
    // data.dateObj = {
    //     year: body.dateObj.year,
    //     month: body.dateObj.month,
    //     day: body.dateObj.day
    // }
    // data.project = body.project;
    // data.task = body.task;
    // data.hours = body.hours;

    try {
        const { year, month, day } = req.body.dateObj;
        const { date, project, task, hours } = req.body;
    
        let data = new Data({
            date: new Date(date),
            dateObj: {
                year, 
                month, 
                day 
            },
            project, 
            task, 
            hours
        });
    
        await data.save();
        
        let mongooseDocuments = await Data.find();

        res.json({
            success: true,
            message: 'Saved',
            data: mongooseDocuments
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.post('/edit/:id', async (req, res) => {
    // let data = new Data();
    // let body = _.pick(req.body, ['date','dateObj','project','task','hours']);
    
    // data.date = new Date(body.date);
    // data.dateObj = {
    //     year: body.dateObj.year,
    //     month: body.dateObj.month,
    //     day: body.dateObj.day
    // }
    // data.project = body.project;
    // data.task = body.task;
    // data.hours = body.hours;

    try {
        const { year, month, day } = req.body.dateObj;
        const { date, project, task, hours } = req.body;
    
        let data = {
            date: new Date(date),
            dateObj: {
                year, 
                month, 
                day 
            },
            project, 
            task,
            hours
        };
    
        await Data.update({'date': new Date(date)}, { $set: data });
        
        let mongooseDocuments = await Data.find();

        res.json({
            success: true,
            message: 'Saved',
            data: mongooseDocuments
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.get('/login/:tokken', (req, res) => {
    console.log("------------------------");
    console.log(req.params.token);
    
    publicIp.v4().then(ip => {
    
        var user_agent = req.headers['user-agent'] || req.get('user-agent');
        var environment = null;
        if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
            environment = 'dev';
        }
    
        var databaseLogLevel = 0;
        var databaseLogSave = 1;
    
        var sessObj = {
            "svsid": "jobseeker",
            "signup-status": "active",
            "token": req.params.token
        };
    
        ds.getConnection(config.dbConfig, function(err, connection) {
            if (err) {
                console.log("Error");
                console.error(err.message);
                return;
        }
    
            console.log('-----------------------------------------');
            console.log('jobseeker//login');
            console.log('-----------------------------------------');
                console.log(sessObj);
            console.log('-----------------------------------------');
    
        //call another stored procedure
            var bindvars = {
                accesstoken: {
                    val: JSON.stringify(sessObj),
                    dir: ds.BIND_IN
                },
                dbLogLevel: {
                    val: databaseLogLevel,
                    dir: ds.BIND_IN
                },
                env: {
                    val: environment,
                    dir: ds.BIND_IN
                },
                dbLogSave: {
                    val: databaseLogSave,
                    dir: ds.BIND_IN
                },
                //................................. In
                msg: {
                    type: ds.STRING,
                    dir: ds.BIND_OUT,
                    maxSize: 5000
                },
                sql_error: {
                    type: ds.STRING,
                    dir: ds.BIND_OUT,
                    maxSize: 5000
                },
                //................................. Out
                response_data: {
                    type: ds.STRING,
                    dir: ds.BIND_OUT,
                    maxSize: 50000
                }
            };
    
            var sql = "DECLARE rslt   zresult   := zresult(:dbLogLevel);\
                        ses    zsession   := zsession(rslt,:accesstoken);\
                        BEGIN\
                            ses.new(rslt);\
                            :msg := rslt.pushLog().msg;\
                            :response_data := ses.to_json; \
                            if :env = 'dev' then \
                                IF :dbLogSave = 1 THEN \
                                    rslt.savelog(); \
                                END IF; \
                            end if; \
                            if rslt.status = 0 THEN\
                                commit;\
                            else\
                                rollback;\
                            end if;\
                            :sql_error := '';\
                            ses.clear(rslt);\
                        EXCEPTION WHEN OTHERS THEN\
                            rollback;\
                            :msg := rslt.pushLog().msg;\
                            :sql_error := sqlerrm;\
                            rslt.savelog();\
                            ses.clear(rslt);\
                        END;";
    
            connection.execute(sql, bindvars, function(err, result) {
                if (err) {
                    console.error("Query Execution Error: " + err.message);
                    console.log('-----------------------------------------');
                    return;
                } //End if
    
                console.log('Jsk Login Response');
                console.log(result.outBinds);
                console.log('-----------------------------------------');
                try {
                            var abc = JSON.parse(result.outBinds.response_data);
                            console.log(abc.svsid);
                            res.cookie('sesid', abc.sesid, {
                                maxAge: 86400000
                            });
                            res.cookie('userid',abc.usrid, {
                                maxAge: 86400000
                            });
                            res.writeHead(301, {
                                Location: config.JobSeeker_URL
                            });
                            res.end();
                    } catch (e) {
                        console.log(e);
                    }
    
                connection.close(function(err) {
                    if (err) {
                        console.log('Error closing connection', err);
                        console.log('-----------------------------------------');
                    }
            });
        });
    });
    });
});

console.log(new Buffer('hrms').toString('base64'));

router.get('/data', (req, res) => {

    Data.find().sort({date: 'asc'}).then(function(mongooseDocuments) {
            res.json({
                success: true,
                data: mongooseDocuments
            });
        }, (err) => {
            res.status(400).send(err);
        });

    
    // data.save().then(data => {
    //     res.json({
    //         success: true,
    //         message: 'Saved',
    //         data
    //     });
    // }, (err) => {
    //     res.status(400).send(err);
    // });
});

module.exports = router;
