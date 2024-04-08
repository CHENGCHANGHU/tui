<template>
  <div
    ref="drawerBox"
    :class="['drawer-box']"
    :style="{
      '--container-height': height,
    }"
    @click.self="handleClose"
  >
    <div ref="drawerContainer" class="drawer-container">
      <div class="drawer-title-box">
        <slot name="header">
          <div>{{ title }}</div>
          <EdsIcon class="close-icon" :svg="closeSvg" @click.stop.native="handleClose"/>
        </slot>
      </div>
      <div class="drawer-content-box">
        <slot name="content"></slot>
      </div>
      <div v-if="showFooter" class="drawer-footer-box">
        <slot name="footer">
          <EdsButton
            type="primary"
            size="large"
            class="confirm-button"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </EdsButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { EdsIcon, EdsButton } from 'eds-vue';
import { groupAnimate } from '@tui/util';
import closeSvg from 'root/asset/svg/close.svg';

const AnimationOptions = {
  fill: 'forwards',
  duration: 300,
  easing: 'ease-in-out',
};

export default {
  components: {
    EdsIcon,
    EdsButton,
  },
  props: {
    visible: Boolean,
    height: { type: String, default: '75%' },
    title: { type: String, default: 'title' },
    confirmText: { type: String, default: 'confirm' },
    showFooter: { type: Boolean, default: true },
  },
  data() {
    return {
      closeSvg,
      innerVisible: false,
    };
  },
  computed: {
    drawerBoxStyle() {
      return {
        'display': this.visible ? 'grid' : 'none',
        'grid-template-rows': `repeat(1, ${this.visible ? 1 : 0}fr)`,
      };
    },
  },
  watch: {
    visible(newValue) {
      this.innerVisible = newValue;
    },
    async innerVisible(newValue) {
      if (newValue) {
        this.$refs.drawerBox.style.display = 'flex';
        await groupAnimate([
          {
            el: this.$refs.drawerBox,
            keyframes: [
              { opacity: 0 },
              { opacity: 1 },
            ],
            options: AnimationOptions,
          },
          {
            el: this.$refs.drawerContainer,
            keyframes: [
              { transform: 'translateY(100%)' },
              { transform: 'translateY(0)' },
            ],
            options: AnimationOptions,
          },
        ]);
      } else {
        await groupAnimate([
          {
            el: this.$refs.drawerBox,
            keyframes: [
              { opacity: 1 },
              { opacity: 0 },
            ],
            options: AnimationOptions,
          },
          {
            el: this.$refs.drawerContainer,
            keyframes: [
              { transform: 'translateY(0)' },
              { transform: 'translateY(100%)' },
            ],
            options: AnimationOptions,
          },
        ]);
        this.$refs.drawerBox.style.display = 'none';
      }
    },
  },
  created() {
    this.innerVisible = this.visible;
  },
  mounted() {
    if (![...document.body.children].includes(this.$refs.drawerBox)) {
      const fragment = document.createDocumentFragment();
      fragment.appendChild(this.$refs.drawerBox);
      document.body.appendChild(fragment);
    }
  },
  beforeDestroy() {
    this.$refs.drawerBox.remove();
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handleConfirm() {
      this.$emit('confirm');
      this.innerVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  display: none;
  flex-flow: column nowrap;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  transition: all 3s ease-in-out;

  .drawer-container {
    position: relative;
    width: 100%;
    height: var(--container-height);
    background-color: #fff;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
  }

  .drawer-title-box {
    padding: 12px 12px 12px 48px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    color: rgba(0, 0, 0, 0.87);
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    border-bottom: 1px solid #E8E8E8;
    box-sizing: border-box;

    > :first-child {
      flex: 1;
    }

    .close-icon {
      width: 24px;
      height: 24px;
    }
  }

  .drawer-title-box > *:not(:first-child) {
    margin-left: 12px;
  }

  .drawer-content-box {
    height: 100%;
    padding: 0 16px 56px;
    overflow: auto;
    box-sizing: border-box;
  }

  .drawer-footer-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 8px;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0px -2px 10px #eee;

    .confirm-button {
      width: 100%;
    }
  }
}
</style>
