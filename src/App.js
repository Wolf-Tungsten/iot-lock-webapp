import React from 'react';
import './App.css';
import qs from 'querystring'
import axios from 'axios'
import { HashRouter, Route, Link } from 'react-router-dom'
import WXLogin from './Pages/WXLogin'
import DeviceList from './Pages/DeviceList'
import Activate from './Pages/Activate'
import UserInfo from './Pages/UserInfo'
import Unlock from './Pages/Unlock'
import 'antd-mobile/dist/antd-mobile.css'

window.srvUrl = "https://lock.wolf-tungsten.com/api/app"
window.appUrl = "https://lock.wolf-tungsten.com/"
window.sessionKey = ""

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {login:false}
    ;(async ()=>{
      // 开始授权登录流程
      let wxAuth = qs.parse(window.location.search.substring(1))
      if (wxAuth.code) {
        
        let res = await axios.post(`${window.srvUrl}/auth/`, {code:wxAuth.code}, {})
        console.log(res)
        console.log('认证成功')
        if(res.data.success){
          // 认证成功，初始化axios
          window.sessionKey = res.data.result
          window.axios = axios.create({
            baseURL:window.srvUrl,
            headers:{
              'session-token':res.data.result
            }
          })
          this.setState({login:true})
          return
        }
      } 
      window.location = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx71612afa5a5e61a8&redirect_uri=${encodeURI(window.appUrl)}&response_type=code&scope=snsapi_base&state=#wechat_redirect`
    })()
  }

  render(){
    if(this.state.login) {
      return <HashRouter>
        <Route exact path="/" component={DeviceList}/>
        <Route path="/activate" component={Activate}/>
        <Route path="/userinfo" component={UserInfo}/>
        <Route path="/unlock" component={Unlock}/>
      </HashRouter>
    } else {
      return <WXLogin/>
    }

  }
  
}

export default App;
