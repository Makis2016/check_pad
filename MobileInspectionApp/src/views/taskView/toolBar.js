import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Icon } from '@ant-design/react-native';
import BaseView from '@/components/common/baseView';

/**
 * 工具条
 *
 * @export
 * @class ToolBar
 * @extends {BaseView}
 */
export default class ToolBar extends BaseView {
    constructor(props) {
        super(props);
    }

    _render() {
        return (
            <ScrollView style={styles.container}>
                {this.props.icons &&
                    this.props.icons.map((info, index) => {
                        return (
                            <TouchableOpacity style={styles.iconView} onPress={info.onClick} key={'icon' + index}>
                                {/* 可以自定义Icon也可以直接传入icon的name属性值 */}
                                {info.icon || <Icon name={info.iconName}></Icon>}
                                <Text>{info.text}</Text>
                            </TouchableOpacity>
                        );
                    })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
    },
    iconView: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
