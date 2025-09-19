const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController.js')

// Manga Read Routes
router.get('/manga', appController.manga)
router.get('/manga/info/:mangaName', appController.mangaInformation)
router.get('/manga/volume/:mangaId/:coverId', appController.mangaVolumePicture)
router.get('/manga/search/:mangaName', appController.mangaSearch)

// User Routes
router.get('/user/data/:userName', appController.userData)
router.put('/user/manga/add/:userName/:mangaName/:volumeNumber', appController.userAddManga)
router.put('/user/manga/updateVolumeNumber/:userName/:manga/:volumeNumber', appController.userUpdateMangaVolumeNumber)
router.put('/user/manga/updateMangaStatus/:userName/:manga/:status', appController.userUpdateMangaStatus)
router.put('/user/manga/deleteManga/:userName/:manga', appController.userDeleteManga)



module.exports = router
