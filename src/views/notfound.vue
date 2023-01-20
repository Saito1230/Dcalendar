<template>
  <div id="content">
    <div id="login">
      <div id="text">
        <h2>ページが見つかりませんでした。</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notfound'
}
</script>

<style scoped>
#content{
  display: grid;
  grid-template-rows: 200px auto 200px;
  grid-template-columns: 1fr 2fr 1fr;
  justify-items: center;
  align-items: center;
}

#login{
  grid-column: 2/3;
  grid-row: 2/3;
}

</style>
