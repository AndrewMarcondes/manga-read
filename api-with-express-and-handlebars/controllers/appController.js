const bent = require('bent')
const getJSON = bent('json')
const MANGA_DEX_URL = 'https://api.consumet.org/manga/mangadex/'
const MANGA_DEX_INFO_URL = 'https://api.consumet.org/manga/mangadex/info/'
const fs = require('node:fs');

exports.manga = async (req, res) => {
    try {
        res.setHeader('Content-type', 'application/json')
        res.json('hello world')
    } catch (error) {
        res.json({error, message: `Unable to fetch data on ${req.route.path}`})
    }
}

const trimMangaDescription = (description) => {
    const INDEX_OF_TRIPLE_DASH = description.indexOf("---")

    if (INDEX_OF_TRIPLE_DASH > 0)
        return description.slice(0, INDEX_OF_TRIPLE_DASH)
    else
        return description
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

exports.mangaInformation = async (req, res) => {
    try {
        res.setHeader('Content-type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        const MANGA_NAME = req.params.mangaName.toLowerCase().replace(/-/g, " ")

        try {
            let rawMangaData = fs.readFileSync('mangadata.json')
            let mangaData = JSON.parse(rawMangaData)

            let isMangaSavedLocally = false
            let localManga

            mangaData.forEach(manga => {
                if (manga.title.toLowerCase() == MANGA_NAME) {
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
                    if (result.title.toLowerCase() == MANGA_NAME) {
                        bestMatch = result
                    }
                })

                const getMangaInfo = await getJSON(MANGA_DEX_INFO_URL + bestMatch.id)

                let mangaDescription = getMangaInfo.description.en
                let editedDescription = trimMangaDescription(mangaDescription)

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
        res.setHeader('Content-type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let mangaId = req.params.mangaId
        let coverImageFileName = req.params.coverId

        // let mangaId = 'db692d58-4b13-4174-ae8c-30c515c0689c'
        // let coverImageFileName = 'aa112927-f1e5-4fe4-a4db-7fd4a1536e3c.jpg'


        res.status(200).json({
            'imageName': 'some image',
            'imageUrl': 'https://uploads.mangadex.org/covers/' + mangaId + '/' + coverImageFileName,
        });

    } catch (error) {
        res.json({error, message: `Unable to fetch data on ${req.route.path}`})
    }
}
