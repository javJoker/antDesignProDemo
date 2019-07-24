import React,{PureComponent} from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Dropdown,
  Icon,
  Menu,
  message,
  Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

const FormItem = Form.Item;

// 获取value，并且以逗号隔开字符串
const getValue = (obj) =>
  Object.keys(obj)
    .map( key => obj[key] )
    .join(',');

// 新建Form窗口
const CreateForm = Form.create()( props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if ( err ) return;
      form.resetFields();
      handleAdd(fieldsValue);
    })
  }

  return(
    <Modal
      destroyOnClose
      title = '新建用户'
      visible = { modalVisible }
      onOk = { okHandle }
      onCancel = { () => handleModalVisible() }
    >
      <Form>
        <FormItem></FormItem>
      </Form>

    </Modal>
  );
} );

@connect(({ authority, loading }) => ({
  authority,
  loading: loading.models.authority,
}))
class ShowUserList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {}
  };

  // 列表列
  columns = [
    {
      title: '用户编码',
      dataIndex: 'userNo',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
    },
    {
      title: '用户真名',
      dataIndex: 'realName',
    },
    {
      title: '更新人',
      dataIndex: 'updator',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '是否删除',
      dataIndex: 'delFlag',
    },
  ];

  // 生命周期
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/fetch'
    });
  }

  //
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    })
  }

  //
  handleUpateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  }

  // 下拉按钮点击事件
  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length == 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map( row => row.key ),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  // 表单选中时间
  handleSelectRows = (rows) => {
    this.setState({
      selectRows: rows,
    });
  }

  //
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys( filtersArg ).reduce(( obj, key ) => {
      const  newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  // 增加
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      }
    }).then({

    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  // 筛选条件表单展示样式
  renderForm(){
    return(
      <Form>
        <Row>
          <Col></Col>
        </Row>
      </Form>
    );
  }

  render() {

    const {
      authority: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    // 更多操作菜单
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    // 父类方法
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    //
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>{this.renderForm()}</div>
          <div>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
            {selectedRows.length > 0 && (
              <span>
                <Button>批量操作</Button>
                <Dropdown overlay={menu}>
                  更多操作<Icon type="down" />
                </Dropdown>
              </span>
            )}
            <StandardTable
              selectedRows = {selectedRows}
              // loading = {loading}
              data = {data}
              columns = {this.columns}
              onSelectRow = {this.handleSelectRows}
              // onChange = {this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={ modalVisible } />
        {/*{*/}
          {/*stepFormValues && Object.keys( stepFormValues ).length ? (*/}
            {/*<UpdateForm*/}
              {/*{...updateMethods}*/}
              {/*updateModalVisible = { updateModalVisible }*/}
              {/*values = { stepFormValues }*/}
            {/*/>*/}
          {/*) : null*/}
        {/*}*/}
      </PageHeaderWrapper>
    );
  }
}

export default ShowUserList;
