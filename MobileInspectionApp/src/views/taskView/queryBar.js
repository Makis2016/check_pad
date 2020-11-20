import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import BaseView from '@/components/common/baseView';

/**
 * 查询条
 *
 * @export
 * @class QuerytBar
 * @extends {BaseView}
 */
export default class QuerytBar extends BaseView {
    static propTypes = {
        queryBarStyle: PropTypes.object,
    };

    static defaultProps = {
        queryBarStyle: {
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    constructor(props) {
        super(props);
    }

    _render() {
        return (
            <View style={this.props.queryBarStyle}>
                {this.props.inputs &&
                    this.props.inputs.map((item) => {
                        return item;
                    })}
                {this.props.buttons &&
                    this.props.buttons.map((item) => {
                        return item;
                    })}
            </View>
        );
    }
}
