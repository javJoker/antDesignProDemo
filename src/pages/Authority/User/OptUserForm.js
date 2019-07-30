import React,{ PureComponent } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Form,
  Input
} from 'antd';

const FormItem = Form.Item;

@Form.create()
class OptUserForm extends PureComponent{

  // 生命周期
  componentWillMount() {

  }

  render() {

    const { form : { getFieldDecorator }, okHandle, handleModalVisible, modalVisible, modalTitle } = this.props;
    // const { modalVisible } = this.state;

    return (
      <Modal
        destroyOnClose={true}
        title={ modalTitle }
        visible={ modalVisible }
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form layout = 'horizontal'>
          <FormItem label="用户编码">
            {getFieldDecorator('userNo', {
              rules: [

              ],
            })(<Input  />)}
          </FormItem>
          <FormItem label="用户昵称">
            {getFieldDecorator('nickName', {
              rules: [

              ],
            })(<Input  />)}
          </FormItem>
          <FormItem label="用户真名">
            {getFieldDecorator('realName', {
              rules: [

              ],
            })(<Input  />)}
          </FormItem>
          <FormItem label="登录密码">
            {getFieldDecorator('password', {
              rules: [

              ],
            })(<Input  />)}
          </FormItem>
        </Form>

      </Modal>
    );
  }
}

export default OptUserForm;
