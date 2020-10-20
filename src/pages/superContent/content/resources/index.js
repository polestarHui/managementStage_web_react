import React from 'react';
import style from './style.less';
import moment from 'moment';
import { Table, Button, Select, Checkbox, message } from 'antd';
import { RedoOutlined, EditOutlined } from '@ant-design/icons';
import * as ajax from '../../../../framework/tools/ajax';
const columns = [
  {
    title: '用户名称',
    dataIndex: 'name',
  },
  {
    title: '角色名',
    dataIndex: 'role',
  },
  {
    title: '角色描述',
    dataIndex: 'roleDes',
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastTime',
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    modalBox: false,
    dataList: [],
    options: [],
    cheched: [],
  };
  componentDidMount() {
    this.initList();
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log('nextProps', nextProps);
    // console.log('props', this.props);
    if (nextProps.projectId !== this.props.projectId) {
      this.initList(nextProps.projectId);
    }
    return true;
  }

  initList = id => {
    ajax.get(
      '/mod/account/rest/account/get/list',
      {
        appId: id ? id : this.props.projectId,
      },
      res => {
        // console.log('权限分配展示列表', res.data);
        let data = [];
        for (let i = 0; i < res.data.length; i++) {
          // for(let j=0;j<res.data[i].accessRoles.length;j++){
          //   console.log('测试测试');
          //   console.log(res.data[i].username,res.data[j].accessRoles[0].name)

          data.push({
            key: res.data[i].id,
            name: res.data[i].username,
            role:
              res.data[i].accessRoles.length == 0
                ? ''
                : res.data[i].accessRoles[0].name,
            roleDes:
              res.data[i].accessRoles.length == 0
                ? ''
                : res.data[i].accessRoles[0].description,
            registerTime: moment(res.data[i].joinTime).format(
              'YYYY[年]MM[月]DD[日]HH:mm:SS',
            ),
            lastTime: moment(res.data[i].lastActiveTime).format(
              'YYYY[年]MM[月]DD[日]HH:mm:SS',
            ),
          });

          // }
        }
        this.setState({
          dataList: data,
        });
      },
    );
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  // 修改角色
  editRole() {
    // console.log(this.state.selectedRowKeys);
    this.setState({
      modalBox: true,
    });

    ajax.get(
      `/mod/account/rest/access/role/get/by/${this.props.projectId}`,
      {},
      res => {
        // console.log('所有的角色', res);
        let roleList = [];
        for (let i = 0; i < res.data.data.length; i++) {
          roleList.push({
            label: ` ${res.data.data[i].name}(${res.data.data[i].description})`,
            value: res.data.data[i].name,
          });
        }
        this.setState({
          options: roleList,
        });
      },
    );
  }
  // 确认修改
  certainChange = () => {
    let userId = this.state.selectedRowKeys;
    let roles = this.state.cheched;
    let projectId = this.props.projectId;
    if (roles.length == 0) {
      message.warning('请选择一项');
    } else {
      ajax.post(
        '/mod/account/rest/account/assign/roles',
        {
          id: userId,
          roles: roles.toString(),
          appId: projectId,
        },
        res => {
          this.initList();
          message.success('修改成功');
          this.setState({
            modalBox: false,
            selectedRowKeys: [],
            loading: false,
          });
          // console.log('确认修改用户权限', res);
        },
      );
    }
  };
  onChange = checkedValues => {
    this.setState(
      {
        cheched: checkedValues,
      },
      () => {
        // console.log(checkedValues);
        // console.log('checked = ', this.state.cheched);
      },
    );
  };
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className={style.resourcesWrap}>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={this.start}
            disabled={!hasSelected}
            loading={loading}
            icon={<RedoOutlined />}
          ></Button>
          <Button
            type="primary"
            onClick={this.editRole.bind(this)}
            disabled={!hasSelected}
            icon={<EditOutlined />}
            style={{ marginLeft: '10px' }}
          ></Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `当前选中 ${selectedRowKeys.length} 人` : ''}
          </span>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.dataList}
          bordered
          pagination={{
            position: ['bottomCenter'],
          }}
        />
        {this.state.modalBox ? (
          <div className={style.modalWrap}>
            <div className={style.item}>
              <div
                className={style.title}
                style={{
                  width: '100px',
                  marginRight: '17px',
                  lineHeight: '66px',
                }}
              >
                角色
              </div>
              <Checkbox.Group
                options={this.state.options}
                onChange={this.onChange}
              />
            </div>
            <Button
              type="primary"
              onClick={() => {
                this.setState({
                  modalBox: false,
                  selectedRowKeys: [],
                  loading: false,
                });
              }}
              style={{ marginLeft: '13%', marginTop: '10%' }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={this.certainChange}
              style={{ marginLeft: '35%', marginTop: '10%' }}
            >
              确认
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
class Resources extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <App projectId={this.props.projectId} />
      </div>
    );
  }
}
export default Resources;
