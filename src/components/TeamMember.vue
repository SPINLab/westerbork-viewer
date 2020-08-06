<template>
  <li class="card">
    <h4>{{ name }}</h4>
    <p>{{ position.toUpperCase() }}</p>
    <p>{{ organization.toUpperCase() }}</p>
  </li>
</template>

<script>
export default {
  name: 'TeamMember',
  props: {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.card {
  margin-bottom: 1.4rem;
}

h4 {
  margin: 0.4rem 0;
  font-family: 'CamphorPro-Regular', sans-serif;
  font-size: 1.3125rem;
  font-weight: normal;
}

p {
  margin: 0;
}
</style>
