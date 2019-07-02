<template>
  <button class="read-further-button">
    LEES VERDER...
  </button>
</template>

<script>
export default {
  name: "ReadFutherButton"
};
</script>

<style scoped>
.read-further-button {
  background-color: #6e6e6e;
  border-radius: 10rem;
  border: 0;
  color: #ffffff;
  padding: 0.6rem 2rem;
  font-family: "Flaco-Mono", sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.read-further-button:focus {
  outline: 0;
  background-color: grey;
}
</style>
