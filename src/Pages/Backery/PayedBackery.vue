<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="closeModal()">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal()" />
        <h2>Tolov qilish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="price">To`lov</label>
              <input
                type="number"
                id="price"
                v-model="bakcery.price"
                placeholder="To`lov priceni tanlang"
                @blur="validateField('price')"
              />
              <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
            </div>

            <div class="form-group">
              <label for="statusId">To`lov holati</label>
              <CustomSelectVue
                :placeholder="'To`lov holatini kiriting'"
                id="statusId"
                @input="sellectPayedState($event)"
                :options="payedStatus"
                @blur="validateField('statusId')"
              />
              <p v-if="errors.statusId" class="error-text">
                {{ errors.statusId }}
              </p>
            </div>

            <div class="form-group relative">
              <label for="typeId">To`lov turi</label>
              <CustomSelectVue
                :placeholder="'To`lov turini tanlang'"
                id="typeId"
                @input="sellectPayedType($event)"
                :options="payedType"
                @blur="validateField('typeId')"
              />
              <p v-if="errors.typeId" class="error-text">{{ errors.typeId }}</p>
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
            {{ isSubmitting ? "Yaratilmoqda..." : "Yaratish" }}
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
    selectedItemPayed: String,
  },
  data() {
    return {
      bakcery: {
        type: "",
        price: 0,
        status: "",
      },
      errors: {},
      isSubmitting: false,

      payedStatus: [{ text: "Bonus", value: "Bonus" }],
      payedType: [
        { text: "To`landi", value: "To`landi" },
        { text: "To`lanmoqda", value: "To`lanmoqda" },
      ],
      payedStatus: [
        {
          text:"To'landi",
          value:"To'landi"
        },
        {
          text:"To'landi",
          value:"To'landi"
        },
      ],
      payedType: [
        {
          text:"Bonus",
          value:"Bonus"
        },
        {
          text:"Shtraf",
          value:"Shtraf"
        },
        {
          text:"Kunlik",
          value:"Kunlik"
        }
      ],
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    // getPayedStates() {
    //   api
    //     .get("/api/payedStatuses")
    //     .then(({ status, data }) => {
    //       if (status === 200) {
    //         this.payedStatus = data?.payedStatus.map((item) => {
    //           return { text: item.status, value: item._id };
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },
    // getPayedType() {
    //   api
    //     .get("/api/typeOfPayeds")
    //     .then(({ status, data }) => {
    //       if (status === 200) {
    //         console.log(this.payedType);

    //         this.payedType = data?.typeOfPayeds.map((item) => {
    //           return { text: item.type, value: item._id };
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },
    sellectPayedState(id) {
      this.bakcery.status = id;
    },
    sellectPayedType(id) {
      this.bakcery.type = id;
    },
    validateField(field) {
      this.errors[field] = "";
      if (
        field === "price" &&
        (!this.bakcery.price || isNaN(this.bakcery.price))
      ) {
        this.errors.price = "Tandir raqami raqam bo‘lishi kerak";
      }
      if (field === "type" && !this.bakcery.type.trim()) {
        this.errors.type = "To`lov turi bo'sh bo'lmasligi kerak";
      }
      if (field === "status" && !this.bakcery.status.trim()) {
        this.errors.status = "To`lov holati turi bo'sh bo'lmasligi kerak";
      }
    },
    submitForm() {
      this.errors = {};
      this.validateField("price");
      this.validateField("typeId");
      this.validateField("statusId");

      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }

      this.isSubmitting = true;

      api
        .post("/api/sellerPayed", this.bakcery)
        .then(({ status }) => {
          if (status === 201) {
            this.$emit("status", {
              status: "success",
              message: "seller payed qilindi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "seller payed qilinayotganida hatolik yuz berdi",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.$emit("status", {
            status: "error",
            message: "seller payed qilinayotganida hatolik yuz berdi",
          });
        });
    },
  },
  mounted() {
    // this.getPayedStates();
    // this.getPayedType();
    this.bakcery.sellerId = this?.selectedItemPayed;
  },
};
</script>

<style>
</style>