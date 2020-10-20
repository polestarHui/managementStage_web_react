import React, { useState, useContext, useEffect, useRef } from 'react';
import style from './style.less';
import moment from 'moment';
import * as ajax from '../../../../framework/tools/ajax';
import { hex_md5 } from '../../../../framework/tools/md5.js';
import $ from 'jquery';
import { Table, Input, Popconfirm, Form, Button, message } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
} from '@ant-design/icons';

const EditableContext = React.createContext();
let projectId = 1;

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} 必须填写.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '用户名称',
        dataIndex: 'name',
        width: '20%',
        // editable: true,
      },
      {
        title: '客户端',
        dataIndex: 'password',
        width: '20%',
        // editable: true,
      },
      {
        title: '注册时间',
        width: '20%',
        dataIndex: 'registerTime',
      },
      {
        title: '最后登录时间',
        width: '20%',
        dataIndex: 'lastTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <div style={{ display: 'flex' }}>
              <div onClick={this.editName.bind(this, record.key)}>
                <a>
                  <EditOutlined
                    style={{ fontSize: '20px', marginRight: '20px' }}
                  />
                </a>
              </div>
              <Popconfirm
                okText="确定"
                cancelText="取消"
                title="确定重置密码吗?"
                onConfirm={() => this.resetPas(record.key)}
              >
                <a>
                  <KeyOutlined
                    style={{ fontSize: '20px', marginRight: '20px' }}
                  />
                </a>
              </Popconfirm>
              <Popconfirm
                okText="确定"
                cancelText="取消"
                title="确定删除吗?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <a>
                  <DeleteOutlined style={{ fontSize: '20px' }} />
                </a>
              </Popconfirm>
            </div>
          ) : null,
      },
    ];

    this.state = {
      dataSource: '',
      count: 2,
      editName: false,
      showAdd: false,
      pasKey: '',
    };
  }

  componentDidMount() {
    this.initUserList();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('nextProps', nextProps);
    // console.log('props', this.props);
    if (nextProps.projectId !== this.props.projectId) {
      this.initUserList(nextProps.projectId);
    }
    return true;
  }

  initUserList = id => {
    ajax.get(
      '/mod/account/rest/account/get/list',
      {
        appId: id ? id : this.props.projectId,
      },
      res => {
        // console.log('用户列表', res.data);
        const usersArr = [];
        for (let i = 0; i < res.data.length; i++) {
          usersArr.push({
            key: res.data[i].id,
            name: res.data[i].username,
            password: res.data[i].device,
            registerTime: moment(res.data[i].joinTime).format(
              'YYYY[年]MM[月]DD[日]HH:mm:SS',
            ),
            lastTime: moment(res.data[i].lastActiveTime).format(
              'YYYY[年]MM[月]DD[日]HH:mm:SS',
            ),
          });
        }
        this.setState({
          dataSource: usersArr,
        });
      },
    );
  };

  handleDelete = key => {
    ajax.post(
      '/mod/account/rest/account/delete',
      {
        id: key,
      },
      res => {
        const dataSource = [...this.state.dataSource];
        this.setState({
          dataSource: dataSource.filter(item => item.key !== key),
        });
        message.success('删除成功');
        // console.log('这是删除用户操作', res);
      },
    );
  };

  // 密码重置
  resetPas = key => {
    ajax.post(
      '/mod/account/rest/account/reset',
      {
        id: key,
      },
      res => {
        if (res.status == 0) {
          message.success('密码重置成功');
        } else {
          message.warning('请重试');
        }
        // console.log('密码重置', res);
      },
    );
    // console.log(key);
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
    // console.log('这是保存', this.state.dataSource);
  };

  // 添加用户
  addUsers = () => {
    const userPas = $('#userPas').val();
    const username = $('#account').val();
    // console.log(userPas,username);
    if (username && userPas) {
      ajax.post(
        '/mod/account/rest/account/add',
        {
          appId: this.props.projectId,
          password: hex_md5(userPas),
          username: username,
        },
        res => {
          if (res.status == '-1') {
            message.warning('该账户已存在');
          } else if (res.status == '0') {
            message.success('添加成功');
            this.initUserList();
          } else {
            message.warning('请重试');
          }
          // console.log('添加用户', res);
        },
      );
    } else {
      message.warning('请输入账户或密码');
    }

    this.setState({ showAdd: false });
  };
  addAcount = () => {
    this.setState({
      showAdd: true,
    });
  };
  // 修改用户名称
  editName(pasKey, e) {
    // console.log('pasKey', pasKey);
    this.setState({
      editName: true,
      userId: pasKey,
    });
  }
  resetName() {
    let userId = this.state.userId;
    let username = $('#userName').val();
    // console.log(username);
    ajax.post(
      '/mod/account/rest/account/update/name',
      {
        id: userId,
        username: username,
      },
      res => {
        if (res.status == -1) {
          message.warning('该用户名已存在');
        } else if (res.status == 0) {
          message.success('修改成功');
          this.initUserList();
        } else {
          message.warning('请重试');
        }
        // console.log('修改用用户名称', res);
      },
    );
    this.setState({ editName: false });
  }

  render() {
    // projectId=this.props.projectId[0];
    // console.log('左侧的id',projectId);
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div className={style.tableWrap}>
        <Button
          type="primary"
          style={{ marginBottom: '15px' }}
          onClick={this.addAcount}
          icon={<PlusOutlined />}
        ></Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={{
            position: ['bottomCenter'],
          }}
        />
        {this.state.editName ? (
          <div className={style.passWrap}>
            <div className={style.itemWrap}>
              <div className={style.item}>
                <div>用户名称</div>
                <input id="userName"></input>
              </div>
            </div>
            <Button
              style={{ marginLeft: '17.5%', marginTop: '22px' }}
              type="primary"
              onClick={() => {
                this.setState({ editName: false });
              }}
            >
              取消
            </Button>
            <Button
              style={{ marginLeft: '26.5%', marginTop: '22px' }}
              type="primary"
              onClick={this.resetName.bind(this)}
            >
              确定
            </Button>
          </div>
        ) : (
          ''
        )}
        {this.state.showAdd ? (
          <div className={style.addBox}>
            <div className={style.item}>
              <div>账号：</div>
              <input id="account"></input>
            </div>
            <div className={style.item}>
              <div>密码：</div>
              <input id="userPas"></input>
            </div>
            <div className={style.item}>
              <div>具体描述：</div>
              <textarea></textarea>
            </div>
            <div className={style.btnWrap}>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ showAdd: false });
                }}
              >
                取消
              </Button>
              <Button type="primary" onClick={this.addUsers}>
                确定
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

class Personel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdd: false,
    };
  }

  render() {
    return (
      <div className={style.personelWrap}>
        <EditableTable projectId={this.props.projectId} />
      </div>
    );
  }
}
export default Personel;
