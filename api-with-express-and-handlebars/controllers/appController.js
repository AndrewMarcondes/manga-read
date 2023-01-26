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
    res.json({ error, message: `Unable to fetch data on ${req.route.path}` })
  }
}

const trimMangaDescription = (description) => {
  const INDEX_OF_TRIPLE_DASH = description.indexOf("---")

  if(INDEX_OF_TRIPLE_DASH > 0)
    return description.slice(0, INDEX_OF_TRIPLE_DASH)
  else
    return description
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
        if(manga.title.toLowerCase() == MANGA_NAME){
          isMangaSavedLocally = true
          localManga = manga
        }
          })

      if(isMangaSavedLocally){
        console.log("EASY PEASY")
        res.json(localManga)
      }else{
        const getMangas = await getJSON(MANGA_DEX_URL+MANGA_NAME)

        let bestMatch
        getMangas.results.forEach(result => {
          if(result.title.toLowerCase() == MANGA_NAME){
            bestMatch = result
          }
        })

        const getMangaInfo = await getJSON(MANGA_DEX_INFO_URL+bestMatch.id)

        let mangaDescription = getMangaInfo.description.en
        let editedDescription = trimMangaDescription(mangaDescription)

        const mangaInfo = {
          id: getMangaInfo.id,
          title: getMangaInfo.title,
          description: editedDescription,
          releaseDate: getMangaInfo.releaseDate,
          image: getMangaInfo.image,
        }

        mangaData.push(mangaInfo)

        let saveMangaRequest = JSON.stringify(mangaData)
        fs.writeFileSync('mangadata.json', saveMangaRequest)

        res.json(mangaInfo)
      }

    } catch (error) {``
      console.log("Shit broke in json parse: "+error)
    }


  } catch (error) {
    res.json({ error, message: `Unable to fetch data on ${req.route.path}` })
  }
}


// const isGrater = (a, b) => semverGt(a.version, b.version)
//
// const getLatestReleases = (releases) =>
//     releases.reduce((acc, release) => {
//       const major = `v${semverMajor(release.version)}`
//       const existing = acc[major]
//       if (!existing || isGrater(release, existing)) {
//         acc[major] = release
//       }
//       return acc
//     }, {})
//
// exports.dependencies = (req, res) => {
//   const dependencies = Object.entries(
//       packageJson.dependencies
//   ).map(([key, value]) => ({ name: key, version: value }))
//   res.render('dependencies.hbs', { dependencies })
// }
//
// exports.minimumSecurePage = async (req, res) => {
//   const releases = await getJSON(NODE_API_URL)
//   const securedReleases = releases.filter((release) => release.security)
//   const minimumSecured = getLatestReleases(securedReleases)
//   res.render('minimum-secure.hbs', {
//     result: JSON.stringify(minimumSecured, undefined, '  ')
//   })
// }
//
// exports.latestReleasesPage = async (req, res) => {
//   const releases = await getJSON(NODE_API_URL)
//   const latest = getLatestReleases(releases)
//   res.render('latest-releases.hbs', {
//     result: JSON.stringify(latest, undefined, '  ')
//   })
// }
//
// exports.minimumSecure = async (req, res) => {
//   try {
//     res.setHeader('Content-type', 'application/json')
//     const releases = await getJSON(NODE_API_URL)
//     const securedReleases = releases.filter((release) => release.security)
//     const minimumSecured = getLatestReleases(securedReleases)
//     res.json(minimumSecured)
//   } catch (error) {
//     res.json({ error, message: `Unable to fetch data on ${req.route.path}` })
//   }
// }
//
// exports.latestReleases = async (req, res) => {
//   try {
//     res.setHeader('Content-type', 'application/json')
//     const releases = await getJSON(NODE_API_URL)
//     res.json(getLatestReleases(releases))
//   } catch (error) {
//     res.json({ error, message: `Unable to fetch data on ${req.route.path}` })
//   }
// }
//
// exports.home = (req, res) => {
//   res.render('home.hbs')
// }
