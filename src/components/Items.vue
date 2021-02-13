<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <h1>Bucket Item Manager</h1>
      </b-col>
    </b-row>
    <b-row v-if="items.length > 0">
      <b-col>
        <b-pagination v-model="page" :total-rows="items.length" :per-page="perPage" align="center"></b-pagination>
      </b-col>
    </b-row>
    <b-row>
      <b-col style="margin-top: 10px;">
        <transition-group
          tag="ul"
          name="flip-icon-list"
          class="row-cols-3 row-cols-sm-4 row-cols-lg-6 row-cols-xl-8 row-cols-xxl-10 list-unstyled"
          style="display: flex; flex-wrap: wrap;"
        >
          <b-col v-for="(item, i) in filteredItems" v-bind:key="i + 1" tag="li" class="flip-icon-list-icon d-inline-flex flex-column mb-2 text-center">
            <b-card bg-variant="light" class="px-2 py-2 border-0" no-body style="height: 150px;" @click="deleteItem(item)" @dblclick="e => openUrl(e, 'https://cdn.mbr.pw/' + item)">
              <b-img v-if="!item.endsWith('mp4')" :src="'https://cdn.mbr.pw/' + item" style="max-height: 135px; max-width: 100%;"></b-img>
              <b-embed v-else type="video" :src="'https://cdn.mbr.pw/' + item"></b-embed>
            </b-card>
            <b-form-text class="mt-2 text-break" :title="item" @click="deleteItem(item)">{{ item }}</b-form-text>
          </b-col>
        </transition-group>
        <div aria-live="polite" aria-atomic="true">
          <b-alert
            :show="filteredItems.length === 0"
            :role="null"
            :aria-live="null"
            :aria-atomic="null"
            fade
            variant="light"
            class="text-center mt-4 d-flex align-items-center justify-content-center"
          >
            <span>No items found. Ctrl + Shift + A to begin.</span>
          </b-alert>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="items.length > 0">
      <b-col>
        <b-pagination v-model="page" :total-rows="items.length" :per-page="perPage" align="center"></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      key: "",
      keys: [],
      page: 1,
      perPage: 100
    };
  },
  computed: {
    filteredItems() {
      let current = (this.page - 1) * this.perPage;
      return this.items.slice(current, current + this.perPage);
    }
  },
  methods: {
    initApiKey: function() {
      this.key = prompt("Enter your API key: ");
      return !!this.key;
    },
    fetch: function() {
      fetch("https://api.mbr.pw/api/cdn/items?key=" + this.key).then(response => {
        if (!response.ok) return alert(response.status);
        response.json().then(json => {
          this.items = json.filter(x => x.endsWith(".png") || x.endsWith(".jpg") || x.endsWith(".jpeg") || x.endsWith(".mp4"));
        }).catch(console.log);
      }).catch(() => this.items.push("favicon.ico"));
    },
    deleteItem: function(item) {
      if (!this.keys.includes("ControlLeft")) return;

      let headers = {"content-type": "application/json", "authorization": this.key};

      fetch("https://api.mbr.pw/api/delete", {method: "POST", headers: headers, body: JSON.stringify({id: item})}).then(response => {
        if (!response.ok) alert(response.status);
        else this.items.splice(this.items.indexOf(item), 1);
      });
    },
    openUrl: function(event, url, target = "_blank") {
      event.preventDefault();
      window.open(url, target);
    }
  },
  mounted: function() {
    let keydown = e => {
      if (!this.keys.includes(e.code)) this.keys.push(e.code);

      if (this.keys.includes("ShiftLeft") && this.keys.includes("ControlLeft") && this.keys.includes("KeyA") && this.items.length < 1) {
        this.keys = [];
        if (this.initApiKey()) this.fetch();
      }
    };

    let keyup = e => {
      if (this.keys.includes(e.code)) this.keys.splice(this.keys.indexOf(e.code), 1);
    };

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
  }
};
</script>