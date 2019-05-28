<template>
  <button>{{ title.toUpperCase() }}</button>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
button {
  background-color: #ffd27c;
  color: #212121;
  cursor: pointer;
  font-size: 1.375rem;
  font-family: "Flaco-Mono", sans-serif;
  border: 0;
  padding: 0.6rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
