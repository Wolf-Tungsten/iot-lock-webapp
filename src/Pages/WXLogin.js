import React from 'react'
import './WXLogin.css'
import weixinlogo from '../static/weixin.svg'

export default class WXLogin extends React.Component {
    constructor(props){
        super(props)

    }

    render(){
        return <div id="wx-login">
            <img src={weixinlogo} />
            <div className="hint">微信认证中</div>
        </div>
        
    }
}