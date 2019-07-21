<template>
  <div>
    <van-nav-bar
      title="个人信息"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="$router.back()"
      @click-right="handleSave"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="handleShowFile">
        <div slot="default">
          <img :src="user.photo" width="30">
        </div>
        <input ref="file" type="file" style="display:none;">
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link />
      <van-cell title="性别" :value="user.gender" is-link />
      <van-cell title="生日" :value="user.birthday" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserProfile, updateUserProfile, updateUserProfilePhoto } from '@/api/user'
export default {
  name: 'UserSettings',
  data () {
    return {
      user: {}
    }
  },
  computed: {
    file () {
      return this.$refs['file']
    }
  },
  created () {
    this.loadUser()
  },
  mounted () {
    this.file.addEventListener('change', this.handnleFileChange)
    // this.$refs['file'].addEventListener('change', this.handnleFileChange)
  },
  methods: {
    async handleSave () {
      try {
        // const data = await updateUserProfile(this.user)
        // // console.log(data)
        // this.$toast.fail('更新用户信息成功')

        // 1.请求上传图片
        const r1 = this.uploadPhoto()
        // console.log(data)

        // 2.请求更新用户信息
        const r2 = updateUserProfile({
          name: this.user.name,
          gender: this.user.gender,
          birthday: this.user.birthday
        })
        // 为了让r1和r2同步执行,
        // 异步串行
        // await r1
        // await r2

        // 异步并行
        // r1
        // r2

        // 如果需要几个并发异步任务都执行结束之后做处理，则使用Promise.all([r1, r2])，还是返回promise，结果是一个数组，数组安装任务的顺序存储每个任务的执行结果

        const data = Promise.all([r1, r2])
        console.log(data)
        this.$toast('更新成功')
      } catch (err) {
        this.$toast.fail('更新用户信息失败')
      }
    },
    async loadUser () {
      try {
        this.user = await getUserProfile()
      } catch (err) {
        this.$toast.fail('加载用户信息失败')
      }
    },
    uploadPhoto () {
      // Content-Type 为 multipart/form-data 需要传递 FormData
      const fromData = new FormData()
      fromData.append('photo', this.file.files[0])
      return updateUserProfilePhoto(FormData)
    },
    handleShowFile () {
      this.$refs['file'].click()
    },
    handnleFileChange () {
      // 服务端不支持base64
      // 图片转成base64-file格式
      // const file = this.$refs['file'].files[0]
      const file = this.file.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        this.user.photo = reader.result
      })
    }
  }
}
</script>

<style>
</style>
