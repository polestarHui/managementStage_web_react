import React from 'react';
import style from './style.less';
import logo from '../../assets/logo/companylogo-white.png';
import { history, Link } from 'umi';
import { Loading } from '../framework/tools/ajax';
import { Layout, Menu, Breadcrumb, Dropdown, Button } from 'antd';
import * as ajax from '../framework/tools/ajax';
import MyContext from './context.js';
import {
  AppstoreAddOutlined,
  TeamOutlined,
  SmileOutlined,
  DeploymentUnitOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

function handleChange(value) {
  // console.log(`selected ${value}`);
}
const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/superContent/settings" style={{ textAlign: 'center' }}>
        设置
      </Link>
    </Menu.Item>
    <Menu.Item>
      <div
        onClick={() => {
          history.push('/login');
          window.localStorage.clear();
        }}
        style={{ textAlign: 'center' }}
      >
        退出
      </div>
    </Menu.Item>
  </Menu>
);
const { Header, Content, Sider, Footer } = Layout;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topNum: 1,
      leftNum: 1,
      userName: '',
      projectsArr: [
        {
          name: '网格化',
          id: 1,
          icon: '',
        },
        {
          name: '海洋',
          id: 2,
          icon: '',
        },
        {
          name: '岩论',
          id: 3,
          icon: '',
        },
        {
          name: '软检测',
          id: 4,
          icon: '',
        },
        {
          name: '设置',
          id: 5,
          icon: '',
        },
      ],
      topItemArr: [],
    };
  }

  componentDidMount() {
    this.initNavBar();
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log(nextState.topNum);
    if (nextProps.location.query.status !== this.props.location.query.status) {
      this.initNavBar();
    }
    // if(nextState.leftNum!==this.state.leftNum){
    //   this.initNavBar();
    // }
    return true;
  }
  initNavBar = () => {
    // 左侧列表
    ajax.get('/mod/account/rest/auth/app/get/list', {}, res => {
      this.setState({
        projectsArr: res.data,
      });
      // console.log('左侧显示的平台', res.data);
    });
    // 顶部列表
    ajax.get(
      '/mod/account/rest/access/resource/get/resource',
      {
        appId: 1,
      },
      res => {
        this.setState({
          topItemArr: res.data.data,
        });
        // console.log('顶部显示的列表', res.data.data);
      },
    );
    // 获取用户信息
    ajax.get('/mod/account/rest/account/get/info', {}, res => {
      // console.log('当前用户信息', res);
      this.setState({
        userName: res.data.data,
      });
    });
  };
  // 跳转到对应的内容
  goContent(item, topNum, e) {
    // console.log('左侧的点击topNum', topNum);
    // console.log('左侧的点击leftNum',item.id);
    this.setState(
      {
        leftNum: item.id,
      },
      () => {
        // 顶部列表
        ajax.get(
          '/mod/account/rest/access/resource/get/resource',
          {
            appId: 1,
          },
          res => {
            // console.log('res', res);
            // console.log(this.state.leftNum);
            if (res.data.data.length == 0) {
              history.push({
                pathname: '/superContent/content',
                state: { topNum: 10, projectId: item.id },
              });
            } else {
              history.push({
                pathname: '/superContent/content',
                state: { topNum: topNum, projectId: item.id },
              });
            }
          },
        );
      },
    );
  }

  topGo(item, leftNum, e) {
    // console.log('上方的点击leftNum',leftNum);
    // console.log("上方的点击topNum", item.id)
    this.setState({
      topNum: item.id,
    });
    history.push({
      pathname: '/superContent/content',
      state: { topNum: item.id, projectId: leftNum },
    });
  }
  init = () => {
    this.initNavBar();
  };
  render() {
    let { location, children } = this.props;
    // console.log(this.props);
    let { projectsArr, topItemArr, topNum, leftNum } = this.state;
    if (location.pathname === '/login') {
      return children;
    }
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header" style={{ padding: '0px 200px' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            selectedKeys={[topNum.toString()]}
          >
            {topItemArr.map((item, index) => {
              return (
                <Menu.Item
                  title={item.title}
                  key={item.id}
                  onClick={this.topGo.bind(this, item, leftNum)}
                  icon={<TeamOutlined />}
                >
                  {item.name}
                </Menu.Item>
              );
            })}
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <img
              style={{
                width: '150px',
                marginLeft: '15px',
                position: 'absolute',
                top: '-55px',
              }}
              src={logo}
            ></img>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[leftNum.toString()]}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              {projectsArr.map((item, index) => {
                return (
                  <Menu.Item
                    title={item.description}
                    icon={<AppstoreAddOutlined />}
                    onClick={this.goContent.bind(this, item, topNum)}
                    key={item.id}
                  >
                    {item.name}
                  </Menu.Item>
                );
              })}
            </Menu>
          </Sider>
          <MyContext.Provider value={this.init}>
            <Layout style={{ padding: '24px 24px 0 24px' }}>
              <div
                style={{
                  position: 'absolute',
                  top: ' 17px',
                  fontSize: '18px',
                  right: '3%',
                  color: '#fff',
                }}
              >
                <Dropdown overlay={menu} placement="bottomCenter" arrow>
                  <Button
                    style={{
                      background: '#001529',
                      color: '#fff',
                      border: 'none',
                      fontSize: '16px',
                    }}
                  >
                    {this.state.userName}
                    <SmileOutlined />
                  </Button>
                </Dropdown>
              </div>
              <Content>
                <Loading />
                {children}
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                水木联合科技有限公司
              </Footer>
            </Layout>
          </MyContext.Provider>
        </Layout>
      </Layout>
    );
  }
}
