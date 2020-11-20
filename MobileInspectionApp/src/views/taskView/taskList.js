import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, Modal, Alert, TouchableOpacity } from 'react-native';
import { Icon, InputItem, Switch, Grid, Button } from '@ant-design/react-native';
import BaseView from '@/components/common/baseView';
import DataTableEx from '@/components/common/dataTable';
import Request from '@/modules/business/request';

const { width, height } = Dimensions.get('window');

const columns1 = [
    {
        name: 'EQP_COD',
        title: '设备号',
        visible: false,
    },
    {
        name: 'COR_DATE',
        title: '整改反馈日期',
        visible: true,
    },
    {
        name: 'REPORT_COD',
        title: '报告号',
        visible: true,
    },
    {
        name: 'REP_TYPE_NAME',
        title: '报告类型',
        visible: true,
    },
];

const testData = require('./data.json');
/**
 * Icon列表 （后续需要支持几行几列排布）
 * @param {*} props
 */
function IconList(props) {
    let data = props.data;
    return (
        <ScrollView style={props.parentStyle} onPress={() => console.debug('ScrollView')}>
            {data.map((info, index) => {
                return (
                    <View
                        style={{ ...props.ChildrenStyle, backgroundColor: 'yellow' }}
                        key={'icon' + index}
                        onPress={() => {
                            console.debug('222');
                            info.onClick();
                        }}
                    >
                        {info.icon}
                        {info.text}
                    </View>
                );
            })}
        </ScrollView>
    );
}

function MyModal(props) {
    let visible = props.visible;
    return (
        <View>
            <Modal
                visible={visible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    visible = false;
                }}
                presentationStyle={'pageSheet'}
            >
                <View style={{ backgroundColor: 'white', width: 100, height: 150 }}>
                    <Text>{'测试1111111效果'}</Text>
                </View>
            </Modal>
            <Button
                type={props.buttonType ? props.buttonType : 'primary'}
                style={props.buttonStyle}
                onPress={() => {
                    Alert.alert('Modal state changed.');
                    console.debug('oldValue:', visible);
                    visible = !visible;
                    console.debug('newValue:', visible);
                }}
            >
                {props.label}
            </Button>
        </View>
    );
}

/**
 * 数据列表
 * @param {*} props
 * @param {*} onClick
 */
function MyDataTable(props, onClick) {}

/**
 * 搜索栏
 * @param {*} props
 * @param {*} onClick
 */
function SearchBar(props, onClick) {
    let inputs = props.inputs;
    let buttons = props.buttons;
    return (
        <View style={props.parentStyle}>
            {inputs &&
                inputs.map((item) => {
                    return item;
                })}
            {buttons &&
                buttons.map((item) => {
                    return item;
                })}
        </View>
    );
}

/**
 * 检验任务视图
 *
 * @export
 * @class TaskList
 * @extends {BaseView}
 */
