<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content scroll relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Nonvoy yaratish</h2>

        <form>
          <div class=" d-flex column gap12 scroll" style="height: 80%">
            <div
              class="modal-form-2"
              v-for="(data, index) in count"
              :key="index"
            >
              <div class="form-group">
                <label for="bread">Non turini tanlang</label>
                <CustomSelectVue
                  :search="true"
                  :options="
                    allTypeOfBread.map((item) => {
                      return { text: item.title, value: item };
                    })
                  "
                  id="bread"
                  :selected="data?.breadId"
                  @input="selectBread($event, index)"
                  @blur="validateArrayField('breadId', index)"
                />
                <p v-if="data?.errors.breadId" class="error-text">
                  {{ data?.errors.breadId }}
                </p>
              </div>
              <div class="form-group">
                <label for="quantity">Qop Narxi</label>
                <input
                  id="price"
                  type="number"
                  placeholder="Rasxod narxi"
                  v-model="data.price"
                  readonly
                />
                <!-- <p v-if="errors.price" class="error-text">
                {{ errors.price }}
              </p> -->
              </div>
              <div class="form-group">
                <label for="quantity">Qop Sonni</label>
                <input
                  id="price"
                  type="number"
                  placeholder="Rasxod narxi"
                  v-model="data.qopQuantity"
                  @blur="validateArrayField('qopQuantity', index)"
                />
                <p v-if="data.errors.qopQuantity" class="error-text">
                  {{ data.errors.qopQuantity }}
                </p>
              </div>
              <div style="display: flex; align-items: end" class="gap12">
                <div class="form-group" style="width: 95%">
                  <label for="quantity">Soni (Dona)</label>
                  <input
                    id="quantity"
                    type="number"
                    placeholder="Rasxod sonini kiriting"
                    v-model="data.quantity"
                    @blur="validateArrayField('quantity', index)"
                  />
                  <p v-if="data?.errors.quantity" class="error-text">
                    {{ data?.errors.quantity }}
                  </p>
                </div>
                <Icons
                  name="deleted"
                  title="o'chirish"
                  class="icon danger"
                  @click="deleteRow(data?.id)"
                  v-if="count.length>1"
                />
              </div>
            </div>
            <div class="d-flex j-end">
              <button
                type="button"
                class="create-button"
                @click="
                  count.push({
                    id: count.length,
                    breadId: '',
                    quantity: 0,
                    price: 0,
                    errors: {},
                  })
                "
              >
                Qo`shish
              </button>
            </div>
          </div>
          <div class="modal-form">
            <div class="form-group">
              <label for="description">Description</label>
              <input
                id="description"
                type="text"
                v-model="bread.description"
                placeholder="Foydalanuvchi nomini kiriting"
                @blur="validateField('description')"
              />
              <p v-if="errors.description" class="error-text">
                {{ errors.description }}
              </p>
            </div>

            <div class="form-group">
              <label for="qopQuantity">totalPrice</label>
              <input
                id="qopQuantity"
                type="number"
                placeholder="Qop sonini kiriting"
                v-model="totalPrice"
                readonly
              />
            </div>

              <div class="form-group">
              <label for="qopQuantity">totalPrice</label>
              <input
                id="qopQuantity"
                type="number"
                v-model="totalPrice2"
                readonly
              />
            </div>
              <div class="form-group">
              <label for="qopQuantity">totalPrice</label>
              <input
                id="qopQuantity"
                type="number"
                v-model="totalQuantity"
                readonly
              />
            </div>
          </div>
        </form>
        <div class="modal-buttons d-flex j-end a-center gap24">
          <button type="button" class="action-button" @click="closeModal">
            Chiqish
          </button>
          <button
            type="button"
            @click="submitForm()"
            class="action-button"
            :disabled="isSubmitting"
          >
            {{
              !isUpdate
                ? isSubmitting
                  ? "Yaratilmoqda..."
                  : "Yaratish"
                : isSubmitting
                ? "Yangilanyapti..."
                : "Yangilash"
            }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import CustomSelectVue from "@/components/Template/customSelect.vue";
export default {
  components: {
    Icons,
    CustomSelectVue,
  },
  props: {
    update: {
      type: Object,
    },
  },
  data() {
    return {
      isSubmitting: false,
      bread: {
        description: "",
      },
      errors: {},
      isUpdate: false,
      allTypeOfBread: [],
      count: [
        {
          id: 0,
          breadId: "",
          quantity: 0,
          qopQuantity: 0,
          price: 0,
          errors: {},
        },
      ],
    };
  },
  computed: {
    totalPrice() {
      return this.count.reduce((sum, item) => sum + item.qopQuantity, 0);
    },
    totalQuantity(){
      return this.count.reduce((a,b)=>a + b.quantity,0)
    },
    totalPrice2(){
      return this.count.reduce((a,b)=>a + b.price,0)
    }
  },
  methods: {
    deleteRow(id) {
      if (this.count.length > 1) {
        this.count = this.count.filter((item) => item.id !== id);
      }
    },
    validateArrayField(field, index) {
      this.count = this.count.map((item) => {
        if (item.id === index) {
          item.errors[field] = "";
          if (field === "breadId" && !item.breadId.trim()) {
            item.errors.breadId = "Noni turini tanlang";
          }
          if (
            field === "quantity" &&
            (isNaN(item.quantity) || item.quantity <= 0)
          ) {
            item.errors.quantity = "Soni (Dona) musbat son bo‘lishi kerak";
          }
          if (
            field === "qopQuantity" &&
            (!item.qopQuantity ||
              isNaN(item.qopQuantity) ||
              item.qopQuantity <= 0)
          ) {
            this.errors.qopQuantity = "Soni (Dona) musbat son bo‘lishi kerak";
          }
          return { ...item };
        } else {
          return item;
        }
      });
    },
    selectBread(id, index) {
      console.log(this?.allTypeOfBread[index]?.price);
      this.count = this.count.map((item) =>
        item.id === index
          ? {
              ...item,
              breadId: id._id,
              price: id.price,
            }
          : item
      );
    },
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "description" && !this.bread.description.trim()) {
        this.errors.description =
          "Foydalanuvchi description bo'sh bo'lmasligi kerak";
      }
      if (
        field === "ovenId" &&
        (!this.bread.ovenId || isNaN(this.bread.ovenId))
      ) {
        this.errors.ovenId = "Tandir raqami raqam bo‘lishi kerak";
      }
      //  if (
      //   field === "password" &&
      //   (!this.user.password || isNaN(this.user.password))
      // ) {
      //   this.errors.password = "Foydalanuvchi paroli bo‘lishi bo`lmasligi kerak";
      // }
      if (
        field === "price" &&
        (!this.user.price || isNaN(this.user.price) || this.user.price < 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }

      if (
        field === "quantity" &&
        (!this.bread.quantity ||
          isNaN(this.bread.quantity) ||
          this.bread.quantity <= 0)
      ) {
        this.errors.quantity = "Soni (Dona) musbat son bo‘lishi kerak";
      }

      if (
        field === "qopQuantity" &&
        (!this.bread.qopQuantity ||
          isNaN(this.bread.qopQuantity) ||
          this.bread.qopQuantity <= 0)
      ) {
        this.errors.qopQuantity = "Soni (Dona) musbat son bo‘lishi kerak";
      }
      // qopQuantity
    },
    async submitForm() {
      this.errors = {};
      this.validateField("quantity");
      this.validateField("qopQuantity");

      if (!Object.keys(this.errors).length) {
        return;
      }

      this.isSubmitting = true;
      if (!this.isUpdate) {
        try {
          const response = await api.post("/api/sellerBread", {
            ...this.bread,
            typeOfBreadId: this.count.map((item) => {
              return {
                breadId: item.breadId,
                quantity: item.quantity,
                qopQuantity: item.qopQuantity,
              };
            }),
          });

          if (response?.status == 201) {
            this.$emit("status", {
              status: "success",
              message: "Nonvoy muvaffaqqiyatli qo'shildi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "Nonvoy qo'shishda hatolik",
            });
          }
          this.isSubmitting = false;
        } catch (error) {
          this.$emit("status", {
            status: "error",
            message:
              error.response?.data?.message ||
              error.message ||
              "Xatolik yuz berdi",
          });
        } finally {
          this.isSubmitting = false;
        }
      } else {
        try {
          const response = await api.put(
            "/api/sellerBread/" + this?.update?._id,
            {
              ...this.bread,
              typeOfBreadId: this.count.map((item) => {
                return {
                  breadId: item.breadId,
                  quantity: item.quantity,
                  qopQuantity: item.qopQuantity,
                };
              }),
            }
          );
          if (response?.status == 200) {
            this.$emit("status", {
              status: "success",
              message: "Nonvoy muvaffaqqiyatli yangilandi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "Nonvoy yangilanishida hatolik",
            });
          }
          this.isSubmitting = true;
        } catch (error) {
          this.$emit("status", {
            status: "error",
            message:
              error.response?.data?.message ||
              error.message ||
              "Xatolik yuz berdi",
          });
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    getallTypeOfBread() {
      api
        .get("/api/typeOfBreads")
        .then(({ data, status }) => {
          if (status === 200) {
            this.allTypeOfBread = data?.typeOfBreads;
            console.log(this.allTypeOfBread);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      console.log(this.update);
      this.bread = {
        name: this?.update?.name,
        description: this?.update?.description,
      };
      this.count = this.update.typeOfBreadId.map((item) => {
        return {
          breadId: item.breadId._id,
          quantity: item.quantity,
          qopQuantity: item.qopQuantity,
          price: item.breadId.price,
          errors: {},
        };
      });

      this.isUpdate = true;
    }
    this.getallTypeOfBread();
  },
};
</script>

<style scoped>
.modal-form-2 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 10px;
}

.error-text {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.xIcon {
  position: absolute;
  top: 50px;
  right: 100px;
  z-index: 101;
}

.xIcon > svg {
  width: 60px;
  height: 60px;
}
</style>
