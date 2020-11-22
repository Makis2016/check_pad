import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { InputItem, Button, Drawer, Progress, Provider, Modal } from '@ant-design/react-native';
import BaseView from '@/components/common/baseView';
import DataTableEx from '@/components/common/dataTable';
import Request from '@/modules/business/request';
import BindingData from '@/miscs/bindingData';
import CommonStyles from '@/commonStyles';
import Dictionaries from '@/dictionary';
import ToolBar from './toolBar';
import QueryBar from './queryBar';
import QueryForm from './queryForm';
import VisibleForm from './visibleForm';
// import ElectronicDataView from '@/views/taskEdit/electronicData';
import FileManager from '@/modules/common/fileManager';

const { width, height } = Dimensions.get('window');

// TODO
const queryFields = [
    {
        type: 'dropdown',
        options: [{ value: '', label: '全部' }, ...Dictionaries.DefaultIF],
        label: '是否审核过：',
        vmodel: 'IF_CHEK_q',
    },
    {
        type: 'dropdown',
        options: [{ value: '', label: '全部' }, ...Dictionaries.CURR_NODE_COMBOX],
        label: '当前节点：',
        vmodel: 'CURR_NODE_q',
    },
    {
        type: 'dropdown',
        options: [
            { value: '', label: '全部' },
            { value: '0', label: '否' },
            { value: '1', label: '是' },
        ],
        label: '业务类型：',
        vmodel: 'OPE_TYPE_q',
    },
    {
        type: 'dropdown',
        options: [
            { value: '', label: '全部' },
            { value: '0', label: '否' },
            { value: '1', label: '是' },
        ],
        label: '设备种类：',
        vmodel: 'EQP_TYPE_q',
    },
    {
        type: 'labelInput',
        label: '报告编号：',
        placeholder: '报告编号模糊查询',
        vmodel: 'REPORT_COD_q',
    },
    {
        type: 'labelInput',
        label: '设备号：',
        placeholder: '设备号批量查询',
        vmodel: 'EQP_COD_q',
    },
    {
        type: 'labelInput',
        label: '出厂编号：',
        placeholder: '出厂编号模糊查询',
        vmodel: 'FACTORY_COD_q',
    },
    {
        type: 'dropdown',
        options: [{ value: '', label: '全部' }, ...Dictionaries.DefaultIF],
        label: '是否显示不合格原因：',
        vmodel: 'IF_SHOW_q',
    },
    {
        type: 'dropdown',
        options: [{ value: '', label: '全部' }, ...Dictionaries.D_ISP_CONCLU],
        label: '检验结论：',
        vmodel: 'ISP_CONCLU_q',
    },
    {
        type: 'dropdown',
        options: [
            { value: '', label: '全部' },
            { value: 0, label: '否' },
            { value: 1, label: '是' },
        ],
        label: '设备所在区域：',
        vmodel: 'EQP_AREA_COD_q',
    },
    {
        type: 'dropdown',
        options: [{ value: '', label: '全部' }, ...Dictionaries.ASSINV_FALG],
        label: '发票情况：',
        vmodel: 'ASSINV_FALG_q',
    },
    {
        type: 'dropdown',
        options: [{ value: '', label: '全部' }, ...Dictionaries.D_RE_ISP],
        label: '是否复检：',
        vmodel: 'RE_ISP_q',
    },
    {
        type: 'dropdown',
        options: [{ value: '', label: '全部' }, ...Dictionaries.DefaultIF],
        label: '是否待出具报告：',
        vmodel: 'IF_DOREP_q',
    },
    {
        type: 'labelInput',
        label: '楼盘名称：',
        placeholder: '楼盘名称模糊查询',
        vmodel: 'BUILD_NAME_q',
    },
    {
        type: 'datePicker',
        label: '检验日期：',
        vmodel: 'ISP_DATE_FROM_q',
    },
    {
        type: 'datePicker',
        label: '至：',
        vmodel: 'ISP_DATE_TO_q',
    },
    {
        type: 'datePicker',
        label: '创建时间从：',
        vmodel: 'ADD_DATE_FROM_q',
    },
    {
        type: 'datePicker',
        label: '至：',
        vmodel: 'ADD_DATE_TO_q',
    },
    {
        type: 'dropdown',
        options: [{ value: '', label: '全部' }, ...Dictionaries.IS_PDFPC],
        label: 'PDF状态：',
        vmodel: 'IS_PDFPC_q',
    },
    {
        type: 'labelInput',
        label: '监察识别码：',
        placeholder: '监察识别码模糊查询',
        vmodel: 'OIDNO_q',
    },
];

