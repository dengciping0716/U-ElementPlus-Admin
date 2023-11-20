<template>
  <div></div>
</template>

<script>
export default {
  name: 'Redirect',
  mounted() {
    const { params, query } = this.$route;
    const { path } = params;
    this.$router.replace({
      path: '/' + (Array.isArray(path) ? path.join('/') : path),
      query
    });
  }
};
</script>
