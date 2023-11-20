<template>
  <div></div>
</template>

<script>
/**
 * {
      path: '/redirect/:path(.*)',
      name: 'Redirect',
      component: REDIRECT,
      meta: { 
        hide: true,
      },
    },
 */
export default {
  beforeMount() {
    const { params, query } = this.$route;
    const { path } = params;
    this.$router.replace({
      path: '/' + (Array.isArray(path) ? path.join('/') : path),
      query
    });
  }
};
</script>
