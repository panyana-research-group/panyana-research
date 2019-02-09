<template>
  <div class="upload-btn"> 
    <input
      :id="id"
      ref="fileInput"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      @change="fileChanged"
    >
    <label
      v-if="ripple"
      :id="`label${id}`"
      v-ripple
      :for="id"
      :class="`v-btn ${classes}${color} upload-btn`"
    >
      <slot name="icon-left" />
      {{ icon ? '' : title }}
      <slot name="icon" />
    </label>
    <label
      v-else
      :id="`label${id}`"
      :for="id"
      :class="`v-btn ${classes}${color} upload-btn`"
    >
      <slot name="icon-left" />
      {{ icon ? '' : title }}
      <slot name="icon" />
    </label>
  </div>
</template>

<script>
export default {
  name: 'UploadButton',
  props: {
    accept: {
      default: '*',
      type: String
    },
    page: {
      default: null,
      type: String
    },
    block: {
      default: false,
      type: Boolean
    },
    depressed: {
      default: false,
      type: Boolean
    },
    fileChangedCallback: {
      default: undefined,
      type: Function
    },
    color: {
      default: 'primary',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    },
    flat: {
      default: false,
      type: Boolean
    },
    hover: {
      default: true,
      type: Boolean
    },
    icon: {
      default: false,
      type: Boolean
    },
    large: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    },
    multiple: {
      default: false,
      type: Boolean
    },
    name: {
      default: 'uploadFile',
      type: String
    },
    outline: {
      default: false,
      type: Boolean
    },
    ripple: {
      default: true,
      type: Boolean
    },
    round: {
      default: false,
      type: Boolean
    },
    small: {
      default: false,
      type: Boolean
    },
    uniqueId: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      title: 'Upload'
    }
  },
  computed: {
    id() {
      return this.uniqueId ? `${this._uid}uploadFile` : 'uploadFile'
    },
    classes() {
      const classes = {
        'v-btn--block': this.block,
        'v-btn--flat': this.flat,
        'upload-btn-hover': this.hover,
        'v-btn--icon': this.icon,
        'v-btn--large': this.large,
        'v-btn--loading': this.loading,
        'v-btn--outline v-btn--depressed': this.outline,
        'v-btn--round': this.round,
        'v-btn--small': this.small,
        'v-btn--disabled': this.disabled,
        'v-btn--depressed': this.depressed
      }

      // eslint-disable-next-line
      if (this.flat) this.color = ''

      let classString = ''
      for (const key in classes) {
        if (classes[key]) {
          classString += `${key} `
        }
      }
      return classString
    }
  },
  methods: {
    fileChanged(e) {
      if (e) {
        if (this.fileChangedCallback) {
          if (e.target.files) {
            if (!this.multiple && e.target.files[0]) {
              this.fileChangedCallback(e.target.files[0], this.page)
            } else if (this.multiple) {
              this.fileChangedCallback(e.target.files, this.page)
            } else {
              this.fileChangedCallback(null, this.page)
            }
          } else {
            this.fileChangedCallback(null, this.page)
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.upload-btn {
  padding-left: 16px;
  padding-right: 16px;
  width: 200px;

  .v-icon {
    margin-right: 5px;
  }
}

.upload-btn input[type='file'] {
  position: absolute;
  height: 0.1px;
  width: 0.1px;
  overflow: hidden;
  opacity: 0;
  z-index: -1;
}

.upload-btn-hover {
  cursor: pointer;
}
</style>
