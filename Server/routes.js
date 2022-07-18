import login from "./Functions/login.js";
import writePost from "./Functions/create-post.js";
import register from './Functions/register.js'
import db from "./database.js";
import fs from "fs";

function routes (app, dir, ext) {

    dir += '/Public/'

    app.get('/', (req, res, next) => {
        res.sendFile(dir + 'Static/home.html')
    });

    app.get('/home', (req, res) => {
        res.sendFile(dir + 'Static/home.html')
    });

    app.get('/template', (req, res) => {
        if (req.query.override !== 'true') return res.sendFile(dir + 'Static/not-found.html')
        res.sendFile(dir + 'Static/template.html')
    });

    app.get('/all', (req, res) => {
        res.sendFile(dir + 'Static/all.html')
    });

    app.get('/login', (req, res, next) => {
        res.sendFile(dir + 'User/login.html');
    })

    app.get('/register', (req, res) => {
        res.sendFile(dir + 'User/register.html');
    })

    app.post('/login', async (req, res) => {
        await login(req, res, ext)
    });

    app.post('/register', async (req, res) => {
        return console.log(req.body)
        await register(req, res);
    })

    // app.post('/write', (req, res) => {
    //     writePost(req.body.postname, req.body.postdescription, req.body.posturl);
    //     res.sendStatus(200)
    // });

    app.get('/:grade/:subject/:index', async (req, res) => {

        let {grade, subject, index} = req.params;
        grade = grade.toLowerCase();
        subject = subject.toLowerCase();
        index = index.toLowerCase();

        const item = await db.get(`${grade}_${subject}_${index}`);

        if (!item) return res.sendFile(dir + 'Static/not-found.html');

        res.sendFile(dir + 'Dynamic/post-template.html')

        await ext.io.on('connection', socket => {

            socket.on('request_file', () => {
              ext.io.emit('request_file', item);
            })
        });
        return console.log(req.params);
        res.sendFile(dir + 'Static/not-found.html')
    });

    app.get('/pdfs/sample', (req, res) => {
        res.sendFile(dir + 'Dynamic/sample_pdf.pdf')
    })

    app.use((req, res) => {
        res.status(404);
        res.sendFile(dir + 'Static/not-found.html')
    });

}

export default routes