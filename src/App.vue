<template>
  <img
    class="loading"
    src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
    v-if="loading"
  />

  <div v-else class="content">
    <div class="search__bar">
      <div class="button__wrapper">
        <button class="button" @click="filterHandler(All)">All</button>
        <button
          class="button"
          v-for="buttonName in duplicate"
          :key="buttonName"
          @click="filterHandler(buttonName)"
        >
          {{ buttonName.charAt(0).toUpperCase() + buttonName.slice(1) }}
        </button>
      </div>
      <input
        class="input"
        type="text"
        v-model="search"
        placeholder="Search.."
        @input="filteredList"
      />
    </div>

    <div class="list__items">
      <div
        class="item"
        :title="item.description"
        v-for="item in filterByCategory"
        :key="item.id"
      >
        <div class="image__wrapper">
          <img class="image" :src="item.image" alt="image" />
        </div>
        <span class="item__title">{{ item.title }}</span>
        <span class="item__rating">Rating: {{ item.rating.rate }}</span>
        <span class="item__count">Count: {{ item.rating.count }}</span>
        <span class="item__price">
          {{ item.price }} €
          <span class="item__sale">{{ Math.floor(+item.price + 50) }} €</span>
        </span>
        <button class="button button--add">Add the cart</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "App",
  data: () => ({
    filterByCategory: [],
    category: [],
    search: "",
    loading: true,
    timeout: 0,
  }),

  methods: {
    filterHandler(buttonName: string, buttonAll: string) {
      if (buttonName === buttonAll) {
        this.onLoad();
      } else {
        const category = this.data.filter((item: { category: string }) => {
          return item.category === buttonName;
        });
        this.category = category;
        this.filterByCategory = category;
        this.search = "";
      }
    },
    onLoad() {
      this.filterByCategory = this.data;
      this.category = this.data;
    },

    filteredList() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const searchItem = this.filterByCategory.filter(
          (item: { title: string }) => {
            return item.title.toLowerCase().includes(this.search.toLowerCase());
          }
        );
        this.search.trim()
          ? (this.filterByCategory = searchItem)
          : (this.filterByCategory = this.category);
      }, 700);
    },
  },

  computed: {
    ...mapGetters({ data: "allItems" }),
    duplicate() {
      const buttonName = this.data.map(
        (item: { category: string }) => item.category
      );
      const categoryButtons = [...new Set(buttonName)].sort();
      return categoryButtons;
    },
  },

  async created() {
    await this.$store.dispatch("getItems");
    this.onLoad();
    this.loading = false;
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.title {
  margin-bottom: 60px;
}

.content {
  margin: 0 auto;
  padding: 0 20px;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover;
  transform: translate(-50%, -50%);
}

.search__bar {
  display: grid;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 650px;
  width: 100%;
}

.button__wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.input {
  padding: 8px 15px;
  margin: 0 auto;
  max-width: 380px;
  width: 100%;
  height: 20px;
  display: flex;
  font-weight: 500;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 20px;
  outline: none;
  border: 2px solid #c5c1c1;
  &:focus {
    border: 2px solid #e9b15e;
  }
}

.button {
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 500;
  background-color: #e9b15e;
  border-radius: 4px;
  color: #ffffff;
  border: 2px solid transparent;
  font-weight: 600;
  font-size: 14px;
  transition: all ease 0.3s;
  &--add {
    color: #ffffff;
    background-color: #e9b15e;
    max-width: 160px;
    width: 100%;
    margin: 0 auto;
    border: 2px solid transparent;
  }
  
  &:hover,
  &:focus {
    background-color: #2e2c2c;
    color: #e9b15e;
    border: 2px solid transparent;
  }
}

.list__items {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 30px;
}

.item {
  width: 100%;
  border-radius: 8px;
  display: grid;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: 2px solid #c5c1c1;
  padding: 30px 10px;
  text-align: center;
  cursor: pointer;
  transition: all ease 0.3s;
  position: relative;
}

.item:hover {
  box-shadow: 0 1px 10px #363635;
  border: 2px solid transparent;
}

.item__title {
  font-weight: 700;
  max-height: 250px;
  height: 100%;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  padding: 0 20px;
}

.item__rating,
.item__count {
  font-weight: 600;
}

.item__price {
  color: #e9b15e;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.item__sale {
  color: #b3b0b0;
  text-decoration: line-through;
  font-size: 16px;
}

.image__wrapper {
  margin: 0 auto;
  width: 280px;
  height: 350px;
  padding: 10px 20px 20px 20px;
  opacity: 0.95;
}

.image {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
</style>
