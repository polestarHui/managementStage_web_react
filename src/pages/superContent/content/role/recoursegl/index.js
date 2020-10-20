import React from 'react';
import style from './style.less';
import { Table, Button, Input, TreeSelect, Select, message } from 'antd';
import { DeleteFilled, PlusOutlined, EditFilled } from '@ant-design/icons';
import * as ajax from '../../../../../framework/tools/ajax/index.js';
const { Option } = Select;
const columns = [
  {
    title: ' 资源名称',
    dataIndex: 'name',
    key: 'name',
  },
];
const expandable = {
  defaultExpandAllRows: true,
};
class RecourseGl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFlag: false,
      titleStatus: true,
      valueObj: undefined,
      icon: '',
      recourseName: '', //资源名称
      navTitle: '', //导航标题
      onlyType: '', //唯一标识
      sortName: '', //分类
      address: '', //地址
      order: 0, //排序
      selectedRowsData: [], //选择行的数据
      selectedRowKeys: [],
      sortList: [], //分类列表
      typeList: [], //类型列表
      typeId: '', //选择类型
      navData: [], //资源数 数据
      parentsNode: '',
    };
  }

  componentDidMount() {
    this.initSortNav();
    this.initNav1();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('nextProps', nextProps);
    // console.log('props', this.props);
    if (nextProps.appId !== this.props.appId) {
      this.initSortNav(nextProps.appId);
      this.initNav1(nextProps.appId);
    }
    return true;
  }

  //封装给树形结构的数据添加key值
  utilsMath = arr => {
    for (let i = arr.length - 1; i >= 0; i--) {
      arr[i].key = arr[i].id;
      arr[i].value = arr[i].id;
      arr[i].onlyType = arr[i].label;
      arr[i].label = arr[i].name;
      if (arr[i].children && arr[i].children.length) {
        this.utilsMath(arr[i].children);
      }
    }
    return arr;
  };
  initNav1 = id => {
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
  initSortNav = id => {
    ajax.get(
      //获取分类
      '/mod/account/rest/access/resource/classify/get/list',
      {
        appId: id ? id : this.props.appId,
      },
      res => {
        if (res.status === 0) {
          this.setState({
            sortList: res.data.data,
            sortName: res.data.data[0],
          });
        } else {
          message.error(res.message);
        }
      },
    );
    ajax.get(
      '/mod/account/rest/access/resource/type/get/list',
      {
        appId: this.props.appId,
      },
      res => {
        if (res.status === 0) {
          this.setState({
            typeList: res.data.data,
          });
        } else {
          message.error(res.message);
        }
      },
    );
  };

  onSelect = (value, node) => {
    this.setState({
      valueObj: value,
      parentsNode: node.id ? node.id : '',
    });
  };

  handleChange = (value, option) => {
    this.setState({
      sortName: option,
    });
  };
  typeChange = value => {
    this.setState({
      typeId: value,
    });
  };

  //添加资源
  addRecourse = () => {
    this.setState({
      titleStatus: true,
      showFlag: true,
      parentsNode: '',
      valueObj: '根节点',
      recourseName: '',
      navTitle: '',
      onlyType: '',
      icon: '',
      address: '',
    });
  };
  search = (id, dataArr) => {
    for (let i = dataArr.length - 1; i >= 0; i--) {
      if (dataArr[i].id === id) {
        return dataArr[i];
      } else if (dataArr[i].children) {
        this.search(id, dataArr[i].children);
      }
    }
  };
  //修改资源
  updateRecourse = () => {
    let { selectedRowsData, navData } = this.state;
    if (!selectedRowsData.length) {
      message.error('请选择一项要修改的数据！');
      return false;
    }
    if (selectedRowsData.length > 1) {
      message.error('只能选择一项数据！');
      return false;
    }
    let parentsNode1 = selectedRowsData[0].parentId
      ? this.search(selectedRowsData[0].parentId, navData)
      : '';
    this.setState({
      titleStatus: false,
      showFlag: true,
      parentsNode: parentsNode1 ? parentsNode1.id : '',
      valueObj: parentsNode1 ? parentsNode1.name : '根节点',
      recourseName: selectedRowsData[0].name,
      navTitle: selectedRowsData[0].title,
      onlyType: selectedRowsData[0].onlyType,
      icon: selectedRowsData[0].icon,
      address: selectedRowsData[0].url,
      sortName: {
        id: selectedRowsData[0].classifyId,
        name: selectedRowsData[0].classifyName,
      },
      typeId: selectedRowsData[0].typeId ? selectedRowsData[0].typeId : '',
      order: selectedRowsData[0].orderNumber
        ? selectedRowsData[0].orderNumber
        : 0,
    });
  };
  //删除资源
  deleteTree = () => {
    let { selectedRowsData } = this.state;
    if (!selectedRowsData.length) {
      message.error('请选择一项要删除的数据！');
      return false;
    }
    for (let i = selectedRowsData.length - 1; i >= 0; i--) {
      if (selectedRowsData[i]) {
        ajax.post(
          '/mod/account/rest/access/resource/delete',
          {
            resourceId: selectedRowsData[i].id,
          },
          res => {
            if (res.status === 0) {
              message.success('删除成功！');
              this.initNav1();
              this.setState({
                selectedRowsData: [],
                showFlag: false,
              });
            } else {
              message.error(res.message);
            }
          },
        );
      }
    }
  };
  //改变表数据
  onSelectTrees = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRowsData: selectedRows,
    });
    if (!selectedRows.length) {
      this.setState({
        showFlag: false,
      });
    }
  };
  /*添加资源改变 更新state  */
  reNameChange = e => {
    this.setState({
      recourseName: e.target.value,
    });
  };
  navTitleChange = e => {
    this.setState({
      navTitle: e.target.value,
    });
  };
  onlyTypeChange = e => {
    this.setState({
      onlyType: e.target.value,
    });
  };
  iconChange = e => {
    this.setState({
      icon: e.target.value,
    });
  };
  addressChange = e => {
    this.setState({
      address: e.target.value,
    });
  };
  //排序
  sortChange = e => {
    this.setState({
      order: e.target.value,
    });
  };
  /*添加资源改变 更新state  */
  addSubmit = () => {
    let {
      parentsNode,
      recourseName,
      navTitle,
      onlyType,
      icon,
      address,
      sortName,
      order,
      typeId,
      titleStatus,
      selectedRowsData,
      selectedRowKeys,
    } = this.state;
    if (
      recourseName === ('' || undefined) ||
      navTitle === ('' || undefined) ||
      onlyType === ('' || undefined) ||
      sortName === ('' || undefined) ||
      order === ('' || undefined)
    ) {
      message.error('缺少必填项！');
      return false;
    }
    let reg = /^[A-Za-z]+$/;
    if (!reg.test(onlyType)) {
      message.error('唯一标识只能写英文！');
      return false;
    }
    if (titleStatus) {
      //添加
      ajax.post(
        '/mod/account/rest/access/resource/add',
        {
          label: onlyType,
          appId: this.props.appId,
          classifyId: sortName.id,
          icon: icon,
          name: recourseName,
          orderNumber: order,
          parentId: parentsNode,
          title: navTitle,
          typeId: typeId,
          url: address,
          classifyName: sortName.name,
        },
        res => {
          if (res.status === 0) {
            message.success('添加成功！');
            this.initNav1();
            this.setState({
              showFlag: false,
              selectedRowKeys: [],
              selectedRowsData: [],
            });
          } else {
            message.error(res.message);
          }
        },
      );
    } else {
      //修改
      ajax.post(
        '/mod/account/rest/access/resource/update',
        {
          id: selectedRowsData[0].id,
          label: onlyType,
          appId: this.props.appId,
          classifyId: sortName.id,
          icon: icon,
          name: recourseName,
          orderNumber: order,
          parentId: parentsNode,
          title: navTitle,
          typeId: typeId,
          url: address,
          classifyName: sortName.name,
        },
        res => {
          if (res.status === 0) {
            message.success('修改成功！');
            this.initNav1();
            this.setState({
              showFlag: false,
              selectedRowKeys: [],
              selectedRowsData: [],
            });
          } else {
            message.error(res.message);
          }
        },
      );
    }
  };
  render() {
    let {
      showFlag,
      valueObj,
      recourseName,
      navTitle,
      onlyType,
      sortName,
      address,
      order,
      icon,
      titleStatus,
      sortList,
      navData,
      typeList,
      typeId,
      parentsNode,
      selectedRowKeys,
    } = this.state;
    //树形结构
    let rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectTrees,
    };
    return (
      <div className={style.recourseMain}>
        <div className={style.recourseMainHead}>
          <Button
            type="primary"
            title="添加"
            icon={<PlusOutlined />}
            onClick={this.addRecourse}
          ></Button>
          <Button
            type="primary"
            title="修改"
            icon={<EditFilled />}
            onClick={this.updateRecourse}
          ></Button>
          <Button
            type="primary"
            title="删除"
            icon={<DeleteFilled />}
            onClick={this.deleteTree}
          ></Button>
        </div>
        <div className={style.recourseMainCont}>
          <Table
            size="middle"
            columns={columns}
            rowSelection={{ ...rowSelection }}
            dataSource={navData}
            treeNodeLabelProp="name"
            expandable={expandable}
          />
          {showFlag ? (
            <div className={style.recourseMainContRight}>
              <div className={style.rcRight}>
                <header>{titleStatus ? '添加资源' : '修改资源'}</header>
                <div className={style.rcRightCont}>
                  <div className={style.recMainRow}>
                    <span className={style.recMainRowSpan}>父节点</span>
                    <div>
                      <TreeSelect
                        disabled={!titleStatus}
                        style={{ width: '100%' }}
                        value={valueObj}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={navData}
                        placeholder="根节点"
                        onSelect={this.onSelect}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.rcRightCont}>
                  <div className={style.recMainRow}>
                    <span className={style.recMainRowSpan}>资源名称 *</span>
                    <div>
                      <Input
                        placeholder="输入资源名称"
                        value={recourseName}
                        onChange={this.reNameChange}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.rcRightCont}>
                  <div className={style.recMainRow}>
                    <span className={style.recMainRowSpan}>导航标题 *</span>
                    <div>
                      <Input
                        placeholder="输入导航标题"
                        value={navTitle}
                        onChange={this.navTitleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.rcRightCont}>
                  <div className={style.recMainRow}>
                    <span className={style.recMainRowSpan}>唯一标识 *</span>
                    <div>
                      <Input
                        placeholder="输入唯一标识"
                        value={onlyType}
                        onChange={this.onlyTypeChange}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.rcRightCont}>
                  <div className={style.recMainRow}>
                    <span className={style.recMainRowSpan}>分类 *</span>
                    <div>
                      <Select
                        style={{ width: '150px' }}
                        value={
                          sortName === '' ||
                          sortName === undefined ||
                          sortName === null
                            ? null
                            : sortName.name
                        }
                        placeholder="请选择分类"
                        onChange={this.handleChange}
                      >
                        {sortList.map(item => {
                          return (
                            <Option value={item.name} key={item.id}>
                              {item.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                </div>
                <div className={style.rcRightCont}>
                  <div className={style.recMainRow}>
                    <span className={style.recMainRowSpan}>类型</span>
                    <div>
                      <Select
                        style={{ width: '150px' }}
                        value={
                          typeId === '' ||
                          typeId === undefined ||
                          typeId === null
                            ? null
                            : typeId
                        }
                        placeholder="请选择分类"
                        allowClear
                        onChange={this.typeChange}
                      >
                        {typeList.map(item => {
                          return (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                </div>
                <div className={style.rcRightCont}>
                  <div className={style.recMainRow}>
                    <span className={style.recMainRowSpan}>图标</span>
                    <div>
                      <Input
                        placeholder="输入图标名称"
                        value={icon}
                        onChange={this.iconChange}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.rcRightCont}>
                  <div className={style.recMainRow}>
                    <span className={style.recMainRowSpan}>地址</span>
                    <div>
                      <Input
                        placeholder="输入地址"
                        value={address}
                        onChange={this.addressChange}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.rcRightCont}>
                  <div className={style.recMainRow}>
                    <span className={style.recMainRowSpan}>排序 *</span>
                    <div>
                      <Input
                        placeholder="输入排序"
                        value={order}
                        onChange={this.sortChange}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={style.rcRightCont}
                  style={{ paddingLeft: '100px' }}
                >
                  <Button type="primary" onClick={this.addSubmit}>
                    {titleStatus ? '确认添加' : '确认修改'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
export default RecourseGl;
