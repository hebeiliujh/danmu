# 气泡弹幕

### 安装

npm i @beige/danmu

### 使用

> 生成实例

```
  const danmuIns = Danmu.createLibrary({
    el: '#danmu-container',
    color: '#ccc'
  })
```

| 参数  |      说明      |        示例        |
| :---: | :------------: | :----------------: |
|  el   | 插入页面的元素 | '#danmu-container' |
| color |  默认文字颜色  |       '#999'       |

> 发送 【单条数据】

```
const item = {
  text: '你真棒！',
  color: '',
  icon: 'http://localhost:8080/assets/icons/beishang.svg'
}
danmuIns.shootDanmu(item)
```

| 参数  |     说明     |                示例                 |
| :---: | :----------: | :---------------------------------: |
| text  |   弹幕文字   |             '你真棒！'              |
| color | 单条文字颜色 |                'red'                |
| icon  |  单条小图标  | 'http://host:port/path/to/icon.svg' |

> 发送 【多条数据】

```
const arr = [{
  text: '你真棒！',
  color: '',
  icon: 'http://localhost:8080/assets/icons/beishang.svg'
}, {
  text: '下次一定',
  color: '',
  icon: 'http://localhost:8080/assets/icons/beishang.svg'
}]
danmuIns.shootDanmu(arr)
```
