<template>
  <h1>Current Reads</h1>

  <manga-search-bar />

  <div v-for="manga in mangaList" :key="manga.id">
    <manga :manga="manga"/>
  </div>

</template>

<script>
import axios from "axios"
import MangaSearchBar from "@/components/MangaSearchBar.vue"
import Manga from "@/components/Manga";

export default {
  name: "Current-Reads",
  // eslint-disable-next-line vue/no-unused-components
  components: {Manga, MangaSearchBar},

  data() {
    return {
      userData : {},
      mangaList: [],
      mangaTitles: []
    }
  },
  methods: {
    async getVolumePicture(manga, mangaData) {
      let volumePictureId = mangaData.image

      for (const volumeData of mangaData.volumeData) {

        if (volumeData.volumeNumber == manga.volume) {
          volumePictureId = volumeData.fileName
        }
      }

      const res = await axios.get(process.env.VUE_APP_BASE_URL+ `/manga/volume/` + mangaData.id
          + '/' + volumePictureId)

      return res.data.imageUrl
    }
  },
  async created() {
    // const res = await axios.get()
    let userName = 'AndrewMarcondes'

    const res = await axios.get('http://localhost:3000/user/data/'+userName)
    this.userData = res.data

    console.log(res.data)

    for(const manga of this.userData.mangas){
      if (manga.status === "reading"){
        this.mangaTitles.push(manga)
      }
    }

    for (const manga of this.mangaTitles) {
      try {
        let res = await axios.get(`http://localhost:3000/manga/info/`+manga.name);
        const mangaData = res.data;


        const volumePictureUrl = await this.getVolumePicture(manga, mangaData)

        console.log("volumePictureId")
        console.log(volumePictureUrl)

        let mangaItem = {
          title: mangaData.title,
          description: mangaData.description,
          image: volumePictureUrl,
          volume: manga.volume,
          volumeData: mangaData.volumeData,
          id: 1,
          shopLink: "",
        }

        this.mangaList = [...this.mangaList, mangaItem]
        console.log("res");
        console.log(res);
      } catch (error) {
        console.log("Unable to request from mangaInformation: " + error);
      }
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}
</style>
