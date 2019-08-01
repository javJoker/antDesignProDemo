import React,{ PureComponent } from 'react';
import {
  Modal,
  Form,
  Input
} from 'antd';

const FormItem = Form.Item;

@Form.create()
class OptUserForm extends PureComponent{

  // 生命周期
  componentDidMount() {

  }

  render() {

    const {  form, handleSubmit, handleModalVisible, modalVisible, title, current } = this.props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;

        form.resetFields();
        handleSubmit(fieldsValue);
      });
    };

    return (
      <Modal
        destroyOnClose={true}
        title={ title }
        visible={ modalVisible }
        onOk={okHandle}
        onCancel={() => handleModalVisible( false )}
      >
        <Form layout = 'horizontal'>
          <FormItem label="用户编码">
            {form.getFieldDecorator('userNo', {
              rules: [],
              initialValue: current ? current.userNo : null,
            })(<Input  />)}
          </FormItem>
          <FormItem label="用户昵称">
            {form.getFieldDecorator('nickName', {
              rules: [],
              initialValue: current ? current.nickName : null,
            })(<Input  />)}
          </FormItem>
          <FormItem label="用户真名">
            {form.getFieldDecorator('realName', {
              rules: [],
              initialValue: current ? current.realName : null,
            })(<Input  />)}
          </FormItem>
          <FormItem label="登录密码">
            {form.getFieldDecorator('password', {
              rules: [],
              initialValue: current ? current.password : null,
            })(<Input  />)}
          </FormItem>
        </Form>

      </Modal>
    );
  }
}

export default OptUserForm;
