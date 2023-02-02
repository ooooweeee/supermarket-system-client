<template>
  <a-layout class="goods-page">
    <a-layout-content class="goods-content goods-list">
      <a-row :gutter="[0, 10]">
        <template v-if="goodsList.length > 0">
          <a-col :span="24" v-for="item in goodsList" :key="item.id">
            <a-card :title="item.name">
              <a-card-grid
                v-for="i in item.goods"
                :key="i.id"
                @click="selectGoods(i)"
                class="goods-item hand"
              >
                <a-image
                  class="goods-pic"
                  :width="50"
                  :height="50"
                  src=""
                  fallback="/fallback.png"
                  :preview="false"
                />
                <a-statistic
                  :title="i.name"
                  :value="i.salePrice"
                  prefix="¥"
                  :value-style="{ 'font-size': '16px' }"
                >
                </a-statistic>
              </a-card-grid>
            </a-card>
          </a-col>
        </template>
        <a-col v-else> sss </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-content class="goods-content shopping-car">
      <a-list item-layout="horizontal" :data-source="shoppingCar">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :title="item.name">
              <template #avatar>
                <a-image
                  class="goods-pic"
                  :width="50"
                  :height="50"
                  src=""
                  fallback="/fallback.png"
                  :preview="false"
                />
              </template>
              <template #description>
                <a-input-group compact>
                  <a-button @click="removeGoods(item)" size="small">-</a-button>
                  <a-input
                    :value="item.num"
                    readonly
                    size="small"
                    style="width: calc(100% - 160px); text-align: center"
                  />
                  <a-button @click="selectGoods(item)" size="small">+</a-button>
                </a-input-group>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
      <a-popover v-model:visible="paying" trigger="click" placement="topRight">
        <template #content>
          <div style="text-align: right">
            <p>支付订单共计：¥{{ order }}</p>
            <a-button @click="pay()" type="primary" size="small">支付</a-button>
          </div>
        </template>
        <a-button class="buy-submit" type="primary" shape="circle" size="large">
          <template #icon>
            <shopping-outlined />
          </template>
        </a-button>
      </a-popover>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import {
  Layout,
  Row,
  Col,
  Card,
  Image,
  Statistic,
  List,
  Input,
  Button,
  message,
  Popover,
  notification
} from 'ant-design-vue';
import { ShoppingOutlined } from '@ant-design/icons-vue';

message.config({
  maxCount: 1
});

export default defineComponent({
  components: {
    [Layout.name]: Layout,
    [Layout.Content.name]: Layout.Content,
    [Row.name]: Row,
    [Col.name]: Col,
    [Card.name]: Card,
    [Card.Grid.name]: Card.Grid,
    [Image.name]: Image,
    [Statistic.name]: Statistic,
    [List.name]: List,
    [List.Item.name]: List.Item,
    [List.Item.Meta.name]: List.Item.Meta,
    [Input.name]: Input,
    [Input.Group.name]: Input.Group,
    [Button.name]: Button,
    [Popover.name]: Popover,
    ShoppingOutlined
  },
  setup() {
    const store = useStore();
    const goodsList = ref([]);
    const shoppingCar = ref([]);
    const paying = ref(false);

    function getData() {
      window.ipcRenderer.invoke('api/goods').then(({ data } = {}) => {
        console.log(data);
        goodsList.value = data.reduce((result, current) => {
          const index = result.findIndex(
            item => item.id === current.dh_category_id
          );
          if (index === -1) {
            result.push({
              id: current.dh_category_id,
              name: current.dh_category_name,
              goods: [
                {
                  id: current.dh_goods_id,
                  name: current.dh_goods_name,
                  salePrice: current.dh_goods_sale_price,
                  store: current.dh_goods_store
                }
              ]
            });
          } else {
            const tmp = result[index];
            tmp.goods.push({
              id: current.dh_goods_id,
              name: current.dh_goods_name,
              salePrice: current.dh_goods_sale_price,
              store: current.dh_goods_store
            });
            result.splice(index, 1, tmp);
          }
          return result;
        }, []);
      });
    }

    onMounted(() => {
      getData();
    });

    return {
      order: computed(() => {
        return shoppingCar.value.reduce((result, current) => {
          return (result += current.salePrice * current.num);
        }, 0);
      }),
      goodsList,
      shoppingCar,
      paying,
      selectGoods(query) {
        const index = shoppingCar.value.findIndex(item => item.id === query.id);
        const { num } = shoppingCar.value[index] || { num: 0 };

        if (query.store <= 0 || num >= query.store) {
          message.error(`${query.name} 库存不足`);
          return;
        }
        if (index >= 0) {
          shoppingCar.value.splice(index, 1, { ...query, num: num + 1 });
        } else {
          shoppingCar.value.push({ ...query, num: 1 });
        }
      },
      removeGoods(query) {
        const index = shoppingCar.value.findIndex(item => item.id === query.id);
        const { num } = shoppingCar.value[index];

        if (num - 1 <= 0) {
          shoppingCar.value.splice(index, 1);
        } else {
          shoppingCar.value.splice(index, 1, { ...query, num: num - 1 });
        }
      },
      pay() {
        if (shoppingCar.value.length <= 0) {
          return;
        }
        window.ipcRenderer
          .invoke(
            'api/goods/sale',
            shoppingCar.value.map(item => {
              return {
                id: item.id,
                name: item.name,
                num: item.num,
                remain: item.store - item.num,
                userId: store.state.userId
              };
            })
          )
          .then(() => {
            paying.value = false;
            shoppingCar.value = [];
            getData();
            notification.success({
              message: '支付成功'
            });
          });
      }
    };
  }
});
</script>

<style lang="less">
.goods-page {
  flex-direction: row;

  .goods-content {
    box-sizing: border-box;
    padding: 10px;

    .goods-item {
      display: grid;
      grid-template-columns: 50px 1fr;
      column-gap: 10px;
    }
  }

  @shoppingCarWidth: 280px;
  .goods-list {
    width: calc(100% - @shoppingCarWidth);
  }
  .shopping-car {
    width: @shoppingCarWidth;
    background-color: #ffffff;

    .buy-submit {
      position: fixed;
      right: 20px;
      bottom: 100px;
    }
  }
}
</style>
