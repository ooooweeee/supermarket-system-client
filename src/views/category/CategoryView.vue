<template>
  <a-page-header title="商品品类" sub-title="This is a subtitle">
    <template #extra>
      <a-button v-if="catagories.length" @click="visible = true" type="primary">
        创建
      </a-button>
    </template>
  </a-page-header>
  <a-layout-content
    :class="['categories-content', !catagories.length && 'is-empty']"
  >
    <a-empty v-if="!catagories.length">
      <template #description>暂无品类</template>
      <a-button type="primary" @click="visible = true">创建</a-button>
    </a-empty>
    <a-row v-else :gutter="[16, 16]">
      <a-col v-for="item in catagories" :key="item.id" :span="8">
        <a-card hoverable>
          <template #cover>
            <a-image
              class="categories-pic"
              :height="195"
              src=""
              fallback="/fallback.png"
              :preview="false"
            />
          </template>
          <a-card-meta>
            <template #title>
              {{ item.name }}
              <a-tag color="red" v-if="item.state">禁售</a-tag>
            </template>
            <template #description>This is the description</template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
    <a-modal
      v-model:visible="visible"
      title="创建商品品类"
      :footer="null"
      :destroyOnClose="true"
    >
      <create-category @create-success="createCategory()" />
    </a-modal>
  </a-layout-content>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import {
  Layout,
  PageHeader,
  Col,
  Row,
  Card,
  Image,
  Empty,
  Button,
  Modal,
  Tag
} from 'ant-design-vue';
import CreateCategory from '@/components/CreateCategory.vue';

export default defineComponent({
  components: {
    [PageHeader.name]: PageHeader,
    [Layout.Content.name]: Layout.Content,
    [Col.name]: Col,
    [Row.name]: Row,
    [Card.name]: Card,
    [Card.Meta.name]: Card.Meta,
    [Image.name]: Image,
    'a-empty': Empty,
    [Button.name]: Button,
    [Modal.name]: Modal,
    CreateCategory,
    [Tag.name]: Tag
  },
  setup() {
    const visible = ref(false);
    const catagories = ref([]);

    function getData() {
      window.ipcRenderer.invoke('api/categories').then(({ data } = {}) => {
        catagories.value = data.map(item => {
          return {
            id: item.dh_category_id,
            name: item.dh_category_name,
            state: item.dh_category_state === 0
          };
        });
      });
    }

    onMounted(() => {
      getData();
    });

    return {
      visible,
      catagories,
      createCategory() {
        visible.value = false;
        getData();
      }
    };
  }
});
</script>

<style lang="less">
.categories-content {
  box-sizing: border-box;
  padding: 10px;
  overflow: overlay;

  .categories-pic {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.is-empty {
    display: grid;
    align-items: center;
  }
}
</style>
