<template>
  <transition name="fade">
    <div v-show="menuOpen" ref="menu" id="share-menu" class="menu">
      <div class="menu-item">
        <h4>STUUR NAAR EEN VRIEND</h4>
        <input type="email" placeholder="email@example.com" />
      </div>
      <div class="menu-item">
        <h4>DEEL OP SOCIAL MEDIA</h4>
        <button>Twitter</button>
        <button>Facebook</button>
        <button>LinkedIn</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ShareMenu",
  data() {
    return {
      menuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    documentClick(e) {
      if (!this.$el.parentElement.contains(e.target)) {
        if (this.menuOpen) this.menuOpen = false;
      }
    }
  },
  created() {
    document.addEventListener("click", this.documentClick);
  },
  destroyed() {
    document.removeEventListener("click", this.documentClick);
  }
};
</script>

<style scoped>
#share-menu >>> h4 {
  font-weight: normal;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.menu {
  border-radius: 10px;
  background-color: #454545;
  padding: 1rem;
  color: #ffffff;
  margin-left: 20px;
  transform: translateY(2px);
  width: 14rem;
}

.menu:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid transparent;
  border-right: 10px solid #454545;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  left: -20px;
}

.menu-item {
  margin-bottom: 1rem;
}

input {
  background-color: #7b7b7b;
  border-radius: 5px;
  color: #ffffff;
  border: 0;
  padding: 0.4rem;
  font-family: "CamphorPro-Regular", sans-serif;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

input::placeholder {
  color: #ffffffb7;
}

input:focus {
  outline: 0;
  box-shadow: 0 0 1pt 0.5pt rgba(255, 209, 124, 0.6);
}

button {
  display: block;
  color: #454545;
  background-color: #ffd27c;
  border: 0;
  border-radius: 5px;
  padding: 0.4rem 1rem;
  margin: 0.4rem 0;
  font-family: "Flaco-Mono", sans-serif;
  cursor: pointer;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

button:focus {
  outline: 0;
  box-shadow: 0 0 2pt 1pt rgb(180, 180, 180);
}
</style>
