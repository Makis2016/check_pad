import React from 'react';
import { Text, View, TouchableOpacity, NativeModules, DeviceEventEmitter } from 'react-native';
import rnfs from 'react-native-fs';
import BaseView from '@/components/common/baseView';
import PdfViewer from '@/components/business/pdfViewer';
const { _PdfViewerApi } = NativeModules;

export default class TestPdfView extends BaseView {
    constructor(props) {
        super(props);
        this.pdfViewerRef = React.createRef();
        this.onToast = (message) => this._onToast(message);
        DeviceEventEmitter.addListener('EVENT_TOAST', this.onToast);
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeListener('EVENT_TOAST', this.onToast);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => this._onOpenDocumentButtonClick()}>
                    <Text>openDocument</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onFillTestDataButtonClick()}>
                    <Text>fillTestData</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onMakeConclusionButtonClick()}>
                    <Text>makeConclusion</Text>
                </TouchableOpacity>
                <PdfViewer ref={this.pdfViewerRef} style={{ width: '100%', height: '100%' }} />
                <Text>bottom</Text>
            </View>
        );
    }

    _onToast(message) {
        this._showHint(message);
    }

    async _onDumpButtonClick1() {
        console.debug(await this.pdfViewerRef.current.getFieldValue('1.1.3', -220, -10, 0, 0));
    }

    async _onDumpButtonClick2() {
        const fields = [
            {
                name: '1.1.1',
                offsetX1: -220,
                offsetX2: -10,
                offsetY1: 0,
                offsetY2: 0,
            },
            {
                name: '1.1.2',
                offsetX1: -220,
                offsetX2: -10,
                offsetY1: 0,
                offsetY2: 0,
            },
            {
                name: '1.1.3',
                offsetX1: -220,
                offsetX2: -10,
                offsetY1: 0,
                offsetY2: 0,
            },
        ];

        console.debug(await this.pdfViewerRef.current.getFields(JSON.stringify(fields)));
    }

    async _onDumpButtonClick3() {
        const taskInformation = {
            reportCode: 'ZZ2020FTC02001',
            eqpCode: '3506T15028',
            eqpType: '3000',
            repIs: '0',
        };

        console.debug(await _PdfViewerApi.getTestLogConfiguration('', JSON.stringify(taskInformation), 'sbgk_kj_cfg'));
    }

    async _onOpenDocumentButtonClick() {
        const path = `${rnfs.ExternalStorageDirectoryPath}/tasks1`;
        const taskInformation = {
            reportCode: 'ZZ2020FTC02001',
            eqpCode: '3506T15028',
            eqpType: '3000',
            repIs: '0',
        };

        console.debug(await this.pdfViewerRef.current.openDocument(path, JSON.stringify(taskInformation)));
    }

    async _onFillTestDataButtonClick() {
        console.debug(await this.pdfViewerRef.current.fillTestData());
    }

    async _onMakeConclusionButtonClick() {
        console.debug(await this.pdfViewerRef.current.makeConclusion());
    }
}
