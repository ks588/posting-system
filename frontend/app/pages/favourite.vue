<script setup>
import { ref } from 'vue'
import WritePostCard from '~/components/WrtiePostCard.vue'
import LoginRegisterChooseCard from '~/components/LoginRegisterChooseCard.vue'
import RegisterCard from '~/components/RegisterCard.vue'
import LoginCard from '~/components/LoginCard.vue'

const showModal = ref(false)
const choose = ref(false)
const login = ref(false)
const register = ref(false)

function writeCard() {
  showModal.value = !showModal.value
}

function LoginRegisterChoose() {
  choose.value = !choose.value
}

function Login() {
  login.value = !login.value
}

function Register() {
  register.value = !register.value
}

</script>

<template>
  <div>
    <button  @click="writeCard" 
    class="m-10 border border-black rounded-xl bg-black text-white hover:border border-black rounded-xl px-4 hover:text-black hover:bg-white" >
    Create Post Test Button
    </button>

    <button  @click="LoginRegisterChoose" 
    class="m-10 border border-black rounded-xl bg-black text-white hover:border border-black rounded-xl px-4 hover:text-black hover:bg-white" >
    Login/Register Choose Test Button
    </button>

    <button  @click="Login" 
    class="m-10 border border-black rounded-xl bg-black text-white hover:border border-black rounded-xl px-4 hover:text-black hover:bg-white" >
    Login Test Button
    </button>

    <button  @click="Register" 
    class="m-10 border border-black rounded-xl bg-black text-white hover:border border-black rounded-xl px-4 hover:text-black hover:bg-white" >
    Register Choose Test Button
    </button>


    <WritePostCard v-if="showModal" @close="writeCard"></WritePostCard>
    <LoginRegisterChooseCard v-if="choose" @close="LoginRegisterChoose"></LoginRegisterChooseCard>
    <LoginCard v-if="login" @close="Login"></LoginCard>
    <RegisterCard v-if="register" @close="Register"></RegisterCard>
    
  </div>
</template>
