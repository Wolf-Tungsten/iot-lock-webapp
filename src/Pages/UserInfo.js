import React from 'react'
import { List, InputItem ,WhiteSpace, WingBlank, Button, NavBar, Toast} from 'antd-mobile';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

export default class UserInfo extends React.Component {

constructor(props){
    super(props)
    this.state = {
        username:"",
        phoneNumber:""
    }
    this.update = this.update.bind(this)
}

async update(){
    if (!(this.state.username && this.state.phoneNumber)){
        Toast.fail("请填写完整")
        return
    }
    Toast.loading("更新用户信息", 0)
    let res = await window.axios.post('/user/', {
        name:this.state.username,
        phoneNumber:this.state.phoneNumber
    })
    Toast.hide()
    if(res.data && res.data.success) {
        let location={pathname:'/activate'}; 
        this.props.history.replace(location)
    }
}

render(){
    return(<div>
        <NavBar
                mode="dark"
            >补全用户信息</NavBar>
        <List renderHeader={() => '补充您的个人信息'}>
          <InputItem
            clear
            placeholder="请输入您的姓名"
            onChange={(v) => {this.setState({username:v})}}
          >姓名</InputItem>
        <InputItem
            clear
            placeholder="请输入您的手机号码"
            onChange={(v) => {this.setState({phoneNumber:v})}}
          >手机号码</InputItem>
          <List.Item>
            <div
              style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}
              onClick={this.update}
            >
              提交
            </div>
          </List.Item>
        </List>
    </div>)
}
}