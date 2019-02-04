<template>
  <HelloWorld />
</template>

<script>
import HelloWorld from '../components/HelloWorld'
export default {
  components: {
    HelloWorld
  },
  head() {
    return {
      title: 'Home'
    }
  }
}
</script>
