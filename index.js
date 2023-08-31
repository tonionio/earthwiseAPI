const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const newspapers = [
    {
        name: 'ecofriendlyhabits',
        address: 'https://www.ecofriendlyhabits.com/ethical-and-sustainable-fashion/',
        base: ''
    },
    {
        name: 'inspirecleanenergy',
        address: 'https://www.inspirecleanenergy.com/blog/sustainable-living',
        base: 'https://www.inspirecleanenergy.com'
    },
    {
        name: 'ceomagazine',
        address: 'https://www.theceomagazine.com/lifestyle/',
        base: 'https://www.theceomagazine.com/'
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/search?query=sustainable+living',
        base: ''
    },
    {
        name: 'TreadingMyOwnPath',
        address: 'https://treadingmyownpath.com/',
        base: ''
    },
    {
        name: 'EcoWarriorPrincess',
        address: 'https://ecowarriorprincess.net/',
        base: ''
    },
    {
        name: 'MoralFibres',
        address: 'https://moralfibres.co.uk/',
        base: ''
    },
    {
        name: 'TheEcoHub',
        address: 'https://theecohub.ca/',
        base: ''
    },
    {
        name: 'EcoCult',
        address: 'https://ecocult.com/',
        base: ''
    },
    {
        name: 'TheGreenHub',
        address: 'https://thegreenhubonline.com/',
        base: ''
    },
    {
        name: 'GreenBiz',
        address: 'https://www.greenbiz.com/',
        base: ''
    },
    {
        name: 'MyGreenCloset',
        address: 'https://mygreencloset.com/',
        base: ''
    },
    {
        name: 'OldWorldNew',
        address: 'https://oldworldnew.us/',
        base: ''
    },
    {
        name: 'WastelandRebel',
        address: 'https://wastelandrebel.com/en/',
        base: ''
    },    
    {
        name: 'AConsideredLife',
        address: 'https://www.aconsideredlife.co.uk/',
        base: ''
    },
    {
        name: 'SustainableJungle',
        address: 'https://www.sustainablejungle.com/',
        base: ''
    },
    {
        name: 'SustainablyChic',
        address: 'https://www.sustainably-chic.com/',
        base: ''
    },
    {
        name: 'GoingZeroWaste',
        address: 'https://www.goingzerowaste.com/',
        base: ''
    }
    
];

const keywords = ['green', 'sustainable', 'eco-friendly', 'environment', 'conservation'];

const tips = [];

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            keywords.forEach(keyword => {
                $(`a:contains("${keyword}")`, html).each(function() {
                    const title = $(this).text();
                    const url = $(this).attr('href');

                    if (!tips.some(tip => tip.url === url)) {
                        tips.push({
                            title,
                            url: newspaper.base + url,
                            source: newspaper.name
                        });
                    }
                });
            });
        })
        .catch((err) => console.log(err));
});

app.get('/', (req, res) => {
    res.json('Welcome to my sustainable living API');
});

app.get('/tips', (req, res) => {
    res.json(tips);
});

app.get('/tips/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId;

    const newspaper = newspapers.find(newspaper => newspaper.name == newspaperId);

    if (!newspaper) {
        return res.status(404).json({ error: 'Newspaper not found' });
    }

    const newspaperAddress = newspaper.address;
    const newspaperBase = newspaper.base;

    axios.get(newspaperAddress)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const specificTips = [];

        keywords.forEach(keyword => {
            $(`a:contains("${keyword}")`, html).each(function() {
                const title = $(this).text();
                const url = $(this).attr('href');

                // Check if the article is already in the specificTips array to avoid duplicates
                if (!specificTips.some(tip => tip.url === url)) {
                    specificTips.push({
                        title,
                        url: newspaperBase + url,
                        source: newspaperId
                    });
                }
            });
        });
        res.json(specificTips);
    }).catch((err) => console.log(err));
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
