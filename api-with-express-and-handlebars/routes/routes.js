const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController.js')

// Manga Read Routes
router.get('/manga', appController.manga)
router.get('/manga/info/:mangaName', appController.mangaInformation)
router.get('/manga/volume/:mangaId/coverId', appController.mangaVolumePicture)


module.exports = router
