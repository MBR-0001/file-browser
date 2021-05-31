<template>
  <div id="app">
    <b-container fluid>
      <b-row>
        <b-col>
          <h1>Bucket Item Managertest</h1>
        </b-col>
      </b-row>
      <b-row v-if="items.length > 0">
        <b-col style="display: flex; flex-direction: column;">
          <b-form-select v-model="filter" :options="filters" style="margin-bottom: 5px;"></b-form-select>
          <b-pagination v-model="page" :total-rows="filteredItems.length" :per-page="perPage" align="center"></b-pagination>
        </b-col>
      </b-row>
      <b-row v-if="filteredItems.length > 0">
        <b-col style="margin-top: 10px;">
          <transition-group
            tag="ul"
            name="flip-icon-list"
            class="row-cols-3 row-cols-sm-4 row-cols-lg-6 row-cols-xl-8 row-cols-xxl-10 list-unstyled"
            style="display: flex; flex-wrap: wrap;"
          >
            <b-col v-for="(item, i) in pageItems" v-bind:key="i + 1" tag="li" class="flip-icon-list-icon d-inline-flex flex-column mb-2 text-center">
              <b-card bg-variant="light" class="px-2 py-2 border-0" no-body style="height: 150px;" @click="e => deleteItem(item, e)" @dblclick="e => openUrl(e, 'https://cdn.mbr.pw/' + item)">
                <div v-if="!filters[0].value.some(x => item.endsWith('.' + x))" class="custom">
                  <span style="font-size: xx-large;">{{getExt(item)}}</span>
                </div>
                <b-img v-else-if="!item.endsWith('mp4')" :src="'https://cdn.mbr.pw/' + item" class="image"></b-img>
                <b-embed v-else type="video" :src="'https://cdn.mbr.pw/' + item"></b-embed>
              </b-card>
              <b-form-text class="mt-2 text-break" :title="item" @click="e => deleteItem(item, e)">{{ item }}</b-form-text>
            </b-col>
          </transition-group>
        </b-col>
      </b-row>
      <b-row v-if="items.length > 0">
        <b-col>
          <b-pagination v-model="page" :total-rows="filteredItems.length" :per-page="perPage" align="center"></b-pagination>
        </b-col>
      </b-row>
      <b-row v-else>
        <div class="text-center text-primary my-2" style="margin: 0 auto;">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);

export default {
  name: "App",
  data: function() {
    return {
      items: [],
      page: 1,
      perPage: 100,
      filter: null,
      filters: [
        {value: ["png", "jpg", "jpeg", "mp4", "ico", "gif"], text: "Images/videos"},
        {value: [], text: "Other"},
        {value: null, text: "All"}
      ]
    };
  },
  computed: {
    filteredItems() {
      if (Array.isArray(this.filter)) {
        if (this.filter.length < 1) {
          let f = this.filters[0].value;
          return this.items.filter(x => !f.some(filter => x.endsWith("." + filter)));
        }
        else return this.items.filter(x => this.filter.some(filter => x.endsWith("." + filter)));
      }
      if (this.filter == null) return this.items;
      return null;
    },
    pageItems() {
      let current = (this.page - 1) * this.perPage;
      
      return this.filteredItems.slice(current, current + this.perPage);
    },
    key() {
      return localStorage.getItem("key");
    }
  },
  watch: {
    filter() {
      this.page = 1;
    }
  },
  methods: {
    fetch() {
      fetch("https://api.mbr.pw/api/cdn/items", {headers: {authorization: this.key}}).then(response => {
        if (!response.ok) return alert(response.status);
        response.json().then(json => this.items = json).catch(console.log);
      }).catch(console.log);
    },
    getExt(filename) {
      let temp = filename.split(".");
      return "." + temp[temp.length - 1];
    },
    deleteItem(item, event) {
      if (!event.ctrlKey) return;

      let headers = {"content-type": "application/json", "authorization": this.key};

      fetch("https://api.mbr.pw/api/delete", {method: "POST", headers: headers, body: JSON.stringify({id: item})}).then(response => {
        if (!response.ok) alert(response.status);
        else this.items.splice(this.items.indexOf(item), 1);
      });
    },
    openUrl(event, url, target = "_blank") {
      event.preventDefault();
      window.open(url, target);
    }
  },
  mounted() {
    if (window.location.hostname != "localhost") {
      let el = document.createElement("script");
      el.setAttribute("src", "https://mbr.pw/scripts/req.js");
      document.head.appendChild(el);
    }

    if (this.key) this.fetch();
    this.filter = this.filters[0].value;
  }
};
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
}

.custom {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.image {
  max-height: 135px;
  max-width: 100%;
}
</style>