const visibleFields = [
    { vmodel: 'EQP_COD', label: '设备号', type: 'checkbox' },
    { vmodel: 'REPORT_COD', label: '报告号', type: 'checkbox' },
    { vmodel: 'BZL', label: '标注', type: 'checkbox' },
    { vmodel: 'USE_UNT_NAME', label: '单位名称', type: 'checkbox' },
    { vmodel: 'RE_ISP', label: '是否复检', type: 'checkbox' },
    { vmodel: 'CURR_NODE_NAME', label: '当前节点', type: 'checkbox' },
    { vmodel: 'ISP_DATE', label: '检验日期', type: 'checkbox' },
    { vmodel: 'TASK_DATE', label: '原定任务日期', type: 'checkbox' },
    { vmodel: 'EFF_DATE', label: '下检日期', type: 'checkbox' },
    { vmodel: 'ISP_CONCLU', label: '检验结论', type: 'checkbox' },
    { vmodel: 'COR_DATE', label: '整改反馈日期', type: 'checkbox' },
    { vmodel: 'REP_TYPE_NAME', label: '报告类型', type: 'checkbox' },
    { vmodel: 'SECUDEPT_NAME', label: '分支机构', type: 'checkbox' },
    { vmodel: 'BUILD_NAME', label: '楼盘名称', type: 'checkbox' },
    { vmodel: 'EQP_USECERT_COD', label: '使用证号', type: 'checkbox' },
    { vmodel: 'EQP_REG_COD', label: '注册代码', type: 'checkbox' },
    { vmodel: 'EQP_MOD', label: '型号', type: 'checkbox' },
    { vmodel: 'FACTORY_COD', label: '出厂编号', type: 'checkbox' },
    { vmodel: 'OIDNO', label: '监察识别码', type: 'checkbox' },
    { vmodel: 'CHEK_DATEE', label: '审核日期', type: 'checkbox' },
    { vmodel: 'SEND_APPR_DATE', label: '审核送审批日期', type: 'checkbox' },
    // 默认隐藏的
    { vmodel: 'IF_JIAJI', label: '加急', type: 'checkbox' },
    { vmodel: 'IS_PDF', label: '是否pdf', type: 'checkbox' },
    { vmodel: 'IF_LIMIT', label: '限速器', type: 'checkbox' },
    { vmodel: 'IF_BRAKE_TASK', label: '是否制动实验', type: 'checkbox' },
    { vmodel: 'IS_MOVEEQP', label: '流动', type: 'checkbox' },
    { vmodel: 'EQP_TYPE_NAME', label: '设备种类', type: 'checkbox' },
    { vmodel: 'EQP_NAME', label: '设备名称', type: 'checkbox' },
    { vmodel: 'OPE_TYPE_NAME', label: '业务类型', type: 'checkbox' },
    { vmodel: 'IF_REPORT_IMPCASE', label: '是否已上报重要事项', type: 'checkbox' },
    { vmodel: 'IF_OLDDED_DT_PG', label: '是否进行安全性能评估', type: 'checkbox' },
    { vmodel: 'BACK_MEMO', label: '回退信息', type: 'checkbox' },
    { vmodel: 'NOTELIGIBLE_REASON_NAME', label: '不合格原因', type: 'checkbox' },
    { vmodel: 'INP_BEG_DATE', label: '监检开始日期', type: 'checkbox' },
    { vmodel: 'INP_END_DATE', label: '监检结束日期', type: 'checkbox' },
    { vmodel: 'CREATE_DATE', label: '创建时间', type: 'checkbox' },
    { vmodel: 'FIRST_UPLOAD_DATE', label: '首次下载时间', type: 'checkbox' },
];

const historyDataColumns = [
    { name: 'EQP_COD', title: '设备号', visible: true,width:150 },
    { name: 'REP_NAME', title: '报告名称', visible: true,width:200 },
    { name: 'CURR_NODE_NAME', title: '当前节点', visible: true,width:100 },
    { name: 'USE_UNT_NAME', title: '使用单位', visible: true,width:220 },
    { name: 'ISP_DEPT_NAME', title: '检验部门', visible: true,width:200 },
    { name: 'ISP_USER_NAME', title: '检验人员', visible: true,width:200 },
    { name: 'ISP_DATE', title: '检验日期', visible: true,width:200 },
    { name: 'ISP_CONCLU', title: '检验结论', visible: true,width:200 },
    { name: 'REP_PRNT_DATE', title: '打印日期', visible: true,width:200 },
    { name: 'OPE_TYPE_NAME', title: '操作类型', visible: true,width:200 },
    { name: 'FACTORY_COD', title: '出厂编号', visible: true,width:200 },
];

/**
 * 检验任务视图
 *
 * @export
 * @class TaskView
 * @extends {BaseView}
 */
