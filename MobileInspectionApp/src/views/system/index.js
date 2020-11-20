import React from 'react';
import { View } from 'react-native';
import BaseView from '@/components/common/baseView';

/**
 * 系统设置
 *
 * @export
 * @class LoginView
 * @extends {BaseView}
 */
export default class SettingView extends BaseView {

    /**
     * 构造函数
     *
     * @param {*} props 参数
     * @memberof LoginView
     */
    constructor(props) {
        super(props);
    }

    _render() {
        return (
            <View></View>
        );
    }
}