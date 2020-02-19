const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const PORT = 3000;
const app = express();
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

const dummyData = [
    {
        id: Math.floor(Math.random() * 100 + 1),
        name: 'Processzor',
        category: 'Számítástechnika'
    },
    {
        id: Math.floor(Math.random() * 100 + 1),
        name: 'Winchester',
        category: 'Számítástechnika'
    },
    // {
    //     id: Math.floor(Math.random() * 100 + 1),
    //     name: 'Mosogatógép',
    //     category: 'Konyhatechnika'
    // },
    // {
    //     id: Math.floor(Math.random() * 100 + 1),
    //     name: 'Elektromos radiátor',
    //     category: 'Fűtéstechnika'
    // },
    // {
    //     id: Math.floor(Math.random() * 100 + 1),
    //     name: 'Billentyűzet',
    //     category: 'Számítástechnika'
    // },
    // {
    //     id: Math.floor(Math.random() * 100 + 1),
    //     name: 'Vezeték nélküli egér',
    //     category: 'Számítástechnika'
    // }
]

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home', { title: 'Termékek', items: dummyData });
})


app.listen(PORT, () => console.log(`App is started and listening on port ${PORT}`))