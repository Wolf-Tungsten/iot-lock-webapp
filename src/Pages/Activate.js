import React from 'react'
import { NavBar, Icon, WhiteSpace, WingBlank, Button } from 'antd-mobile';
import QRcode from 'qrcode.react'
import './Activate.css'
export default class ActivatePage extends React.Component {
    render(){
        return (
            <div>
                <NavBar
                mode="dark"
            >激活新设备</NavBar>
            <WhiteSpace></WhiteSpace>
            <WingBlank>
                
            </WingBlank>
            <WingBlank>
                <div className="flex-center">
                    <p className="main-hint">请将以下二维码展示给门禁设备</p>
                    <QRcode size={200} bgColor="#f5f5f9" value={JSON.stringify({sessionKey:window.sessionKey})}/>
                    <p className="secondary-hint">对于未激活的门禁设备，该操作将授权您成为管理员，您将有权限管理其他人员的访问限制。
                    对于已激活的门禁设备，该操作会将您的申请信息提交给设备管理员以审核。
                    </p>
                    
                </div>
                <Button type="primary" onClick={()=>{this.props.history.goBack()}}>返回设备列表</Button>
            </WingBlank>
            </div>
        )
    }
}