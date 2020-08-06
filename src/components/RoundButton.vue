<template>
  <button
    :style="`background-color: ${color}`"
    v-html="icon"
  />
</template>

<script>
export default {
  name: 'RoundButton',
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: '#ffffff',
    },
  },
};
</script>

<style scoped>
button {
  border: 0;
  background-color: unset;
  width: 2.6rem;
  height: 2.6rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

button:focus {
  outline: 0;
  box-shadow: 0 0 2pt 1pt rgba(206, 206, 206, 0.6);
}

button >>> svg {
  width: 100%;
  transform: scale(1.3);
}
</style>
