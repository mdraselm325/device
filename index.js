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
        console.error("Error fetching search results:", error.message);
        res.status(500).json({ message: 'Error fetching device information' });
    }
});


app.get('/info', async (req, res) => {
    const deviceUrl = req.query.url;

    if (!deviceUrl) {
        return res.status(400).json({ message: "Device URL not provided" });
    }

    try {
        const { data } = await axios.get(deviceUrl);
        const $ = cheerio.load(data);

        
        const deviceName = $('h1.specs-phone-name-title').text() || "Device name not available";

        
        const networkTechnology = $('a[data-spec="nettech"]').text() || "Network info not available";
        const networkSpeed = $('td[data-spec="speed"]').text() || "Network speed not available";

        
        const launchAnnounced = $('td[data-spec="year"]').text() || "Announced date not available";
        const launchStatus = $('td[data-spec="status"]').text() || "Status not available";

        
        const bodyDimensions = $('td[data-spec="dimensions"]').text() || "Dimensions not available";
        const bodyWeight = $('td[data-spec="weight"]').text() || "Weight not available";
        const bodyBuild = $('td[data-spec="build"]').text() || "Build not available";
        const bodySim = $('td[data-spec="sim"]').text() || "SIM info not available";

        
        const displayType = $('td[data-spec="displaytype"]').text() || "Display type not available";
        const displaySize = $('td[data-spec="displaysize"]').text() || "Display size not available";
        const displayResolution = $('td[data-spec="displayresolution"]').text() || "Display resolution not available";

        
        const platformOS = $('td[data-spec="os"]').text() || "OS not available";
        const platformChipset = $('td[data-spec="chipset"]').text() || "Chipset not available";
        const platformCPU = $('td[data-spec="cpu"]').text() || "CPU not available";
        const platformGPU = $('td[data-spec="gpu"]').text() || "GPU not available";

       
        const memoryCardSlot = $('td[data-spec="memoryslot"]').text() || "Memory slot not available";
        const memoryInternal = $('td[data-spec="internalmemory"]').text() || "Internal memory not available";

        
        const mainCameraTriple = $('td[data-spec="cam1modules"]').text() || "Main camera info not available";
        const mainCameraFeatures = $('td[data-spec="cam1features"]').text() || "Main camera features not available";
        const mainCameraVideo = $('td[data-spec="cam1video"]').text() || "Main camera video not available";

        
        const selfieCameraSingle = $('td[data-spec="cam2modules"]').text() || "Selfie camera info not available";
        const selfieCameraVideo = $('td[data-spec="cam2video"]').text() || "Selfie camera video not available";

        
        const soundInfo = $('th:contains("Sound")').closest('tr').find('.nfo').text() || "Sound info not available";
        const audioJackInfo = $('td:has(a[href*="audio-jack"])').closest('tr').find('.nfo').text() || "Audio jack not available";

        
        const commsWLAN = $('td[data-spec="wlan"]').text() || "WLAN not available";
        const commsBluetooth = $('td[data-spec="bluetooth"]').text() || "Bluetooth not available";
        const commsPositioning = $('td[data-spec="gps"]').text() || "GPS not available";
        const commsNFC = $('td[data-spec="nfc"]').text() || "NFC not available";
        const commsRadio = $('td[data-spec="radio"]').text() || "Radio not available";
        const commsUSB = $('td[data-spec="usb"]').text() || "USB not available";

        
        const featuresSensors = $('td[data-spec="sensors"]').text() || "Sensors not available";

        
        const batteryType = $('td[data-spec="batdescription1"]').text() || "Battery type not available";
        const chargingInfo = $('td:has(a[href*="battery-charging"])').closest('tr').find('.nfo').text() || "Charging info not available";

        
        const miscColors = $('td[data-spec="colors"]').text() || "Colors not available";
        const miscModels = $('td[data-spec="models"]').text() || "Models not available";
        const miscPrice = $('td[data-spec="price"]').text() || "Price not available";


        const imageUrl = $('.specs-photo-main img').attr('src') || "Image not available";

        
        res.json({
            deviceName,
            networkTechnology,
            networkSpeed,
            launchAnnounced,
            launchStatus,
            bodyDimensions,
            bodyWeight,
            bodyBuild,
            bodySim,
            displayType,
            displaySize,
            displayResolution,
            platformOS,
            platformChipset,
            platformCPU,
            platformGPU,
            memoryCardSlot,
            memoryInternal,
            mainCameraTriple,
            mainCameraFeatures,
            mainCameraVideo,
            selfieCameraSingle,
            selfieCameraVideo,
            soundInfo,
            audioJackInfo,
            commsWLAN,
            commsBluetooth,
            commsPositioning,
            commsNFC,
            commsRadio,
            commsUSB,
            featuresSensors,
            batteryType,
            chargingInfo,
            miscColors,
            miscModels,
            miscPrice,
            imageUrl
        });
    } catch (error) {
        console.error("Error fetching device specifications:", error.message);
        res.status(500).json({ message: 'Error fetching device specifications' });
    }
});


app.listen(3000, () => {
    console.log('API running on port 3000');
});
