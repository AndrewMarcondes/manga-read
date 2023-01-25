<template>
  <h1>Current Reads</h1>

  <div v-for="manga in mangaList" :key="manga.id">
    <manga :manga="manga"/>
  </div>

</template>

<script>
import axios from "axios"

import Manga from "@/components/Manga";

export default {
  name: "Current-Reads",
  components: {Manga},

  data() {
    return {
      mangaList: [],
      mangaTitles: [
        "berserk",
        "hunter-x-hunter",
        "gangsta",
        "tokyo-ghoul",
        "yuyu-hakusho",
        "one-piece",
      ]
    }
  },
  async created() {
    for (const title of this.mangaTitles) {
      try {
        const res = await axios.get(`http://localhost:3000/manga/info/`+title);
        const mangaData = res.data;

        let mangaItem = {
          title: mangaData.title,
          description: mangaData.description,
          image: mangaData.image,
          volume: 1,
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