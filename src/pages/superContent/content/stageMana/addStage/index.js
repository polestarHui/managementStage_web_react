import React, { useState, useEffect } from 'react';
import style from './style.less';
import * as ajax from '../../../../../framework/tools/ajax';
import $ from 'jquery';
import moment from 'moment';
import { hex_md5 } from '../../../../../framework/tools/md5.js';
import { Button } from 'antd';
import { Table, Input, InputNumber, Popconfirm, Form, message } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import MyContext from '../../../../../layouts/context.js';
const originData = [];

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = props => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState(originData);

  useEffect(() => {
    updateList();
  }, [originData]);

  const isEditing = record => record.key === editingKey;

  const updateList = () => {
    ajax.get('/mod/account/rest/auth/app/get/list', {}, res => {
      let newData = [];
      for (let i = 0; i < res.data.length; i++) {
        newData.push({
          key: res.data[i].id.toString(),
          name: res.data[i].name,
          logo: res.data[i].logo,
          descript: res.data[i].description,
          creatTime: moment(res.data[i].createTime).format(
            'YYYY[年]MM[月]DD[日]HH:mm:ss',
          ),
        });
      }
      setData(newData);
      // console.log('平台列表', res.data);
    });
  };
  const edit = record => {
    form.setFieldsValue({
      name: '',
      logo: '',
      descripy: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const handleDelete = key => {
    // console.log(key);
    ajax.post(
      '/mod/account/rest/auth/app/delete',
      {
        id: key,
      },
      res => {
        if (res.message == 'success') {
          message.success('删除成功');
          updateList();
          props.changeLayout();
        } else {
          message.warning('请重试');
        }
        // console.log('删除操作', res);
      },
    );
  };
  const addProject = () => {
    setModalShow(true);
  };
  const addProjectT = () => {
    let name = $('#stageName').val();
    let logo = $('#stageLogo').val();
    let description = $('#stageDis').val();
    let stagePas = $('#stagePas').val();
    ajax.post(
      '/mod/account/rest/auth/app/add',
      {
        description: description,
        logo: logo,
        name: name,
        password: hex_md5(stagePas),
        system: false,
      },
      res => {
        if (res.message == 'success') {
          message.success('添加成功');
          updateList();
          props.changeLayout();
        } else {
          message.warning('请重试');
        }
        // console.log('添加操作', res);
        setModalShow(false);
      },
    );
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      // console.log(index);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        let itemNew;
        newData.findIndex(item => {
          if (key === item.key) {
            itemNew = item;
          }
        });
        ajax.post(
          '/mod/account/rest/auth/app/update/info',
          {
            name: itemNew.name,
            description: itemNew.descript,
            id: itemNew.key,
          },
          res => {
            if (res.message == 'success') {
              message.success('保存成功');
              props.changeLayout();
            } else {
              message.warning('请重试');
            }
            // console.log('保存操作', res);
          },
        );
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      // console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '平台名称',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: 'logo',
      dataIndex: 'logo',
      width: '15%',
      // editable: true,
    },
    {
      title: '具体描述',
      dataIndex: 'descript',
      width: '30%',
      editable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'creatTime',
      width: '20%',
      // editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </a>
            <Popconfirm
              okText="确定"
              cancelText="取消"
              title="确定修改吗?"
              onConfirm={cancel}
            >
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <div>
            <a disabled={editingKey !== ''} onClick={() => edit(record)}>
              <EditOutlined style={{ marginRight: 10, fontSize: 20 }} />
            </a>
            <Popconfirm
              okText="确定"
              cancelText="取消"
              title="确定删除吗?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a>
                <DeleteOutlined style={{ fontSize: '20px' }} />
              </a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div className={style.addWrap}>
      <Button
        icon={<PlusOutlined />}
        style={{ marginBottom: 10 }}
        onClick={() => addProject()}
        type="primary"
      ></Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            position: ['bottomCenter'],
          }}
        />
      </Form>
      {modalShow ? (
        <div className={style.itemWrap}>
          <div className={style.item}>
            <div>平台名称</div>
            <input id="stageName" type="text" />
          </div>
          <div className={style.item}>
            <div>平台logo</div>
            <input id="stageLogo" type="text" />
          </div>
          <div className={style.item}>
            <div>平台密码</div>
            <input id="stagePas" type="text" />
          </div>
          <div className={style.item}>
            <div>system&nbsp;&nbsp;&nbsp;</div>
            <input type="text" value="false" disabled="disabled" />
          </div>
          <div className={style.item}>
            <div>具体描述</div>
            <textarea id="stageDis" cols="30" rows="6"></textarea>
          </div>
          <div className={style.btnWrap}>
            <Button
              onClick={() => setModalShow(false)}
              type="primary"
              style={{ marginLeft: '48%' }}
            >
              取消
            </Button>
            <Button
              onClick={() => addProjectT()}
              type="primary"
              style={{ marginLeft: '48%' }}
            >
              确认
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
class AddStage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <EditableTable changeLayout={this.context} />;
  }
}

AddStage.contextType = MyContext;

export default AddStage;
