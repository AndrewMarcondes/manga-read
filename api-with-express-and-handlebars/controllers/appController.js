const bent = require('bent')
const getJSON = bent('json')
const MANGA_DEX_URL = 'https://api.consumet.org/manga/mangadex/'
const MANGA_DEX_INFO_URL = 'https://api.consumet.org/manga/mangadex/info/'
const fs = require('node:fs');
const mangaHelper = require('../helpers/mangaHelpers.js')

exports.manga = async (req, res) => {
    try {
        res.json('hello world')
    } catch (error) {
        res.json({error, message: `Unable to fetch data on ${req.route.path}`})
    }
}

const getMangaVolumeInfo = async (mangaId, res) => {
    try {
        let url1 = 'https://api.mangadex.org/cover?manga%5B%5D='
        let url2 = '&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc&limit=100'

        const getVolumesInfo = await getJSON(url1 +mangaId+ url2)

        let volumeData = []

        getVolumesInfo.data.forEach(volume => {
            const volumeConverted = {
                id: volume.id,
                volumeNumber: volume.attributes.volume,
                fileName: volume.attributes.fileName,
            }
            volumeData.push(volumeConverted)
        })

        return volumeData
    } catch (error) {
        console.log("error")
        console.log(error)
        res.json({error, message: `Unable to fetch data on mangaVolumeInfo`})
    }
}

