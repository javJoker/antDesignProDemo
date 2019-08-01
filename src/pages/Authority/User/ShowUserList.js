import React,{PureComponent, Fragment} from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  Input,
  Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import OptUserForm from './OptUserForm';

import styles from './ShowUserList.less'

const FormItem = Form.Item;

// 获取value，并且以逗号隔开字符串
const getValue = (obj) =>
  Object.keys(obj)
    .map( key => obj[key] )
    .join(',');

@connect(({ authority, loading }) => ({
  authority,
  loading: loading.models.authority,
}))
@Form.create()
class ShowUserList extends PureComponent {
  state = {
    modalVisible: false,                 // 新建、更新弹出框
    current: {},                        // 新建、更新弹出框参数
    selectedRows: [],                    // 列表选中行
    formValues: {}                       // 筛选参数
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
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true, record)}>更新</a>
          {/*<Divider type="vertical" />*/}
          {/*<a href="">订阅警报</a>*/}
        </Fragment>
      ),
    },
  ];

  // 生命周期
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/fetch'
    });
  }

  // 新建弹出框弹出事件
  handleModalVisible = (flag, record) => {
    const { dispatch } = this.props;

    this.setState({
      modalVisible: !!flag,
      current: record,
    })

    // 判断弹出框关闭，当flag为false的时候，弹出框关闭
    if ( !flag ){
      let formValues = this.state.formValues;

      dispatch({
        type: 'authority/fetch',
        payload: formValues,
      });
    }

  }


  // 下拉按钮点击事件
  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length == 0) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'authority/remove',
          payload: {
            ids : selectedRows.map( row => row.userNo ).join(","),
          },
          callback: (response) => {
            if (response.code === 200){
              this.setState({
                selectedRows: [],
              });

              //FIXME 表单查询
            } else {
              message.error(response.msg);
            }
          },
        });
        break;
      default:
        break;
    }

    // 列表重新加载
    let formValues = this.state.formValues;

    dispatch({
      type: 'authority/fetch',
      payload: formValues,
    });
  }

  // 表单选中事件
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  // 列表change事件
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    //FIXME 过滤条件
    const filters = Object.keys( filtersArg ).reduce(( obj, key ) => {
      const  newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    //FIXME 参数
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    //FIXME 排序
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'authority/fetch',
      payload: params,
    });
  };

  // 提交事件
  handleSubmit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/submit',
      payload: { ...fields },
      callback: ( response ) => {
        if (response.code === 200){
          message.success('添加成功');
          this.handleModalVisible();

        } else {
          message.error(response.msg);
        }
      }
    });

  };

  // 列表查询时间
  handleSearch = (e) => {
    // 阻止元素发生默认的行为
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields(( err, fieldValue ) => {
      if ( err ) return;

      const values = {
        ...fieldValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'authority/fetch',
        payload: values,
      });

    });
  };

  // 重置时间
  handleFormReset = () => {
    const { form, dispatch } = this.props;

    // 表单重置
    form.resetFields();
    this.setState({
      formValues: {},
    });

    dispatch({
      type: 'authority/fetch',
      payload: {},
    });
  };

  // 筛选条件表单展示样式
  renderForm(){
    const {
      form: { getFieldDecorator },
    } = this.props;

    return(
      <Form onSubmit={this.handleSearch} layout='inline'>
        <Row gutter={{ md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="用户编码">
              { getFieldDecorator('userNo')(<Input placeholder='请输入' />) }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户昵称">
              { getFieldDecorator('nickName')(<Input placeholder='请输入' />) }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {

    const {
      authority: { data },
      loading,
    } = this.props;
    const { current, selectedRows, modalVisible } = this.state;

    // 更多操作菜单
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    // 父类方法
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true )}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay = { menu }>
                    <Button>
                      批量操作<Icon type="down" />
                    </Button>
                </Dropdown>
              </span>
              )}
            </div>
            <StandardTable
              selectedRows = {selectedRows}
              // loading = {loading}
              data = {data}
              columns = {this.columns}
              onSelectRow = {this.handleSelectRows}
              onChange = {this.handleStandardTableChange}
            />
          </div>
        </Card>
        <OptUserForm
          {...parentMethods}
          current = { current }
          modalVisible = { modalVisible }
          title = {`用户${current ? '编辑' : '添加'}`}
        />
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
