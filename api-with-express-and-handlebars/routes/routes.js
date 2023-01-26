const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController.js')

// Routes the project had
// Application Routes
// router.get('/', appController.home)
// router.get('/dependencies', appController.dependencies)
// router.get('/minimumSecure', appController.minimumSecurePage)
// router.get('/latestReleases', appController.latestReleasesPage)
//
// // API Routes
// router.get('/api/minimum-secure', appController.minimumSecure)
// router.get('/api/latest-releases', appController.latestReleases)

// Manga Read Routes
router.get('/manga', appController.manga)
router.get('/manga/info/:mangaName', appController.mangaInformation)

module.exports = router
