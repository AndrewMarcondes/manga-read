<template>

  <div class="common-layout">
    <el-container class="container2">
      <el-aside class="image"><img :src=manga.image contain height="200" width="150"></el-aside>
      <el-container>
        <el-header class="header">
          <h2>{{ manga.title }} {{manga.volume}}</h2>

        </el-header>
        <el-main class="body">

          <p>{{ manga.description }}</p>
        </el-main>
        <el-footer class="footer">
<!--          <el-button type="primary" class="butt">
            Volume<el-icon class="el-icon&#45;&#45;right"></el-icon>
          </el-button>-->
          <el-button type="primary" class="butt" @click="decrementVolume(manga.title, manga.volume)">
            Previous<el-icon class="el-icon--right"></el-icon>
          </el-button>
          <el-button type="primary" class="butt" @click="incrementVolume(manga.title, manga.volume)">
            Next<el-icon class="el-icon--right"></el-icon>
          </el-button>
<!--          <el-dropdown max-height="250px">

&lt;!&ndash;            <template #dropdown>
              <el-dropdown-menu v-for="volume in manga.volumeData" :key="volume.id">
                <el-dropdown-item>{{ volume.volumeNumber }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>&ndash;&gt;
          </el-dropdown>-->
          <el-button type="success" class="butt" @click="openInNewTab(manga.shopLink)">Shop Link</el-button>
        </el-footer>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import axios from "axios";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Manga",
  props: {
    manga: {
      title: String,
      description: String,
      image: String,
      volume: Number,
      id: Number,
      shopLink: String,
      volumeData: [
        {
          id: Number,
          fileName: String,
          volumeNumber: String,
        }
      ]
    },
  },
  methods: {
    openInNewTab(url) {
      window.open(url, '_blank', 'noreferrer');
    },
    async incrementVolume(title, volumeNumber) {
      console.log("Yo did this work");

      console.log(this);

      let updatedVolumeNumber = Number(volumeNumber) +1;

      try {
        // eslint-disable-next-line no-unused-vars
        let res = await axios.put('http://localhost:3000/user/manga/updateVolumeNumber/AndrewMarcondes/'+title+'/'+updatedVolumeNumber);
        console.log("Request sent")
      } catch (e) {
        console.log(e);
      }

    },

    async decrementVolume(title, volumeNumber) {
      console.log("Yo did this work");

      console.log(this);

      let updatedVolumeNumber = Number(volumeNumber) -1;

      try {
        // eslint-disable-next-line no-unused-vars
        let res = await axios.put('http://localhost:3000/user/manga/updateVolumeNumber/AndrewMarcondes/'+title+'/'+updatedVolumeNumber);
        console.log("Request sent")
      } catch (e) {
        console.log(e);
      }

    },
  },

}

console.log("Manga");
</script>

<style scoped>
.header {
  background-color: #79bbff;
}

.body {
  background: #ecf5ff;
}

.footer {
  background-color: #79bbff;
}

.image {
  width: 300px;
  background: #409EFF;
}

.container {
  border-radius: 2px;
  margin-bottom: 40px;
}

.container2 {
  border: 1px solid;
  margin: 40px;
}

.innerContainer {
  display: inline-block;
}

.butt {
  margin-top: 15px;
}

</style>