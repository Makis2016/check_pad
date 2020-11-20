import React from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import BaseComponent from '@/components/common/baseComponent';

/**
 * 基础视图
 *
 * @export
 * @class BaseView
 * @extends {BaseComponent}
 */
export default class BaseView extends BaseComponent {
    state = {
        // 是否显示等待提示框
        showWaitingBox: false,
    };

    constructor(props) {
        super(props);
        this.waitingMessage = '正在加载,请稍等...';
    }

    render() {
        const children = this._render() || this.props.children;
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.showWaitingBox} textContent={this.waitingMessage} textStyle={styles.waitingMessageStyle} />
                {children}
            </View>
        );
    }

    /**
     * 显示等待提示框
     *
     * @param {*} [waitingMessage=null]
     * @memberof BaseView
     */
    _showWaitingBox(waitingMessage = null) {
        if (!waitingMessage) {
            this.waitingMessage = waitingMessage;
        }

        this.setState({ showWaitingBox: true });
    }

    /**
     * 关闭等待提示框
     *
     * @memberof BaseView
     */
    _closeWaitingBox() {
        this.setState({ showWaitingBox: false });
    }

    /**
     * 显示提示信息
     *
     * @param {*} content 内容
     */
    _showHint(content) {
        ToastAndroid.show(content, ToastAndroid.SHORT);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    waitingMessageStyle: {
        color: '#FFF',
    },
});
