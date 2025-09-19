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

      const res = await axios.get(process.env.VUE_APP_BASE_URL + `/manga/GetMangaSearch?mangaName=` + searchText)

      for (const result of res.data){
        this.searchResults = [...this.searchResults, result]
      }
    },
    async addManga(manga) {

      this.searchResults.splice(0)

      // eslint-disable-next-line no-unused-vars
      const res = await axios.put(process.env.VUE_APP_BASE_URL + `/user/AddUserManga?userName=AndrewMarcondes&mangaName=` + manga.title)
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
