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
          <a-card-meta
            :title="item.name"
            description="This is the description"
          />
        </a-card>
      </a-col>
    </a-row>
    <a-modal
      v-model:visible="visible"
      title="创建商品品类"
      :footer="null"
      :destroyOnClose="true"
    >
      <CreateCategory @create-success="createCategory()" />
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
  Modal
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
    CreateCategory
  },
  setup() {
    const visible = ref(false);
    const catagories = ref([]);

    function getData() {
      window.ipcRenderer
        .invoke('api/categories')
        .then(({ code, msg, data } = {}) => {
          if (code !== 0) {
            throw msg;
          }
          catagories.value = data.map(item => {
            return {
              id: item.dh_category_id,
              name: item.dh_category_name
            };
          });
        })
        .catch(err => {
          console.error('error is ', err);
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
