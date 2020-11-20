import React, { Component } from 'react';
import { NativeModules, findNodeHandle } from 'react-native';
import _PdfViewer from '@/modules/native/pdfViewer';

const { _PdfViewerApi } = NativeModules;

/**
 * PDF阅读器
 *
 * @export
 * @class PdfViewer
 * @extends {Component}
 */
export default class PdfViewer extends Component {
    /**
     * 构造函数
     *
     * @param {*} props 参数
     * @memberof PdfViewer
     */
    constructor(props) {
        super(props);
        this.pdfViewer = React.createRef();
    }

    render() {
        return <_PdfViewer ref={this.pdfViewer} style={{ width: '100%', height: '100%' }} />;
    }

    /**
     * 打开PDF文档
     *
     * @param {*} path 路径
     * @param {*} taskInformation 检验设备信息
     * @return {*} 是否成功
     * @memberof PdfViewer
     */
    async openDocument(path, taskInformation) {
        return await _PdfViewerApi.openDocument(findNodeHandle(this.pdfViewer.current), path, taskInformation);
    }

    /**
     * 获取域内容
     *
     * @param {*} name 域名
     * @param {*} offsetX1 横向偏移
     * @param {*} offsetX2 横向偏移
     * @param {*} offsetY1 纵向偏移
     * @param {*} offsetY2 纵向偏移
     * @return {*} 域内容
     * @memberof PdfViewer
     */
    async getFieldValue(name, offsetX1, offsetX2, offsetY1, offsetY2) {
        return await _PdfViewerApi.getFieldValue(findNodeHandle(this.pdfViewer.current), name, offsetX1, offsetX2, offsetY1, offsetY2);
    }

    /**
     * 获取域信息
     *
     * @param {*} fields 请求域信息
     * @return {*} 域信息
     * @memberof PdfViewer
     */
    async getFields(fields) {
        return await _PdfViewerApi.getFields(findNodeHandle(this.pdfViewer.current), fields);
    }

    /**
     * 设置域值
     *
     * @param {*} fieldsValue 域值
     * @return {*} 是否成功
     * @memberof PdfViewer
     */
    async setFieldsValue(fieldsValue) {
        return await _PdfViewerApi.setFieldsValue(findNodeHandle(this.pdfViewer.current), fieldsValue);
    }

    /**
     * 下结论
     *
     * @return {*} 是否成功
     * @memberof PdfViewer
     */
    async makeConclusion() {
        return await _PdfViewerApi.makeConclusion(findNodeHandle(this.pdfViewer.current));
    }

    /**
     * 填充测试数据
     *
     * @return {*} 是否成功
     * @memberof PdfViewer
     */
    async fillTestData() {
        return await _PdfViewerApi.fillTestData(findNodeHandle(this.pdfViewer.current));
    }
}
