import React from 'react';
import style from './style.less';
import { Button, Table, Modal, Input, message, Popconfirm } from 'antd';
import * as ajax from '../../../../../framework/tools/ajax/index.js';
import { DeleteFilled, PlusOutlined, EditFilled } from '@ant-design/icons';
const columns1 = [
  {
    title: ' 资源名称',
    dataIndex: 'name',
    key: 'name',
  },
];
class RoleGl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], //选择行的key
      selectedRowKeys1: [], //选择行的key
      selectedRowsData: [], //选择行数据
      modalVisible: false, //编辑弹窗
      checkedValue: [], //多选权限
      editObjName: '', //编辑行的数据
      editObjArr: [], //编辑权限范围行的数据
      recordData: {}, //编辑角色行的数据
      listData: [], //列表数据
      navData: [], //导航资源列表
      roleDesc: '', //角色描述
      showQx: false,
    };
  }

  componentDidMount() {
    this.initData();
    this.initNav();
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log('nextProps', nextProps);
    // console.log('props', this.props);
    if (nextProps.appId !== this.props.appId) {
      this.initData(nextProps.appId);
      this.initNav(nextProps.appId);
    }
    return true;
  }

  initData = id => {
    let { appId } = this.props;
    ajax.get(
      `/mod/account/rest/access/role/get/by/${id ? id : appId}`,
      {},
      res => {
        if (res.status === 0) {
          let newData = [];
          res.data.data.forEach(item => {
            item.key = item.id;
            newData[newData.length] = item;
          });
          this.setState({
            listData: newData,
          });
        } else {
          message.error(res.message);
        }
      },
    );
  };
  //封装给树形结构的数据添加key值
  utilsMath = arr => {
    for (let i = arr.length - 1; i >= 0; i--) {
      arr[i].key = arr[i].id;
      if (arr[i].children && arr[i].children.length) {
        this.utilsMath(arr[i].children);
      }
    }
    return arr;
  };
  initNav = id => {
    ajax.get(
      '/mod/account/rest/access/resource/get/all',
      {
        appId: id ? id : this.props.appId,
      },
      res => {
        if (res.status === 0) {
          let newData = this.utilsMath(res.data.data);
          this.setState({
            navData: newData,
          });
        } else {
          message.error(res.message);
        }
      },
    );
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRowsData: selectedRows });
  };

  onSelectTree = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys1: selectedRowKeys,
      editObjArr: selectedRows,
    });
  };

  //编辑行
  settRow = record => {
    if (record === 1) {
      //添加
      this.setState({
        modalVisible: true,
        editObjName: '',
        roleDesc: '',
        showQx: false,
      });
    } else {
      ajax.get(
        '/mod/account/rest/access/role/resource/get/resource/',
        {
          roleIds: [record.id],
        },
        res => {
          if (res.status === 0) {
            this.setState({
              modalVisible: true,
              editObjName: record.name, //编辑行的数据
              roleDesc: record.description,
              showQx: true,
              selectedRowKeys1: res.data.data,
              recordData: record,
            });
          } else {
            message.error(res.message);
          }
        },
      );
    }
  };
  editNameChange = e => {
    this.setState({
      editObjName: e.target.value,
    });
  };
  roleDescChange = e => {
    this.setState({
      roleDesc: e.target.value,
    });
  };
  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  editOk = () => {
    let {
      editObjName,
      roleDesc,
      editObjArr,
      showQx,
      selectedRowKeys1,
      recordData,
    } = this.state;
    if (editObjName === '' || roleDesc === '') {
      message.info('缺少必填项！');
      return false;
    }
    //添加
    if (!showQx) {
      if (
        editObjName === 'su' ||
        editObjName === 'SU' ||
        editObjName === 'Su' ||
        editObjName === 'sU'
      ) {
        message.error('角色名禁止使用"su"！');
        return false;
      }
      ajax.post(
        '/mod/account/rest/access/role/add',
        {
          appId: this.props.appId,
          description: roleDesc,
          name: editObjName,
        },
        res => {
          if (res.status === 0) {
            message.success('添加成功！');
            this.initData();
            this.setState({
              modalVisible: false,
            });
          } else {
            message.error(res.message);
          }
        },
      );
    } else {
      ajax.post(
        '/mod/account/rest/access/role/update',
        {
          name: editObjName,
          description: roleDesc,
          id: recordData.id,
        },
        res => {
          if (res.status === 0) {
            ajax.post(
              '/mod/account/rest/access/role/resource/update',
              {
                roleId: recordData.id,
                resourceIds: selectedRowKeys1.length ? selectedRowKeys1 : '',
              },
              res => {
                if (res.status === 0) {
                  message.success('编辑成功！');
                  this.initData();
                  this.setState({
                    modalVisible: false,
                  });
                } else {
                  message.error(res.message);
                }
              },
            );
          } else {
            message.error(res.message);
          }
        },
      );
    }
  };

  //删除行数据
  deleteRow = e => {
    let { selectedRowsData } = this.state;
    if (!selectedRowsData.length) {
      message.info('请选择要删除的数据！');
      return false;
    }
    for (let i = selectedRowsData.length - 1; i >= 0; i--) {
      ajax.post(
        '/mod/account/rest/access/role/delete',
        {
          roleId: selectedRowsData[i].id,
          appId: this.props.appId,
        },
        res => {
          if (res.status === 0) {
            message.success('删除成功！');
            this.initData();
          } else {
            message.error(res.message);
          }
        },
      );
    }
  };
  cancel = e => {
    message.warning('取消操作！');
  };
  render() {
    let {
      selectedRowKeys,
      modalVisible,
      checkedValue,
      editObjName,
      listData,
      selectedRowKeys1,
      navData,
      roleDesc,
      showQx,
      recordData,
    } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '角色名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '角色描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '操作',
        dataIndex: 'set',
        key: 'set',
        render: (text, record) => (
          <Button
            type="link"
            icon={<EditFilled />}
            title="编辑"
            onClick={this.settRow.bind(this, record)}
          ></Button>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const rowSelections = {
      selectedRowKeys: selectedRowKeys1,
      onChange: this.onSelectTree,
    };
    return (
      <div className={style.roleMain}>
        <div className={style.roleMainHead}>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={this.deleteRow}
            onCancel={this.cancel}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="primary"
              title="删除"
              icon={<DeleteFilled />}
            ></Button>
          </Popconfirm>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            title="添加"
            onClick={this.settRow.bind(this, 1)}
          ></Button>
        </div>
        <div className={style.roleMainCont}>
          <Table
            size="middle"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={listData}
            pagination={false}
            onChange={this.pageChange}
          />
          <Modal
            title="编辑角色"
            centered
            visible={modalVisible}
            onCancel={() => this.setModalVisible(false)}
            footer={null}
          >
            <div className={style.modalMain}>
              <div
                className={style.modalMainRow}
                style={{ marginBottom: '10px' }}
              >
                <span
                  style={{
                    width: '100px',
                    fontWeight: 400,
                    paddingRight: '20px',
                    display: 'inline-block',
                    textAlign: 'right',
                    color: '#666',
                  }}
                >
                  角色名
                </span>
                <div
                  style={{ display: 'inline-block' }}
                  className={style.modalMainRowRight}
                >
                  <Input
                    placeholder="输入角色"
                    value={editObjName}
                    disabled={recordData.name === 'su' ? true : false}
                    onChange={this.editNameChange}
                  />
                </div>
              </div>
              <div className={style.modalMainRow}>
                <span
                  style={{
                    width: '100px',
                    fontWeight: 400,
                    paddingRight: '20px',
                    display: 'inline-block',
                    textAlign: 'right',
                    color: '#666',
                  }}
                >
                  角色描述
                </span>
                <div
                  style={{ display: 'inline-block' }}
                  className={style.modalMainRowRight}
                >
                  <Input
                    placeholder="输入描述"
                    value={roleDesc}
                    onChange={this.roleDescChange}
                  />
                </div>
              </div>
              {showQx ? (
                <div
                  style={{
                    paddingTop: '20px',
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr',
                    maxHeight: '500px',
                    overflow: 'auto',
                  }}
                  className={style.modalMainRow}
                >
                  <span
                    style={{
                      width: '100px',
                      fontWeight: 400,
                      paddingRight: '20px',
                      display: 'inline-block',
                      textAlign: 'right',
                      color: '#666',
                    }}
                  >
                    权限范围
                  </span>
                  <div
                    style={{ display: 'inline-block' }}
                    className={style.modalMainRowRight}
                  >
                    <Table
                      size="middle"
                      columns={columns1}
                      rowSelection={rowSelections}
                      dataSource={navData}
                      pagination={false}
                    />
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className={style.modalMainRow}>
                <div style={{ paddingLeft: '100px', paddingTop: '20px' }}>
                  <Button type="primary" size="large" onClick={this.editOk}>
                    确认
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
export default RoleGl;
