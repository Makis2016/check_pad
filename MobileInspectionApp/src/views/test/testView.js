import React from 'react';
import { View, Text, Button } from 'react-native';
import Field from '@/components/common/field';
import BindingData from '@/miscs/bindingData';
import BaseView from '@/components/common/baseView';

export default class TestView extends BaseView {
    constructor(props) {
        super(props);
        this.data = new BindingData({ value1: '123'});
    }

    render() {
        return (
            <View>
                <Text>Hello Test</Text>
                <Field type="labelInput" label="测试测试" vo={this.data} vmodel="value1" placeholder="请输入值" />
                <Button
                    onPress={() => {
                        console.log(this.data);
                    }}
                    title={"点我"}
                    color="#841584"
                />
            </View>
        );
    }
}
