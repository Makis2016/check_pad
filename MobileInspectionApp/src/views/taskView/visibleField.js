import React from 'react';
import { View } from 'react-native';
import BaseView from '@/components/common/baseView';
import PropTypes from 'prop-types';

/**
 * 显示字段
 *
 * @export
 * @class VisibleFields
 * @extends {BaseView}
 */
export default class VisibleFields extends BaseView {
    static propTypes = {
        visibleFieldsStyle: PropTypes.object
    };

    static defaultProps = {
        visibleFieldsStyle: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            height: '100%', 
            alignItems: 'center',
            justifyContent: 'center'
        },
    };

    constructor(props) {
        super(props);
    }

    _render() {
        const items = [...this.props.items];
        return (
            <View style={this.props.visibleFieldsStyle}>
                {
                    items && items.map((item) => {
                        return item;
                    })
                }
            </View>
        );
    }
}

