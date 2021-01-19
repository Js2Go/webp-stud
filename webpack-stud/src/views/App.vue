<template>
  <div class="cj_box">
    <div class="line_item" :class="index == 1 ? 'active' : 'white_item'">
      <div>洗碗</div>
    </div>
    <div class="line_item" :class="index == 2 ? 'active' : 'white_item'">
      <div>买菜</div>
    </div>
    <div class="line_item" :class="index == 3 ? 'active' : 'white_item'">
      <div>赠送十次</div>
    </div>
    <div class="line_item" :class="index == 0 ? 'active' : 'white_item'">
      <div>做饭</div>
    </div>
    <div class="line_item" @click="goLottery()">
      立即挑选
    </div>
    <div class="line_item" :class="index == 4 ? 'active' : 'white_item'">
      <div>拖地</div>
    </div>
    <div class="line_item" :class="index == 7 ? 'active' : 'white_item'">
      <div>赠送十次</div>
    </div>
    <div class="line_item" :class="index == 6 ? 'active' : 'white_item'">
      <div>待着</div>
    </div>
    <div class="line_item" :class="index == 5 ? 'active' : 'white_item'">
      <div>洗衣服</div>
    </div>
  </div>
</template>
<script>
export default{
  data() {
    return {
      index: 3,    // 当前转动到哪个位置，起点位置
      count: 8,    // 总共有多少个位置
      timer: 0,    // 每次转动定时器
      speed: 200,   // 初始转动速度
      times: 0,    // 转动次数
      cycle: 30,   // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prizes: 3,   // 中奖位置
      prize: [0,1,2,3,4,5,6,7],   // 奖品位置
    }
  },
   methods: {
    goLottery() {
    //判断如果抽奖停止后才可以再次点击
      if(this.speed == 200) {
        this.prizes = this.prize[Math.floor((Math.random() * this.prize.length))]
        console.log(this.prizes)
        this.startRoll();
      }
    },
    // 开始转动
    startRoll() {
      this.times += 1  // 转动次数
      this.oneRoll()  // 转动过程调用的每一次转动方法，这里是第一次调用初始化
      this.usePrize()
    },
    // 每一次转动
    oneRoll() {
      let index = this.index  // 当前转动到哪个位置
      const count = 8  // 总共有多少个位置
      index += 1
      if (index > count - 1) {
        index = 0
      }
      this.index = index
    },
    usePrize() {
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prizes === this.index) {
        clearTimeout(this.timer)   // 清除转动定时器，停止转动
        this.times = 0
        this.speed = 200    //速度初始化
      } else {
        if (this.times < this.cycle) {
          this.speed -= 5   // 加快转动速度
        }
        this.timer = setTimeout(this.startRoll, this.speed)
      }
    }
  }
}
</script>
 
<style lang="scss">
  .cj_box {
    width: 300px;
    display: block;
    margin: 0 auto;
  }
 
  .line_item {
    width: 100px;
    height: 100px;
    line-height: 100px;
    background-color: red;
    float: left;
  }
 
  .active {
    background-color: #fffea5 !important;
  }
 
  .white_item {
    background-color: #fff;
  }
</style>