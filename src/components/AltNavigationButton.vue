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
  color: #fff;
  background-color: unset;
  cursor: pointer;
  font-size: 1.375rem;
  font-family: "Flaco-Mono", sans-serif;
  border: 0;
  padding: 0.6rem;
}
</style>
