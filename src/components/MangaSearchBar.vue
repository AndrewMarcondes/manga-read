<template>
  <input type="text" v-model="input" placeholder="Search..." />
  <el-button v-on:click="searchManga(input)">Search</el-button>
  <p>{{input}}</p>
  <div v-for="manga in searchResults" :key="manga.id">
    <p v-on:click="addManga(manga)">{{manga.title}}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

let input = ref("");

export default {
  name: "MangaSearchBar",
  data(){
    return{
      input,
      searchResults: [],
    }
  },
  methods: {
    async searchManga(searchText) {

      this.searchResults.splice(0)

      const res = await axios.get(`http://localhost:3000/manga/search/` + searchText)

      for (const result of res.data.results){
        this.searchResults = [...this.searchResults, result]
        console.log(result)
      }

      console.log(res)
      console.log(res.currentPage)
      console.log(this.searchResults)
    },
    async addManga(manga) {

      this.searchResults.splice(0)

      console.log(manga.title.toString())

      // eslint-disable-next-line no-unused-vars
      const res = await axios.put(`http://localhost:3000/user/manga/add/AndrewMarcondes/`
          + manga.title + "/1")

      console.log(res)
    },
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