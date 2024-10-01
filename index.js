const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.get('/api', async (req, res) => {
    const query = req.query.query;
    const searchUrl = `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(query)}`;

    try {
        const { data } = await axios.get(searchUrl);
        const $ = cheerio.load(data);
        const results = [];

        $('.makers ul li').each((i, elem) => {
            const name = $(elem).find('strong').text();
            const url = $(elem).find('a').attr('href');
            const imageUrl = $(elem).find('img').attr('src');

            results.push({
                name,
                url: `https://www.gsmarena.com/${url}`,
                imageUrl,
            });
        });

        res.json({ results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching device information' });
    }
});

app.get('/info', async (req, res) => {
    const deviceUrl = req.query.url;

    try {
        const { data } = await axios.get(deviceUrl);
        const $ = cheerio.load(data);

        const title = $('h1.specs-phone-name-title').text();
        const releaseDate = $('span[data-spec="released-hl"]').text() || "Release date not available";
        const dimensions = $('td[data-spec="dimensions"]').text() || "Dimensions not available";
        const storage = $('td[data-spec="internalmemory"]').text() || "Storage not available";
        const displayInfo = $('td[data-spec="displaytype"]').text() || "Display info not available";
        const displayInch = $('td[data-spec="displaysize"]').text() || "Display size not available";
        const cameraPixel = $('td[data-spec="cam1modules"]').text() || "Camera pixel not available";
        const videoPixel = $('td[data-spec="cam2modules"]').text() || "Video pixel not available";
        const ramSize = $('td[data-spec="internalmemory"]').text() || "RAM size not available";
        const chipsetInfo = $('td[data-spec="chipset"]').text() || "Chipset info not available";
        const batteryType = $('td[data-spec="batdescription1"]').text() || "Battery type not available";
        const batteryCapacity = $('span[data-spec="batsize-hl"]').text() || "Battery capacity not available";

        const finalBatteryCapacity = batteryCapacity ? `${batteryCapacity} mAh` : "Battery capacity not available";

        res.json({
            title,
            releaseDate,
            dimensions,
            storage,
            displayInfo,
            displayInch,
            cameraPixel,
            videoPixel,
            ramSize,
            chipsetInfo,
            batteryType,
            batteryCapacity: finalBatteryCapacity,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching device specifications' });
    }
});

app.listen(3000, () => {
    console.log('API running on port 3000');
});