export default class TaskList extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            controllerMenus: [
                {
                    icon: (
                        <Icon
                            name={'reload'}
                            onPress={() => {
                                console.debug('11111111');
                                new Request().getBackDictQuery();
                            }}
                        />
                    ),
                    text: <Text>历史数据查询</Text>,
                    onClick: () => {
                        console.debug('历史数据查询');
                    },
                },
                {
                    icon: (
                        <Icon
                            name={'reload'}
                            onPress={() => {
                                let searchParams = {
                                    SERVICETYPE: 'getFlowNode',
                                    DEPT_ID: '14',
                                    EQP_TYPE: '3000',
                                    REP_TYPE: '300010',
                                    ISP_ID: '1593314',
                                    SUB_ISPID: '',
                                    OPE_TYPE: '2',
                                    CURR_NODE: '101',
                                    ISP_TYPE: '1',
                                    MAIN_FLAG: '1',
                                    ISP_CONCLU: '合格',
                                    IFCAN_REISP: '1',
                                };
                                new Request().getFlowNode(searchParams);
                            }}
                        />
                    ),
                    text: <Text>设备概况</Text>,
                    onClick: () => {
                        console.debug('设备概况');
                    },
                },
                {
                    icon: <Icon name={'reload'} />,
                    text: <Text>预览原始记录</Text>,
                    onClick: () => {
                        console.debug('预览原始记录');
                    },
                },
                {
                    icon: <Icon name={'reload'} />,
                    text: <Text>流转</Text>,
                    onClick: () => {
                        console.debug('流转');
                    },
                },
                {
                    icon: <Icon name={'reload'} onPress={() => new Request().downloadTest()} />,
                    text: <Text>下载空白页</Text>,
                    onClick: () => {
                        console.debug('下载空白页');
                    },
                },
                {
                    icon: <Icon name={'reload'} onPress={() => new Request().test()} />,
                    text: <Text>下载已传记录</Text>,
                    onClick: () => {
                        console.debug('下载已传记录');
                    },
                },
                {
                    icon: <Icon name={'reload'} onPress={() => new Request().test2()} />,
                    text: <Text>上传</Text>,
                    onClick: () => {
                        console.debug('上传');
                    },
                },
                {
                    icon: <Icon name={'reload'} />,
                    text: <Text>编辑</Text>,
                    onClick: () => {
                        console.debug('编辑');
                    },
                },
                {
                    icon: <Icon name={'reload'} />,
                    text: <Text>图片视频</Text>,
                    onClick: () => {
                        console.debug('图片视频');
                    },
                },
                {
                    icon: <Icon name={'reload'} />,
                    text: <Text>电子资料</Text>,
                    onClick: () => {
                        console.debug('电子资料');
                    },
                },
                {
                    icon: (
                        <Icon
                            name={'reload'}
                            onPress={() => {
                                this.setState({
                                    columns: [
                                        {
                                            name: 'COR_DATE',
                                            title: '整改反馈日期',
                                            visible: true,
                                        },
                                    ],
                                });
                                console.debug('******收费管理********');
                            }}
                        />
                    ),
                    text: <Text>收费管理</Text>,
                    onClick: () => {
                        console.debug('收费管理');
                    },
                },
            ],
            searchParams: [],
            tasks: [],
            columns: [
                {
                    name: 'EQP_COD',
                    title: '设备号',
                    visible: false,
                },
                {
                    name: 'COR_DATE',
                    title: '整改反馈日期',
                    visible: true,
                },
                {
                    name: 'REPORT_COD',
                    title: '报告号',
                    visible: true,
                },
                {
                    name: 'REP_TYPE_NAME',
                    title: '报告类型',
                    visible: true,
                },
            ],
        };
    }

    _render() {
        let searchParams = props.searchParams ? props.searchParams : {};
        const datableStyles = StyleSheet.create({
            buttonCommont: {
                width: 120,
                borderColor: 'rgba(187, 187, 187, 0.9)',
                borderWidth: 1,
                marginLeft: 5,
                marginRight: 5,
            },
        });
        const inputs = [
            <View style={{ flex: 1 }} key={'inputView'}>
                <InputItem
                    clear
                    style={{ width: '100%', backgroundColor: 'white' }}
                    value={searchParams.USER_UNT_q}
                    onChange={(value) => {
                        this.setState({
                            value1: value,
                        });
                    }}
                    placeholder="使用单位模糊查询"
                />
            </View>,
        ];
        const buttons = [
            <Button
                type="primary"
                style={datableStyles.buttonCommont}
                key={'searchButton'}
                onPress={() => {
                    console.debug('--------------', global.userInfo);
                    new Request().getTaskList();
                }}
            >
                查询
            </Button>,
            <MyModal visible={false} label={'筛选'} buttonType={'primary'} buttonStyle={datableStyles.buttonCommont} key={'modal1'}></MyModal>,
            <Button
                type="primary"
                style={datableStyles.buttonCommont}
                key={'clearButton'}
                onPress={() => {
                    new Request().getTestlog('1593669');
                    console.debug('clean');
                }}
            >
                清空
            </Button>,
            <Button
                type="primary"
                style={datableStyles.buttonCommont}
                key={'showButton'}
                onPress={() => {
                    new Request().getlogStatus('1593669');
                }}
            >
                显示字段
            </Button>,
        ];
        return (
            <View>
                {/* 上方搜索部分 */}
                <View style={{ width: '100%', height: '10%' }}>
                    <SearchBar inputs={inputs} buttons={buttons} parentStyle={props.searchBarStyle}></SearchBar>
                </View>
                {/* 下方数据列表 */}
                <View style={{ width: '100%', height: '88.5%' }}>
                    <DataTableEx columns={props.columns} data={props.data} style={{ width: '100%', height: '100%' }} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    controlMenuContainer: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        flex: 1,
        height: height,
        // paddingTop: 0.05*height
    },
    dataContentContainer: {
        height: height,
        width: 0.9 * width,
        backgroundColor: 'rgba(175,175,175,0.7)',
    },
});
