import { createStore } from "vuex";
import axios from "axios";

type Item = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export default createStore({
  state: {
    items: [] as Item[],
  },

  mutations: {
    updateItems(state, items) {
      state.items = items;
    },
  },

  actions: {
    async getItems(state) {
      const { data } = await axios.get("https://fakestoreapi.com/products");
      state.commit("updateItems", data);
    },
  },

  getters: {
    allItems: (state) => {
      return state.items;
    },
  },

  modules: {},
});
