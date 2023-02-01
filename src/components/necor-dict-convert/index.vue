<template>
  <div>
    {{ name }}
  </div>
</template>

<script>

export default {
  name: 'necor-dict-convert',
  componentName: 'NecorDictConvert',
  data () {
    return {
      name: ''
    }
  },
  props: {
    code: {
      type: String
    }
  },
  watch: {
    name (val, oldVal) {
      if (val !== oldVal) {
        this.name = val
      }
    }
  },
  mounted () {
    const dict = this.getDict(this.code)
    if (this.isNotBlank(dict)) {
      this.name = dict.name
    } else {
      this.name = this.code
    }
  },
  methods: {
    changeHand () {
      this.$emit('change')
    }
  }
}
</script>
