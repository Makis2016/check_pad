import { StyleSheet } from 'react-native';

const CommonStyles = StyleSheet.create({
    // 浮动视图
    floatingView: {
        zIndex: 500,
        position: 'absolute',
        backgroundColor: 'white',
    },
    // 按钮
    primaryButton: {
        width: 120,
        borderColor: 'rgba(187, 187, 187, 0.9)',
        borderWidth: 1,
        marginLeft: 5,
        marginRight: 5,
    },
    // 标题栏标题
    headerTitle: {
        fontSize: 20,
    },
    // 标签
    primaryLabel: {
        fontSize: 20,
    },
    // 输入框
    primaryInput: {
        fontSize: 20,
    },
    // 下拉选择框
    primaryDropdown: {
        fontSize: 20,
    },
    // 日期选择框
    primaryDatePicker: {
        fontSize: 20,
    },
});

export default CommonStyles;
