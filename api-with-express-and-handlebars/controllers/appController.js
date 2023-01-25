const bent = require('bent')
const getJSON = bent('json')
const semverMajor = require('semver/functions/major')
const semverGt = require('semver/functions/gt')
const packageJson = require('../package.json')
const NODE_API_URL = 'https://nodejs.org/dist/index.json'
const MANGA_DEX_URL = 'https://api.consumet.org/manga/mangadex/'
const MANGA_DEX_INFO_URL = 'https://api.consumet.org/manga/mangadex/info/'

const isGrater = (a, b) => semverGt(a.version, b.version)

const getLatestReleases = (releases) =>
  releases.reduce((acc, release) => {
    const major = `v${semverMajor(release.version)}`
    const existing = acc[major]
    if (!existing || isGrater(release, existing)) {
      acc[major] = release
    }
    return acc
  }, {})

exports.dependencies = (req, res) => {
  const dependencies = Object.entries(
    packageJson.dependencies
  ).map(([key, value]) => ({ name: key, version: value }))
  res.render('dependencies.hbs', { dependencies })
}

exports.minimumSecurePage = async (req, res) => {
  const releases = await getJSON(NODE_API_URL)
  const securedReleases = releases.filter((release) => release.security)
  const minimumSecured = getLatestReleases(securedReleases)
  res.render('minimum-secure.hbs', {
    result: JSON.stringify(minimumSecured, undefined, '  ')
  })
}

exports.latestReleasesPage = async (req, res) => {
  const releases = await getJSON(NODE_API_URL)
  const latest = getLatestReleases(releases)
  res.render('latest-releases.hbs', {
    result: JSON.stringify(latest, undefined, '  ')
  })
}

exports.minimumSecure = async (req, res) => {
  try {
    res.setHeader('Content-type', 'application/json')
    const releases = await getJSON(NODE_API_URL)
    const securedReleases = releases.filter((release) => release.security)
    const minimumSecured = getLatestReleases(securedReleases)
    res.json(minimumSecured)
  } catch (error) {
    res.json({ error, message: `Unable to fetch data on ${req.route.path}` })
  }
}

exports.latestReleases = async (req, res) => {
  try {
    res.setHeader('Content-type', 'application/json')
    const releases = await getJSON(NODE_API_URL)
    res.json(getLatestReleases(releases))
  } catch (error) {
    res.json({ error, message: `Unable to fetch data on ${req.route.path}` })
  }
}

exports.home = (req, res) => {
  res.render('home.hbs')
}

exports.manga = async (req, res) => {
  try {
    res.setHeader('Content-type', 'application/json')
    res.json('hello world')
  } catch (error) {
    res.json({ error, message: `Unable to fetch data on ${req.route.path}` })
  }
}

exports.mangaInformation = async (req, res) => {
  try {
    res.setHeader('Content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const MANGA_NAME = req.params.mangaName.toLowerCase().replace(/-/g, " ")

    const getMangas = await getJSON(MANGA_DEX_URL+MANGA_NAME)

    let bestMatch

    getMangas.results.forEach(result => {
      if(result.title.toLowerCase() == MANGA_NAME){
        bestMatch = result
      }
    })

    const getMangaInfo = await getJSON(MANGA_DEX_INFO_URL+bestMatch.id)

    let mangaDescription = getMangaInfo.description.en
    let editedDescription

    let dashCount = 0
    for (let i = 0; i < mangaDescription.length; i++){

      if(dashCount == 1 && !mangaDescription.charAt(i).match("-")){
        dashCount = 0
      }

      if(mangaDescription.charAt(i).match("-")){
        dashCount++
      }
      if(dashCount == 3){
        editedDescription = mangaDescription.slice(0, i-3)
        i = mangaDescription.length
      }
    }

    if(dashCount == 0)
      editedDescription = mangaDescription

    const mangaInfo = {
      id: getMangaInfo.id,
      title: getMangaInfo.title,
      description: editedDescription,
      releaseDate: getMangaInfo.releaseDate,
      image: getMangaInfo.image,
    }

    res.json(mangaInfo)

  } catch (error) {
    res.json({ error, message: `Unable to fetch data on ${req.route.path}` })
  }
}