export default class TaskView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            queryFormVisible: false,
            visibleFormVisible: false,
            showElectronicData: false,
            searchParams: {},
            tasks: [],
            visibleData: new BindingData({
                EQP_COD: true,
                REPORT_COD: true,
                BZL: true,
                USE_UNT_NAME: true,
                RE_ISP: true,
                CURR_NODE_NAME: true,
                ISP_DATE: true,
                TASK_DATE: true,
                EFF_DATE: true,
                ISP_CONCLU: true,
                COR_DATE: true,
                REP_TYPE_NAME: true,
                SECUDEPT_NAME: true,
                BUILD_NAME: true,
                EQP_USECERT_COD: true,
                EQP_REG_COD: true,
                EQP_MOD: true,
                FACTORY_COD: true,
                OIDNO: true,
                CHEK_DATEE: true,
                SEND_APPR_DATE: true,
                // 默认隐藏的
                IF_JIAJI: false,
                IS_PDF: false,
                IF_LIMIT: false,
                IF_BRAKE_TASK: false,
                IS_MOVEEQP: false,
                EQP_TYPE_NAME: false,
                EQP_NAME: false,
                OPE_TYPE_NAME: false,
                IF_REPORT_IMPCASE: false,
                IF_OLDDED_DT_PG: false,
                BACK_MEMO: false,
                NOTELIGIBLE_REASON_NAME: false,
                INP_BEG_DATE: false,
                INP_END_DATE: false,
                CREATE_DATE: false,
                FIRST_UPLOAD_DATE: false,
            }),
            progressVisible: false,
            percent: 0,
            historyVisible: false,
            historyData: [],
        };

        this.toolBars = [
            {
                iconName: 'reload',
                text: '下载空白',
                onClick: () => {
                    // TODO
                    new Request().downloadTest(this._getCheckedRows());
                    console.debug('下载空白');
                },
            },
            {
                iconName: 'reload',
                text: '下载已传',
                onClick: () => {
                    // new Request().getDictData();
                    console.debug('test :', this._getCheckedRows());
                    // this._getUploadProgress();
                },
            },
            {
                iconName: 'reload',
                text: '编辑',
                onClick: () => {
                    this.props.navigation.navigate('TaskEdit', { taskInfo: this._getSelectRow() });
                    console.debug('编辑');
                },
            },
            {
                iconName: 'reload',
                text: '上传',
                onClick: () => {
                    this._checkUploadFile();
                },
            },
            {
                iconName: 'reload',
                text: '预览报告',
                onClick: () => {
                    console.debug('预览报告');
                    this._getCheckedRows();
                },
            },
            {
                iconName: 'reload',
                text: '流转',
                onClick: () => {
                    const checkedDatas = this._getCheckedRows();
                    if (checkedDatas && checkedDatas.length > 0) {
                        let ispIds = [];
                        let isFlow = true;
                        checkedDatas.map((item) => {
                            if (isFlow) {
                                if (item.CURR_NODE !== checkedDatas[0].CURR_NODE) {
                                    isFlow = false;
                                    this._showHint('存在不同节点的任务');
                                    console.debug('存在不同节点的任务');
                                    return;
                                }
                                if (item.EQP_TYPE !== checkedDatas[0].EQP_TYPE) {
                                    isFlow = false;
                                    this._showHint('存在不同设备种类的任务');
                                    console.debug('存在不同设备种类的任务');
                                    return;
                                }
                                if (item.ISP_DEPT_ID !== checkedDatas[0].ISP_DEPT_ID) {
                                    isFlow = false;
                                    this._showHint('存在不同检验部门的任务');
                                    console.debug('存在不同检验部门的任务');
                                    return;
                                }
                                if (item.OPE_TYPE !== checkedDatas[0].OPE_TYPE) {
                                    isFlow = false;
                                    this._showHint('存在不同业务类型的任务');
                                    console.debug('存在不同业务类型的任务');
                                    return;
                                }
                                if (item.ISP_CONCLU !== checkedDatas[0].ISP_CONCLU) {
                                    isFlow = false;
                                    this._showHint('存在不同检验结论的任务');
                                    console.debug('存在不同检验结论的任务');
                                    return;
                                }
                                if (item.MAIN_FLAG !== checkedDatas[0].MAIN_FLAG) {
                                    isFlow = false;
                                    this._showHint('存在不同报告类型的任务');
                                    console.debug('存在不同报告类型的任务');
                                    return;
                                }
                                if (item.ISP_TYPE !== checkedDatas[0].ISP_TYPE) {
                                    isFlow = false;
                                    this._showHint('存在不同分类的任务');
                                    console.debug('存在不同分类的任务');
                                    return;
                                }
                                if (item.IFCAN_REISP !== checkedDatas[0].IFCAN_REISP) {
                                    isFlow = false;
                                    this._showHint('存在不同可选等待状态的任务');
                                    console.debug('存在不同可选等待状态的任务');
                                    return;
                                }
                                console.debug('***************:', item);
                                ispIds.push(item.ID);
                            }
                        });
                        if (isFlow) {
                            this.props.navigation.navigate('TaskFlow', { taskInfo: checkedDatas[0], ispIds: ispIds });
                        }
                    } else {
                        this._showHint('请先勾选需要流转的任务');
                        return;
                    }
                    // new Request().getlogStatus('1593314,1593313');
                    console.debug('流转');
                },
            },
            {
                iconName: 'reload',
                text: '电子资料',
                onClick: () => {
                    const taskInfo = this._getSelectRow();
                    console.debug('*******', taskInfo);
                    if (taskInfo) {
                        if (taskInfo.SDNAPPLYID === '') {
                            this._showHint('当前任务无法查看电子资料');
                        } else {
                            this.setState({ showElectronicData: true });
                        }
                    } else {
                        this._showHint('请先选择查看的任务');
                    }
                    console.debug('电子资料');
                },
            },
            {
                iconName: 'reload',
                text: '原始记录',
                onClick: () => {
                    console.debug('11111111');
                    // new Request().getBackDictQuery();
                    this._getSelectRow();
                },
            },
            {
                iconName: 'reload',
                text: '收费管理',
                onClick: () => {
                    const checkedDatas = this._getCheckedRows();
                    if (checkedDatas && checkedDatas.length > 0) {
                        let ids = checkedDatas.map((item) => {
                            return item.ID;
                        });
                        this.props.navigation.navigate('ChargeManagement', { ids: ids });
                    } else {
                        this._showHint('请先选择查看的任务');
                    }
                },
            },
            {
                iconName: 'reload',
                text: '预览记录',
                onClick: () => {
                    // new Request().getBackDictQuery();
                    this._getSelectRow();
                },
            },
            {
                iconName: 'reload',
                text: '设备概况',
                onClick: () => {
                    console.debug('设备概况');
                    this._deviceInfo();
                },
            },
            {
                iconName: 'reload',
                text: '历史检验信息',
                onClick: () => {
                    console.debug('历史检验信息');
                    this._getEqpHisIspDetail();
                },
            },
            {
                iconName: 'reload',
                text: '打印整改单',
                onClick: () => {
                    console.debug('打印整改单');
                },
            },
            {
                iconName: 'reload',
                text: '图片视频',
                onClick: () => {
                    console.debug('图片视频');
                },
            },
            {
                iconName: 'reload',
                text: 'FIX原始记录',
                onClick: () => {
                    console.debug('FIX原始记录');
                },
            },
            {
                iconName: 'reload',
                text: 'FIX报告',
                onClick: () => {
                    console.debug('FIX报告');
                },
            },
        ];

        // 查询数据   TODO
        this.queryData = new BindingData({
            IF_CHEK_q: '',
            CURR_NODE_q: '',
            OPE_TYPE_q: '',
            EQP_TYPE_q: '',
            REPORT_COD_q: '',
            EQP_COD_q: '',
            FACTORY_COD_q: '',
            IF_SHOW_q: '',
            ISP_CONCLU_q: '',
            EQP_AREA_COD_q: '',
            ASSINV_FALG_q: '',
            RE_ISP_q: '',
            IF_DOREP_q: '',
            BUILD_NAME_q: '',
            ISP_DATE_FROM_q: '',
            ISP_DATE_TO_q: '',
            ADD_DATE_FROM_q: '',
            ADD_DATE_TO_q: '',
            IS_PDFPC_q: '',
            OIDNO_q: '',
        });

        this.queryFieldsRef = React.createRef();
        this.dataTableRef = React.createRef();
    }

    componentDidMount() {
        // 3506T13735 3506T15007
        this.getTableData({ EQP_COD_q: '3506T15007' });
    }

    /**
     * 获取表格数据
     *
     * @param {*} params 参数
     * @memberof TaskView
     */
    async getTableData(params) {
        // const taskResponse = await new Request().getTaskList(params);
        // this.setState({ tasks: taskResponse.data.data || [] });
        let data = [
            {
                ALT_UNT_ID: '',
                APPR_DATE: '',
                APPR_USER_ID: '',
                ARCHV_COD: '',
                ARCHV_DATE: '',
                ARCHV_USER_ID: '',
                ASG_DATE: '2020-02-14T00:00:00',
                ASSINV_FALG: '0',
                ATTA_TYPE: '',
                BACK_MEMO: '',
                BACK_NOD: '',
                BRAKE_TASK_INFO: '',
                BUILD_ID: '15844',
                BUILD_NAME: '南靖县世纪豪庭',
                BUILD_TYPE: '',
                BUILD_UNT_ID: '34593',
                BUILD_UNT_NAME: '厦门市建侨电梯设备有限公司',
                BUSI_TYPE: '1',
                CASE_UPLOG_TAG: '',
                CATLICENNUM: '',
                CERT_PRNT_USER_ID: '',
                CHEK_DATE: '',
                CHEK_USER_ID: '',
                CHK_PRNT_USER_ID: '',
                COR_DATE: '',
                CREATE_DATE: '2020-02-14T15:49:07',
                CURR_NODE: '101',
                CURR_NODE_NAME: '报告编制',
                DATA_PATH: '202002/T/3/3506/1598155',
                DESIGN_USE_OVERYEAR: '',
                DOWNLOAD_DATE: '2020-11-18T23:51:13',
                EFF_DATE: '',
                EFF_DATE1: '',
                END_DATE: '',
                EQP_AREA_COD: '35062711',
                EQP_AREA_NAME: '福建省漳州市南靖县',
                EQP_COD: '3506T13735',
                EQP_INNER_COD: '12-2#',
                EQP_LAT: '24.521881',
                EQP_LONG: '117.380825',
                EQP_MOD: 'Vans-P',
                EQP_NAME: '乘客电梯',
                EQP_NUM: '',
                EQP_REG_COD: '31103506002016053337',
                EQP_REG_STA: '1',
                EQP_SORT: '3100',
                EQP_TYPE: '3000',
                EQP_TYPE_NAME: '电梯',
                EQP_USECERT_COD: '梯11闽E3622(16)',
                EQP_VART: '3110',
                EQP_VART_NAME: '曳引驱动乘客电梯',
                E_PROJ_USER_ID: '',
                FACTORY_COD: '5R16074',
                FACT_PRIC: '',
                FIRST_UPLOAD_DATE: '',
                FLOW_IMPCOD: '1578827',
                FLOW_PRNT_USER_ID: '',
                ID: '1598155',
                IFCAN_REISP: '0',
                IF_BRAKE_TASK: '',
                IF_FIXREP: '0',
                IF_GETCERT: '',
                IF_HAVESUBREP: '0',
                IF_JIAJI: '0',
                IF_LIMIT: '是',
                IF_OLDDED_DT_PG: '0',
                IF_OPE: '0',
                IF_TO_COR_DATE: '0',
                IF_UNION_PDFREP: '0',
                INP_BEG_DATE: '',
                INP_END_DATE: '',
                INST_UNT_ID: '34593',
                INST_UNT_NAME: '厦门市建侨电梯设备有限公司',
                ISP_CONCLU: '未出结论',
                ISP_CONCLU_BAK: '',
                ISP_DATE: '',
                ISP_DEPT_ID: '14',
                ISP_OFFICE_ID: '1400',
                ISP_PRIC: '540',
                ISP_TYPE: '1',
                IS_MOVEEQP: '否',
                IS_PDF: '2',
                JH_MEN: '',
                JY_MEN: '',
                LAST_GET_DATE: '',
                LAST_GET_USER_ID: '',
                LIMIT_UPLOAD_TYPE: '',
                LOG_COD: 'ZZ2020FTC02004',
                LOG_MODULE_COD: '3C001C1027',
                LOG_UPTAG: '0',
                LOG_VIEW_TAG: '',
                MAKE_DATE: '2015-04-21T00:00:00',
                MAKE_UNT_ID: '101384',
                MAKE_UNT_NAME: '永大电梯设备(中国)有限公司',
                MANT_UNT_ID: '234520',
                MANT_UNT_NAME: '福建恒超电梯有限公司',
                MGE_DEPT_TYPE: '0',
                MOVE_TYPE: '',
                NOTELIGIBLE_FALG: '0',
                NOTE_PRNT_USER_ID: '',
                OIDNO: 'TE37493',
                OLD_ISPCOD: '',
                OPE_TYPE: '3',
                OPE_TYPE_NAME: '定期（内部、全面）检验',
                OPE_USERS_ID: '100472,100276',
                OTHER_PRIC: '',
                OVH_UNT_ID: '',
                PRE_ISPCOD: '',
                PRE_NODE_OPEUSERID: '',
                PRNT_INTIME: '0',
                REISP_TIMES: '0',
                REPORT_COD: 'ZZ2020FTC02004',
                REP_INTIME: '0',
                REP_MODULE_COD: '3C002C1028',
                REP_PRNT_DATE: '',
                REP_PRNT_USER_ID: '',
                REP_TYPE: '300013',
                REP_TYPE_NAME: '无机房曳引驱动电梯定期检验',
                REP_UPDATE_ID: '3122',
                RE_ISP: '否',
                RID: 'AAAZIJAAGAAB89PAAH',
                RISP_PER_TAG: '1',
                SAFE_DEPT_ID: '',
                SAFE_DEPT_NAME: '',
                SDNAPPLYID: '921682',
                SECUDEPT_ID: '',
                SECUDEPT_NAME: '',
                SEND_APPR_DATE: '',
                SEND_PRINT_DATE: '',
                SEND_REISP_DATE: '',
                SUB_EQP_VART: '3002',
                S_VERSION: '0004',
                TASKPRICE_ID: '',
                TASK_DATABASE: '1',
                TASK_DATE: '2020-03-31T00:00:00',
                TASK_ID: '2205828',
                TASK_LKMEN: '林志寅',
                TASK_MOBILE: '13605043275',
                TASK_PHONE: '13605043275',
                TOTAL_INTIME: '0',
                UNQUAL_REASON: '',
                UPLOAD_DATE: '',
                USE_UNT_ID: '88725',
                USE_UNT_NAME: '漳州聚诚物业服务有限公司',
                WORK_DAY: '',
                X_VERSION: '',
            },
            {
                ALT_UNT_ID: '',
                APPR_DATE: '',
                APPR_USER_ID: '',
                ARCHV_COD: '',
                ARCHV_DATE: '',
                ARCHV_USER_ID: '',
                ASG_DATE: '2020-02-02T00:00:00',
                ASSINV_FALG: '0',
                ATTA_TYPE: '',
                BACK_MEMO: '',
                BACK_NOD: '',
                BRAKE_TASK_INFO: '',
                BUILD_ID: '15830',
                BUILD_NAME: '南靖县华澄·祥苑',
                BUILD_TYPE: '',
                BUILD_UNT_ID: '17036',
                BUILD_UNT_NAME: '厦门永祺机电设备有限公司',
                BUSI_TYPE: '1',
                CASE_UPLOG_TAG: '',
                CATLICENNUM: '',
                CERT_PRNT_USER_ID: '',
                CHEK_DATE: '',
                CHEK_USER_ID: '',
                CHK_PRNT_USER_ID: '',
                COR_DATE: '',
                CREATE_DATE: '2020-02-02T21:21:02',
                CURR_NODE: '101',
                CURR_NODE_NAME: '报告编制',
                DATA_PATH: '202002/T/3/3506/1593941',
                DESIGN_USE_OVERYEAR: '',
                DOWNLOAD_DATE: '2020-11-18T21:16:12',
                EFF_DATE: '',
                EFF_DATE1: '',
                END_DATE: '',
                EQP_AREA_COD: '35062711',
                EQP_AREA_NAME: '福建省漳州市南靖县',
                EQP_COD: '3506T15007',
                EQP_INNER_COD: '7-1#',
                EQP_LAT: '24.51993',
                EQP_LONG: '117.385852',
                EQP_MOD: 'UN-Victor',
                EQP_NAME: '乘客电梯',
                EQP_NUM: '',
                EQP_REG_COD: '31103506002016083785',
                EQP_REG_STA: '1',
                EQP_SORT: '3100',
                EQP_TYPE: '3000',
                EQP_TYPE_NAME: '电梯',
                EQP_USECERT_COD: '梯11闽E4165(16)',
                EQP_VART: '3110',
                EQP_VART_NAME: '曳引驱动乘客电梯',
                E_PROJ_USER_ID: '',
                FACTORY_COD: '14130189',
                FACT_PRIC: '',
                FIRST_UPLOAD_DATE: '',
                FLOW_IMPCOD: '1574628',
                FLOW_PRNT_USER_ID: '',
                ID: '1593941',
                IFCAN_REISP: '0',
                IF_BRAKE_TASK: '',
                IF_FIXREP: '0',
                IF_GETCERT: '',
                IF_HAVESUBREP: '0',
                IF_JIAJI: '0',
                IF_LIMIT: '是',
                IF_OLDDED_DT_PG: '0',
                IF_OPE: '0',
                IF_TO_COR_DATE: '0',
                IF_UNION_PDFREP: '0',
                INP_BEG_DATE: '',
                INP_END_DATE: '',
                INST_UNT_ID: '17036',
                INST_UNT_NAME: '厦门永祺机电设备有限公司',
                ISP_CONCLU: '未出结论',
                ISP_CONCLU_BAK: '',
                ISP_DATE: '',
                ISP_DEPT_ID: '14',
                ISP_OFFICE_ID: '1400',
                ISP_PRIC: '840',
                ISP_TYPE: '1',
                IS_MOVEEQP: '否',
                IS_PDF: '2',
                JH_MEN: '',
                JY_MEN: '',
                LAST_GET_DATE: '',
                LAST_GET_USER_ID: '',
                LIMIT_UPLOAD_TYPE: '',
                LOG_COD: 'ZZ2020FTC01932',
                LOG_MODULE_COD: '3B001C1029',
                LOG_UPTAG: '0',
                LOG_VIEW_TAG: '',
                MAKE_DATE: '2015-09-08T00:00:00',
                MAKE_UNT_ID: '135000',
                MAKE_UNT_NAME: '西子优耐德电梯有限公司',
                MANT_UNT_ID: '234520',
                MANT_UNT_NAME: '福建恒超电梯有限公司',
                MGE_DEPT_TYPE: '0',
                MOVE_TYPE: '',
                NOTELIGIBLE_FALG: '0',
                NOTE_PRNT_USER_ID: '',
                OIDNO: 'TE37824',
                OLD_ISPCOD: '',
                OPE_TYPE: '3',
                OPE_TYPE_NAME: '定期（内部、全面）检验',
                OPE_USERS_ID: '100472,100276',
                OTHER_PRIC: '',
                OVH_UNT_ID: '',
                PRE_ISPCOD: '',
                PRE_NODE_OPEUSERID: '',
                PRNT_INTIME: '0',
                REISP_TIMES: '0',
                REPORT_COD: 'ZZ2020FTC01932',
                REP_INTIME: '0',
                REP_MODULE_COD: '3B002C1030',
                REP_PRNT_DATE: '',
                REP_PRNT_USER_ID: '',
                REP_TYPE: '300011',
                REP_TYPE_NAME: '有机房曳引驱动电梯定期检验',
                REP_UPDATE_ID: '3120',
                RE_ISP: '否',
                RID: 'AAAZIJAAHAAB/XJAAE',
                RISP_PER_TAG: '1',
                SAFE_DEPT_ID: '',
                SAFE_DEPT_NAME: '',
                SDNAPPLYID: '1256385',
                SECUDEPT_ID: '',
                SECUDEPT_NAME: '',
                SEND_APPR_DATE: '',
                SEND_PRINT_DATE: '',
                SEND_REISP_DATE: '',
                SUB_EQP_VART: '3001',
                S_VERSION: '0004',
                TASKPRICE_ID: '',
                TASK_DATABASE: '1',
                TASK_DATE: '2020-02-28T00:00:00',
                TASK_ID: '2238511',
                TASK_LKMEN: '郑继丰',
                TASK_MOBILE: '13959654356',
                TASK_PHONE: '13959654356',
                TOTAL_INTIME: '0',
                UNQUAL_REASON: '',
                UPLOAD_DATE: '',
                USE_UNT_ID: '134994',
                USE_UNT_NAME: '厦门市福菲物业管理有限公司南靖分公司',
                WORK_DAY: '',
                X_VERSION: '',
            },
        ];
        this.setState({ tasks: data });
    }

    _render() {
        let columns = [
            ...[
                { name: 'EQP_COD', title: '设备号', visible: this.state.visibleData['EQP_COD'], sortable: true },
                { name: 'REPORT_COD', title: '报告号', visible: this.state.visibleData['REPORT_COD'], sortable: true },
                // {
                //     name: 'BZL',
                //     title: '标注',
                //     visible: this.state.visibleData['BZL'],
                //     sortable: true,
                //     render: (row) => {
                //         let marks = [];
                //         if (row.SDNAPPLYID !== '') marks.push('DZ');
                //         if (row.IF_OPE !== '0') marks.push('2K');
                //         if (row.IF_LIMIT === '是') marks.push('XS');
                //         if (row.IF_BRAKE_TASK === '是') marks.push('125');
                //         // TODO 任务信息中不包含MAJEQP_TYPE
                //         // if (row.MAJEQP_TYPE==1) marks.push('ZD');
                //         if (row.IF_OLDDED_DT_PG === '1') marks.push('PG');
                //         return (
                //             <View>
                //                 <Text>{marks.join('|')}</Text>
                //             </View>
                //         );
                //     },
                // },
                { name: 'USE_UNT_NAME', title: '单位名称', visible: this.state.visibleData['USE_UNT_NAME'], sortable: true },
                { name: 'RE_ISP', title: '是否复检', visible: this.state.visibleData['RE_ISP'], sortable: true },
                { name: 'CURR_NODE_NAME', title: '当前节点', visible: this.state.visibleData['CURR_NODE_NAME'], sortable: true },
                { name: 'ISP_DATE', title: '检验日期', visible: this.state.visibleData['ISP_DATE'], sortable: true },
                { name: 'TASK_DATE', title: '原定任务日期', visible: this.state.visibleData['TASK_DATE'], sortable: true },
                { name: 'EFF_DATE', title: '下检日期', visible: this.state.visibleData['EFF_DATE'], sortable: true },
                { name: 'ISP_CONCLU', title: '检验结论', visible: this.state.visibleData['ISP_CONCLU'], sortable: true },
                { name: 'COR_DATE', title: '整改反馈日期', visible: this.state.visibleData['COR_DATE'], sortable: true },
                { name: 'REP_TYPE_NAME', title: '报告类型', visible: this.state.visibleData['REP_TYPE_NAME'], sortable: true },
                { name: 'SECUDEPT_NAME', title: '分支机构', visible: this.state.visibleData['SECUDEPT_NAME'], sortable: true },
                { name: 'BUILD_NAME', title: '楼盘名称', visible: this.state.visibleData['BUILD_NAME'], sortable: true },
                { name: 'EQP_USECERT_COD', title: '使用证号', visible: this.state.visibleData['EQP_USECERT_COD'], sortable: true },
                { name: 'EQP_REG_COD', title: '注册代码', visible: this.state.visibleData['EQP_REG_COD'], sortable: true },
                { name: 'EQP_MOD', title: '型号', visible: this.state.visibleData['EQP_MOD'], sortable: true },
                { name: 'FACTORY_COD', title: '出厂编号', visible: this.state.visibleData['FACTORY_COD'], sortable: true },
                { name: 'OIDNO', title: '监察识别码', visible: this.state.visibleData['OIDNO'], sortable: true },
                { name: 'CHEK_DATEE', title: '审核日期', visible: this.state.visibleData['CHEK_DATEE'], sortable: true },
                { name: 'SEND_APPR_DATE', title: '审核送审批日期', visible: this.state.visibleData['SEND_APPR_DATE'], sortable: true },
                // 默认隐藏的
                { name: 'IF_JIAJI', title: '加急', visible: this.state.visibleData['IF_JIAJI'], sortable: true },
                { name: 'IS_PDF', title: '是否pdf', visible: this.state.visibleData['IS_PDF'], sortable: true },
                { name: 'IF_LIMIT', title: '限速器', visible: this.state.visibleData['IF_LIMIT'], sortable: true },
                { name: 'IF_BRAKE_TASK', title: '是否制动实验', visible: this.state.visibleData['IF_BRAKE_TASK'], sortable: true },
                { name: 'IS_MOVEEQP', title: '流动', visible: this.state.visibleData['IS_MOVEEQP'], sortable: true },
                { name: 'EQP_TYPE_NAME', title: '设备种类', visible: this.state.visibleData['EQP_TYPE_NAME'], sortable: true },
                { name: 'EQP_NAME', title: '设备名称', visible: this.state.visibleData['EQP_NAME'], sortable: true },
                { name: 'OPE_TYPE_NAME', title: '业务类型', visible: this.state.visibleData['OPE_TYPE_NAME'], sortable: true },
                { name: 'IF_REPORT_IMPCASE', title: '是否已上报重要事项', visible: this.state.visibleData['IF_REPORT_IMPCASE'], sortable: true, titleStyle: { width: 155 } },
                { name: 'IF_OLDDED_DT_PG', title: '是否进行安全性能评估', visible: this.state.visibleData['IF_OLDDED_DT_PG'], sortable: true, titleStyle: { width: 155 } },
                { name: 'BACK_MEMO', title: '回退信息', visible: this.state.visibleData['BACK_MEMO'], sortable: true },
                { name: 'NOTELIGIBLE_REASON_NAME', title: '不合格原因', visible: this.state.visibleData['NOTELIGIBLE_REASON_NAME'], sortable: true },
                { name: 'INP_BEG_DATE', title: '监检开始日期', visible: this.state.visibleData['INP_BEG_DATE'], sortable: true },
                { name: 'INP_END_DATE', title: '监检结束日期', visible: this.state.visibleData['INP_END_DATE'], sortable: true },
                { name: 'CREATE_DATE', title: '创建时间', visible: this.state.visibleData['CREATE_DATE'], sortable: true },
                { name: 'FIRST_UPLOAD_DATE', title: '首次下载时间', visible: this.state.visibleData['FIRST_UPLOAD_DATE'], sortable: true },
            ],
        ];

        /**
         * 筛选框View
         *
         * @return {*}
         */
        const QueryFieldsView = () => {
            if (this.state.queryFormVisible) {
                return <QueryForm fields={queryFields} data={this.queryData} />;
            } else {
                return null;
            }
        };

        /**
         * 是否可见框View
         *
         * @return {*}
         */
        const VisibleFieldsView = () => {
            if (this.state.visibleFormVisible) {
                return <VisibleForm fields={visibleFields} data={this.state.visibleData} />;
            } else {
                return null;
            }
        };

        /** @type {*} queryBar中的输入框*/
        const inputs = [
            <View style={{ flex: 1 }} key={'inputView'}>
                <InputItem style={{ width: '100%', backgroundColor: 'white' }} value={this.state.searchParams.USER_UNT_q} onChange={(value) => this.setState({ searchParams: { ...this.state.searchParams, USER_UNT_q: value } })} clear placeholder="使用单位模糊查询" />
            </View>,
        ];

        /** @type {*} queryBar中的按钮*/
        const buttons = [
            <Button
                type="primary"
                style={CommonStyles.primaryButton}
                key={'searchButton'}
                onPress={() => {
                    // const params = this._getParams();
                    const params = this.queryData;
                    console.debug('99999999999999', params);
                    this.setState({
                        searchParams: params,
                    });
                    // console.debug("*-*", this.state.searchParams)
                    this.getTableData(params);
                    this._hideQueryFieldsView();
                }}
            >
                查询
            </Button>,
            <Button
                type="primary"
                style={CommonStyles.primaryButton}
                key={'queryFieldButton'}
                onPress={() => {
                    this.setState({
                        queryFormVisible: !this.state.queryFormVisible,
                        visibleFormVisible: false,
                        searchParams: this._getParams(),
                    });
                }}
            >
                筛选
            </Button>,
            <Button
                type="primary"
                style={CommonStyles.primaryButton}
                key={'clearButton'}
                onPress={() => {
                    // TODO
                }}
            >
                清空
            </Button>,
            <Button
                type="primary"
                style={CommonStyles.primaryButton}
                key={'showButton'}
                onPress={() => {
                    // TODO 性能优化，现在每次点击都刷新
                    this.setState({
                        queryFormVisible: false,
                        visibleFormVisible: !this.state.visibleFormVisible,
                        visibleData: this.state.visibleData,
                    });
                }}
            >
                显示字段
            </Button>,
        ];

        return (
            <Provider>
                <View style={styles.container}>
                    <Drawer
                        sidebar={
                            this.state.showElectronicData ? (
                                <View style={{ width: '100%', height: '100%' }}>
                                    {/* 电子资料页面 */}
                                    {/** 
                                <ElectronicDataView
                                    isEdit={true}
                                    taskInfo={this._getSelectRow()}
                                    refreshParent={() => {
                                        this.setState({ showElectronicData: false });
                                        this.getTableData(this.queryData);
                                    }}
                                />
                                */}
                                </View>
                            ) : null
                        }
                        position="right"
                        open={this.state.showElectronicData}
                        drawerWidth={700}
                        drawerBackgroundColor="#ccc"
                        onOpenChange={(value) => this.setState({ showElectronicData: value })}
                    >
                        {/* 上方queryBar */}
                        <View style={{ width: width, height: 0.1 * height }}>
                            <QueryBar inputs={inputs} buttons={buttons} />
                        </View>
                        {/* 下方 table + toolBar */}
                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#F0F0F0' }}>
                            {/* 左边 table + 筛选框 + 显示字段 */}
                            <View style={{ flex: 1, height: '100%' }}>
                                <QueryFieldsView />
                                <VisibleFieldsView />
                                {/* table数据 */}
                                <View style={{ flex: 1, zIndex: 400, position: 'absolute', width: '100%', height: '100%' }}>
                                    <DataTableEx ref={this.dataTableRef} header={columns} data={this.state.tasks} />
                                </View>
                            </View>
                            {/* 右边 toolBar */}
                            <View style={{ width: 0.08 * width }}>
                                <ToolBar icons={this.toolBars} />
                            </View>
                        </View>
                    </Drawer>
                    <Modal title="上传中" transparent visible={this.state.progressVisible}>
                        <View style={{ marginTop: 40, justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ marginBottom: 10, height: 4, flex: 1 }}>
                                <Progress percent={this.state.percent} />
                            </View>
                            <Text>{this.state.percent}%</Text>
                        </View>
                    </Modal>
                    <Modal
                        style={{ width: 500 }}
                        title="历史信息"
                        closable
                        transparent
                        visible={this.state.historyVisible}
                        onClose={() => {
                            this.setState({
                                historyVisible: false,
                            });
                        }}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ zIndex: 400, width: '100%', height: 400 }}>
                                <DataTableEx header={historyDataColumns} data={this.state.historyData} />
                            </View>
                        </View>
                    </Modal>
                </View>
            </Provider>
        );
    }

    /**
     * 显示筛选框
     *
     * @memberof TaskView
     */
    _showQueryFieldsView() {
        this.setState({
            queryFormVisible: true,
        });
    }

    /**
     * 隐藏筛选框
     *
     * @memberof TaskView
     */
    _hideQueryFieldsView() {
        this.setState({
            queryFormVisible: false,
        });
    }

    /**
     * 显示可见字段
     *
     * @memberof TaskView
     */
    _showVisibleFieldsView() {
        this.setState({
            visibleFormVisible: true,
        });
    }

    /**
     * 隐藏可见字段
     *
     * @memberof TaskView
     */
    _hideVisibleFieldsView() {
        this.setState({
            visibleFormVisible: false,
        });
    }

    /**
     * 获取查询参数
     *
     * @return {*} 查询参数
     * @memberof TaskView
     */
    _getParams() {
        let newParams = this.queryFieldsRef.current && this.queryFieldsRef.current.getParams();
        return { ...this.state.searchParams, ...newParams };
    }

    /**
     * 获取选中的行
     *
     * @return {*} 选中的行数据
     * @memberof TaskView
     */
    _getSelectRow() {
        return this.dataTableRef.current.getSelectRow();
    }

    /**
     * 获取勾选的行
     *
     * @return {*} 勾选的行数据
     * @memberof TaskView
     */
    _getCheckedRows() {
        return this.dataTableRef.current.getCheckedRows();
    }

    /**
     * 检测文件上传
     */
    async _checkUploadFile() {
        const checkRows = this._getCheckedRows();
        if (checkRows.length == 0) {
            this._showHint('请先选择任务');
            return;
        }
        let ids = []; // 有报告号任务ID
        let errIds = []; // 无报告号任务ID
        checkRows.forEach((item) => {
            if (item.REPORT_COD === '') {
                errIds.push(item.ID);
            } else {
                ids.push(item.ID);
            }
        });
        if (errIds.length != 0) {
            this._showHint(`任务ID：${errIds} 没有报告号无法上传`);
            return;
        }
        const response = await new Request().getlogStatus(ids.toString());
        if (response.code !== 0) {
            this._showHint(response.message);
            return;
        }
        const data = JSON.parse(response.data.BUSIDATA);
        data.forEach((item) => {
            if (item.CURR_NODE !== '101') {
                errIds.push(item.ID);
            }
        });
        if (errIds.length != 0) {
            this._showHint(`任务ID: ${errIds} 不可上传`);
            return;
        }

        // 上传任务组信息
        let uploadGroups = checkRows.map((item) => {
            return { dataPath: item.DATA_PATH, reportCod: item.REPORT_COD };
        });
        this._uploadFile(uploadGroups, ids);
    }

    /**
     * 上传文件
     *
     * @param {*} tasks 上传任务信息
     * @param {*} ids 上传任务ID
     */
    async _uploadFile(tasks, ids) {
        const rep = await new Request().uploadFile(tasks);
        if (rep.code !== 0) {
            this._showHint(rep.message);
            return;
        }
        this.setState({
            progressVisible: true,
        });
        this._getUploadProgress(ids);
    }

    /**
     * 获取上传任务进度
     *
     * @param {*} ids 上传任务ID
     */
    async _getUploadProgress(ids) {
        const data = await new Request().getUploadTasks();
        const taskGroup = JSON.parse(data);
        let countSize = 0;
        let countProgress = 0;
        for (gIndex in taskGroup) {
            const tasks = taskGroup[gIndex].tasks;
            for (tIndex in tasks) {
                const task = tasks[tIndex];
                countSize = countSize + task.size;
                countProgress = countProgress + task.processed;
            }
        }
        let percent = ((countProgress / countSize) * 100).toFixed(0);
        this.setState({
            percent: percent,
        });
        if (countSize !== countProgress || (countSize === 0 && countProgress === 0)) {
            this._getUploadProgress(ids);
        } else {
            this.setState({
                progressVisible: false,
                percent: 0,
            });
            const response = await new Request().putTestlog(ids.toString());
            if (response.code !== 0) {
                this._showHint(response.message);
                return;
            }

            const data = response.data.D_RETURN_MSG;
            for (i in data) {
                const info = JSON.parse(data[i]);
                if (info.ErrorCode === 1) {
                    Modal.alert('消息提示', `任务ID:${info.ISP_ID} ${info.ErrorDescriptor}`, [{ text: '确认' }]);
                    return;
                }
            }
            Modal.alert('消息提示', `上传成功！`, [{ text: '确认' }]);
        }
    }

    /**
     * 设备概况
     */
    _deviceInfo() {
        const rowData = this._getSelectRow();
        if (!rowData) {
            this._showHint('请选中一条任务!');
            return;
        }
        if (rowData.REPORT_COD === '') {
            this._showHint('该任务无报告号!');
            return;
        }
        this.props.navigation.navigate('Device', { reportCode: rowData.REPORT_COD });
    }

    /**
     * 设备历史数据
     *
     * @memberof TaskView
     */
    async _getEqpHisIspDetail() {
        const rowData = this._getSelectRow();
        if (!rowData) {
            this._showHint('请选中一条任务!');
            return;
        }

        const response = await new Request().getEqpHisIspDetail(rowData.EQP_COD);
        console.log('_getEqpHisIspDetail', response);
        if (response.code !== 0) {
            this._showHint(response.message);
            return;
        }

        const historyData = JSON.parse(response.data.D_RETURN_MSG);
        this.setState({ historyData, historyVisible: true });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlMenuContainer: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        flex: 1,
        height: height,
    },
    dataContentContainer: {
        height: height,
        width: 0.9 * width,
        backgroundColor: 'rgba(175,175,175,0.7)',
    },
});
