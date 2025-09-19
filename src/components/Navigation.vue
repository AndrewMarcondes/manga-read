<template>
<!--    <div id="nav">-->
<!--      <p><router-link to="/">Current Reads</router-link></p>-->
<!--      <p><router-link to="/finished">Finished</router-link></p>-->
<!--      <p><router-link to="/wishlist">Wishlist</router-link></p>-->
<!--    </div>-->
<!--  https://element-plus.org/en-US/component/menu.html#submenu-slots-->
  <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
  >
    <el-menu-item index="1"><router-link to="/">Currently Reading</router-link></el-menu-item>
    <el-menu-item index="2"><router-link to="/finished">Finished Series</router-link></el-menu-item>
    <el-menu-item index="3"><router-link to="/wishlist">Wishlist</router-link></el-menu-item>
  </el-menu>
  <div class="h-6" />

  <router-view />
</template>

<script>
export default {
  name: "Navigation-Bar"
}



</script>

<style scoped>

</style>