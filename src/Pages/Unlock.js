import React from 'react'
import { NavBar, Icon, WhiteSpace, WingBlank, Button, Toast, List} from 'antd-mobile';
import QRcode from 'qrcode.react'
import './Activate.css'

const Item = List.Item;
const Brief = Item.Brief;
export default class UnlockPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            uuid:"",
            key:"",
            failed:false,
            requestList:[],
            allowedList:[]
        }
        this.load = this.load.bind(this)
        this.refreshKey = this.refreshKey.bind(this)
    }

    componentDidMount(){
        this.load()
    }

    async load(){
        this.refreshKey()
        let device = this.props.location.state
        this.setState({
            uuid:device.uuid,
        })
        if(device.isAdmin && device.accessList){
            this.setState({
                requestList:device.accessList.filter(k => !k.allowed),
                allowedList:device.accessList.filter(k => k.allowed)
            })
        }
    }

    async refreshKey(){
        let device = this.props.location.state
        Toast.loading("获取钥匙",0)
        let key = await window.axios.get(`/admin/key?uuid=${device.uuid}`)
        Toast.hide()
        if(key.data.success){
            this.setState({key:key.data.result.key})
        } else {
            this.setState({failed:true})
        }
    }

    async refreshUser(){
        Toast.loading('更新用户权限信息', 0)
        let device = this.props.location.state
        let res = await window.axios.get('/admin/')
        Toast.hide()
        device = res.data.result.filter( k => k.uuid === device.uuid)[0]
        if(device.isAdmin && device.accessList){
            this.setState({
                requestList:device.accessList.filter(k => !k.allowed),
                allowedList:device.accessList.filter(k => k.allowed)
            })
        }
    }

    async allow(userId) {
        Toast.loading('正在授权', 0)
        await window.axios.post('/admin/', {deviceUuid:this.state.uuid, userId})
        Toast.hide()
        this.refreshUser()
    }

    async fire(userId) {
        Toast.loading('正在撤销', 0)
        await window.axios.delete(`/admin/?deviceUuid=${this.state.uuid}&userId=${userId}`)
        Toast.hide()
        this.refreshUser()
    }

    render(){
        let requestList, allowedList

        if(this.state.requestList.length > 0){
            requestList = this.state.requestList.map( k => <Item
                arrow="horizontal"
                multipleLine
                onClick={() => { this.allow(k.userId) }}
                key={k.userId}
            >
                {k.userName} ({k.phoneNumber})
            <Brief>点击此处以授权解锁</Brief>
            </Item>)
        }

        if(this.state.allowedList.length > 0){
            allowedList = this.state.allowedList.map( k => <Item
                arrow="horizontal"
                multipleLine
                onClick={() => { this.fire(k.userId)}}
                key={k.userId}
            >
                {k.userName} ({k.phoneNumber})
            <Brief>点击此处撤销解锁权限</Brief>
            </Item>)
        }

        return (
            <div>
                <NavBar
                mode="dark"
            >解锁门禁</NavBar>
            <WhiteSpace></WhiteSpace>
            <WingBlank>
                {this.state.failed ? 
                    <div className="flex-center">
                        <p className="main-hint" style={{color:"#FA7575"}}>无法获取当前门禁密钥，请检查是否正常工作</p>
                    </div> :
                    <div className="flex-center">
                    <p className="main-hint">请将以下二维码展示给门禁设备</p>
                    <QRcode size={200} bgColor="#f5f5f9" value={JSON.stringify({key:this.state.key})}/>
                    </div>
                }
                <WhiteSpace  size="lg"></WhiteSpace>
                <Button type="primary" onClick={()=>{this.refreshKey()}}>刷新密钥</Button>
            </WingBlank>
            
            <WhiteSpace size="lg"></WhiteSpace>
            { this.state.requestList.length > 0? 
            <List renderHeader={() => '权限申请'} className="my-list">
                {requestList}
            </List>:null}

            { this.state.allowedList.length > 0? 
            <List renderHeader={() => '允许访问'} className="my-list">
                {allowedList}
            </List>:null}
            <WhiteSpace></WhiteSpace>

            </div>
        )
    }
}