exports.mangaSearch = async  (req, res) => {
    res.setHeader('Content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const MANGA_NAME = req.params.mangaName.toLowerCase().replace(/-/g, " ")
    const getMangas = await getJSON(MANGA_DEX_URL + MANGA_NAME)

    res.json(getMangas)
}

exports.mangaInformation = async (req, res) => {
    try {
        const MANGA_NAME = req.params.mangaName.toLowerCase().replace(/-/g, " ")

        try {
            let rawMangaData = fs.readFileSync('mangadata.json')
            let mangaData = JSON.parse(rawMangaData)

            let isMangaSavedLocally = false
            let localManga

            mangaData.forEach(manga => {
                if (manga.title.toLowerCase() === MANGA_NAME) {
                    isMangaSavedLocally = true
                    localManga = manga
                }
            })

            if (isMangaSavedLocally) {
                console.log("EASY PEASY")
                res.json(localManga)
            } else {
                const getMangas = await getJSON(MANGA_DEX_URL + MANGA_NAME)

                let bestMatch
                getMangas.results.forEach(result => {
                    if (result.title.toLowerCase() === MANGA_NAME) {
                        bestMatch = result
                    }
                })

                const getMangaInfo = await getJSON(MANGA_DEX_INFO_URL + bestMatch.id)

                let mangaDescription = getMangaInfo.description.en
                let editedDescription = mangaHelper.trimMangaDescription(mangaDescription)

                const mangaVolumeInfo = await getMangaVolumeInfo(getMangaInfo.id, res)

                const mangaInfo = {
                    id: getMangaInfo.id,
                    title: getMangaInfo.title,
                    description: editedDescription,
                    releaseDate: getMangaInfo.releaseDate,
                    image: getMangaInfo.image,
                    volumeData: mangaVolumeInfo,
                }

                mangaData.push(mangaInfo)

                let saveMangaRequest = JSON.stringify(mangaData)
                fs.writeFileSync('mangadata.json', saveMangaRequest)

                res.json(mangaInfo)
            }

        } catch (error) {
            console.log("Shit broke in json parse: " + error)
        }


    } catch (error) {
        res.json({error, message: `Unable to fetch data on ${req.route.path}`})
    }
}

exports.mangaVolumePicture = async (req, res) => {
    try {
        let mangaId = req.params.mangaId
        let coverImageFileName = req.params.coverId

        res.status(200).json({
            'imageName': 'some image',
            'imageUrl': 'https://uploads.mangadex.org/covers/' + mangaId + '/' + coverImageFileName,
        });

    } catch (error) {
        res.json({error, message: `Unable to fetch data on ${req.route.path}`})
    }
}

const findUserJson = (requestUserName) => {
    let rawUserData = fs.readFileSync('userdata.json')
    let userDataJson = JSON.parse(rawUserData)

    console.log("hello")

    console.log("userDataJson")
    console.log(userDataJson)

    console.log("requestUserName")
    console.log(requestUserName)

    // userDataJson.forEach(user => {
    //     if (user.name.toString.equals(requestUserName.toString)) {
    //         console.log("---------TRUE----------")
    //         return user
    //     }
    // })

    return userDataJson
}

exports.userData = async (req, res) => {
    try{
        let requestUserName = req.params.userName

        res.json(findUserJson(requestUserName))

    } catch (error) {
        res.json({error, message: 'User was not found'+
                ' '+error.toString()})
    }
}

exports.userAddManga = async (req, res) => {
    try{
        let requestUserName = req.params.userName
        let mangaName = req.params.mangaName
        let mangaVolume = req.params.volumeNumber

        let newManga = {
                "name": mangaName,
                "status": "reading",
                "volume": mangaVolume
            }

        let user = findUserJson(requestUserName)

        user.mangas.push(newManga)

        let saveNewUserData = JSON.stringify(user)

        fs.writeFileSync('userdata.json', saveNewUserData)

        res.json("User Data saved")

    } catch (error) {
        console.log("error: "+error.toString())
        res.json({error, message: 'Failed to Add Manga to User Data' +
                ' '+error.toString()})
    }
}

exports.userUpdateMangaVolumeNumber = async (req, res) => {
    try{
        let requestUserName = req.params.userName
        let newUserMangaSaveData = req.params.manga
        let user = findUserJson(requestUserName)
        let mangaList = user.mangas

        for (let i = 0; i < mangaList.length; i++){
            if(mangaList[i].name === newUserMangaSaveData.toLowerCase()){
                let newMangaSave = {
                    "name": mangaList[i].name,
                    "status": mangaList[i].status,
                    "volume": req.params.volumeNumber
                }
                user.mangas.splice(i, 1)
                user.mangas.push(newMangaSave)
            }
        }

        let saveNewUserData = JSON.stringify(user)
        fs.writeFileSync('userdata.json', saveNewUserData)

        res.json("User Data saved")

    } catch (error) {
        res.json({error, message: 'Failed to Add Manga to User Data'+
                ' '+error.toString()})
    }
}

exports.userUpdateMangaStatus = async (req, res) => {
    try{
        let requestUserName = req.params.userName
        let newUserMangaSaveData = req.params.manga
        let user = findUserJson(requestUserName)
        let mangaList = user.mangas

        for (let i = 0; i < mangaList.length; i++){
            if(mangaList[i].name === newUserMangaSaveData){
                let newMangaSave = {
                    "name": mangaList[i].name,
                    "status": req.params.status,
                    "volume": mangaList[i].volume
                }
                user.mangas.splice(i, 1)
                user.mangas.push(newMangaSave)
            }
        }

        let saveNewUserData = JSON.stringify(user)
        fs.writeFileSync('userdata.json', saveNewUserData)

        res.json("User Data saved")

    } catch (error) {
        res.json({error, message: 'Failed to Add Manga to User Data'+
                ' '+error.toString()})
    }
}

exports.userDeleteManga = async (req, res) => {
    try{
        let requestUserName = req.params.userName
        let mangaToDelete = req.params.manga
        let user = findUserJson(requestUserName)
        let mangaList = user.mangas

        for (let i = 0; i < mangaList.length; i++){
            if(mangaList[i].name === mangaToDelete){
                user.mangas.splice(i, 1)
            }
        }

        let saveNewUserData = JSON.stringify(user)
        fs.writeFileSync('userdata.json', saveNewUserData)

        res.json("Delete Successful")

    } catch (error) {
        res.json({error, message: 'Failed to Remove Manga from User Data'+
                ' '+error.toString()})
    }
}
