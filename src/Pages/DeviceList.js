import React from 'react'
import { NavBar, Icon, Toast} from 'antd-mobile';
import './DeviceList.css'
import { List } from 'antd-mobile';
import addIcon from '../static/add.svg'
const Item = List.Item;
const Brief = Item.Brief;

export default class DeviceList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            adminList:[],
            shareList:[]
        }
        this.load = this.load.bind(this)
        this.activate = this.activate.bind(this)
        this.load()
    }

    async load() {
        let res = await window.axios.get('/admin/')
        if(res.data.result){
            this.setState({adminList:res.data.result.filter( k => k.isAdmin), 
                shareList:res.data.result.filter( k => !k.isAdmin)})
        }
        console.log(this.state)
    }

    async activate() {
        Toast.loading("更新个人信息", 0)
        let userInfo = await window.axios.get("/user/")
        Toast.hide()
        console.log(userInfo.data)
        if (userInfo.data.result.name === "" || userInfo.data.result.phoneNumber === ""){
            let location={pathname:'/userinfo/'}; 
            this.props.history.push(location)
        } else {
            let location={pathname:'/activate/'}; 
            this.props.history.push(location)
        }
        
    }

    render() {

        let adminList, shareList

        if(this.state.adminList.length > 0){
            adminList = this.state.adminList.map( k => <Item
                arrow="horizontal"
                multipleLine
                onClick={() => { let location={pathname:'/unlock', state:k}; this.props.history.push(location)}}
                key={k.uuid}
            >
                门禁
            <Brief>{k.uuid}</Brief>
            </Item>)
        }

        if(this.state.shareList.length > 0){
            shareList = this.state.shareList.map( k => <Item
                arrow="horizontal"
                multipleLine
                onClick={() => { let location={pathname:'/unlock', state:k}; this.props.history.push(location)}}
                key={k.uuid}
            >
                门禁
            <Brief>{k.uuid}</Brief>
            </Item>)
        }
        return <div>
            <NavBar
                mode="dark"
                rightContent={[
                    <img src={addIcon} key="0" 
                    onClick={() => { this.activate() }}
                    />
                ]}
            >门禁列表</NavBar>

            { this.state.adminList.length > 0? 
            <List renderHeader={() => '我管理的'} className="my-list">
                {adminList}
            </List> : null}

            { this.state.shareList.length > 0? 
            <List renderHeader={() => '我可以访问的'} className="my-list">
                {shareList}
            </List>:null}
        </div>

    }
}