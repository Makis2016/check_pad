import moment from 'moment';
import forge from 'node-forge';
import Global from '@/global';
import Encrypt from '@/modules/native/encrypt';
import Log from '@/modules/common/logger';
import _Request from '@/modules/common/request';
import FileManager from '@/modules/common/fileManager';

/**
 * 请求
 *
 * @export
 * @class Request
 */
export default class Request {
    /**
     * 应用帐号
     *
     * @static
     * @memberof Request
     */
    static appId = '100002';

    /**
     * SM2公钥
     *
     * @static
     * @memberof Request
     */
    static sm2Key = '045AA578FB91F19D8D79912C2C801200A00024C6F7AA105AA2BF2F9DACECE6E03E2D75AF650A960BD82811D46E8B2DF20B4A3D73958D2B5098A523A35DC528D392';

    /**
     * SM2私钥
     *
     * @static
     * @memberof Request
     */
    static sm2PrivateKey = 'ECA07B47379833A5CEE7D3171EB3E715C558B626FD202D55D5DE77E94BE6261E';

    /**
     * 构造函数
     */
    constructor() {
        this.request = new _Request();
    }

    /**
     * 登录
     *
     * @param {*} username 用户名
     * @param {*} password 密码
     * @returns 登录结果
     * @memberof Request
     */
    async login(username, password) {
        const protocol = {
            SERVICETYPE: 'confirmUserLogin',
            USER_ID: username,
            USER_PWD: forge.md.md5.create().update(password).digest().toHex().toUpperCase(),
            IMEI: '00000000-282b-7c98-0000-0000637546ee',
            MECHINE_COD: '0539',
        };

        const response = await this._request(protocol);
        if (response.code !== 0) {
            return {
                code: response.code,
                message: response.message,
            };
        }

        // 检查返回值
        const data = response.data;
        if (typeof data.USER_ID === 'undefined' || typeof data.TOKEN === 'undefined' || typeof data.FTP_SERVICE_IP === 'undefined' || typeof data.FTP_SERVICE_USERNAME === 'undefined' || typeof data.FTP_SERVICE_USERPWD === 'undefined') {
            return {
                code: -1,
                message: '登录失败，请重试',
            };
        }
        console.log('login userinfo', data);

        // 设置用户信息
        await Global.setUserInfo({
            userId: data.USER_ID,
            password: password,
            lastModifiedTime: new Date().getTime(),
            token: data.TOKEN,
            username: data.USER_NAME,
            departId: data.DEPT_ID,
            departName: data.DEPT_NAME,
            ftpServiceIP: data.FTP_SERVICE_IP,
            ftpServicePort: await Encrypt.ftpDecrypt(data.FTP_SERVICE_POST),
            ftpServiceUsername: await Encrypt.ftpDecrypt(data.FTP_SERVICE_USERNAME),
            ftpServiceUserPassword: await Encrypt.ftpDecrypt(data.FTP_SERVICE_USERPWD),
            sdnFtpServiceIp: data.SDN_FTP_SERVICE_IP,
            sdnFtpServicePort: await Encrypt.ftpDecrypt(data.SDN_FTP_SERVICE_POST),
            sdnFtpServiceUsername: await Encrypt.ftpDecrypt(data.SDN_FTP_SERVICE_USERNAME),
            sdnFtpServiceUserPassword: await Encrypt.ftpDecrypt(data.SDN_FTP_SERVICE_USERPWD),
            officeId: data.OFFICE_ID,
            officeName: data.OFFICE_NAME,
        });

        return {
            code: 0,
            message: '登录成功',
        };
    }

    /**
     * 更新令牌
     *
     * @memberof Request
     */
    async updateToken() {
        const { userId, password } = Global.getUserInfo();
        const protocol = {
            SERVICETYPE: 'getTokenInfo',
            USER_ID: userId,
            USER_PWD: forge.md.md5.create().update(password).digest().toHex().toUpperCase(),
        };

        const response = await this._request(protocol);
        if (response.code !== 0) {
            return;
        }

        // 检查返回值
        const data = response.data;
        if (typeof data.TOKEN === 'undefined') {
            return;
        }

        // 更新令牌
        await Global.updateToken(response.data.TOKEN);
    }

    /**
     * 获取任务列表
     *
     * @param {*} parameters 查询条件
     * @return {*} 结果
     * @memberof Request
     */
    async getTaskList(parameters) {
        const { userId } = Global.getUserInfo();
        const { sortField, sortOrder, TOTAL_NUM, TASK_NUM_TO, TASK_NUM_FROM } = parameters || {};
        const protocol = {
            SERVICETYPE: 'getIspTaskList',
            ifLegar: '1',
            isPdf: '2',
            TASK_DATABASE: '1',
            OPE_USER_ID: userId,
            ...parameters,
            sortField: sortField || '',
            sortOrder: sortOrder || '',
            TOTAL_NUM: TOTAL_NUM || '',
            TASK_NUM_TO: TASK_NUM_TO || '',
            TASK_NUM_FROM: TASK_NUM_FROM || '',
        };

        const response = await this._request(protocol);
        if (response.code !== 0) {
            return {
                code: response.code,
                message: response.message,
            };
        }

        return response;
    }

    /**
     * 票款管理接口
     *
     * @param {*} parameters
     */
    async getIspFee(parameters) {
        const protocol = {
            SERVICETYPE: 'getIspFee',
            ISP_IDS: parameters,
        };
        const response = await this._request(protocol);
        if (response.code !== 0) {
            return {
                code: response.code,
                message: response.message,
            };
        }

        return response;
    }

    /**
     * 获取电子票二维码
     *
     * @param {*} parameters 查询条件
     * @return {*} 结果
     * @memberof Request
     */
    async getBillQr(parameters) {
        const { TASK_ID } = parameters || {};
        const protocol = {
            SERVICETYPE: 'getBillQr',
            TASK_ID: TASK_ID,
        };
        const response = await this._request(protocol);
        if (response.code !== 0) {
            return {
                code: response.code,
                message: response.message,
            };
        }

        return response;
    }

    /**
     * 获取任务当前状态
     *
     * @param {*} ispId 检验ID
     * @return {*} 结果
     * @memberof Request
     */
    async getlogStatus(ispId) {
        console.debug('Global', Global.getUserInfo());
        console.debug('ispId:', ispId);
        const protocol = {
            SERVICETYPE: 'getlogStatus',
            ISP_ID: ispId,
        };

        const response = await this._request(protocol);
        if (response.code !== 0) {
            return {
                code: response.code,
                message: response.message,
            };
        }
        console.debug('getlogStatus=====', response, '=====getlogStatus');
        return response;
    }

    /**
     * 上传下载任务
     *
     * @param {*} ispId 检验ID
     * @return {*} 结果
     * @memberof Request
     */
    async getTestlog(ispId) {
        const protocol = {
            SERVICETYPE: 'getTestlog',
            ISP_ID: ispId,
            OPE_USER_ID: Global.getUserInfo().userId,
            IF_SUB_DOWN: '0',
            SUB_ISPID: '',
            IF_OCX: '',
        };

        const response = await this._request(protocol);
        if (response.code !== 0) {
            return {
                code: response.code,
                message: response.message,
            };
        }
        Log.debug('getTestlog=====', response, '=====getTestlog');
        return response;
    }

    /**
     * 下载测试
     *
     * @param {*} taskInfo 任务信息
     * @return {*} 结果
     * @memberof Request
     */
    async downloadTest(taskInfo) {
        console.debug('******taskInfo********', taskInfo);
        if (!taskInfo) {
            return {
                code: -1,
                message: '任务不可为空',
            };
        }
        const taskState = await this.getlogStatus(taskInfo[0].ID);
        console.debug('**************', taskState);
        const stateData = JSON.parse(taskState.data.BUSIDATA);
        if (stateData[0].CURR_NODE === '101') {
            const result = await this.getTestlog(taskInfo[0].ID);
            let descriptors = JSON.parse(result.data.D_RETURN_MSG);
            console.debug('descriptors:', descriptors);
            let descriptor = descriptors[0];
            console.debug('descriptor:', descriptor);
            let loadData = JSON.parse(descriptor.ErrorDescriptor);
            console.debug('====loadData:', loadData);
            if (typeof loadData.LOG_MODULE_CODS !== 'undefined' && loadData.LOG_MODULE_CODS !== '') {
                const tasks = [taskInfo[0]];
                console.debug('downloadTask:', tasks);
                let taskGroups = await FileManager.getFtpDownloadTaskGroups('27.151.117.67', '10089', '11', '$350100$', tasks);
                // ip, port, username, password, tasks
                let backMessage = await FileManager.ftpDownloadGroups(taskGroups);
                let result = await FileManager.getDownloadTasks();
                console.debug('44444', backMessage, '4444444');
                console.debug(taskGroups[0].uuid, '====: ', result);
            }
        } else {
            return {
                code: -1,
                message: '当前任务不可下载与上传',
            };
        }
    }

    /**
     * 获取字典数据
     *
     * @return {*}
     * @memberof Request
     */
    async getDictData() {
        const protocol = {
            SERVICETYPE: 'getDictData',
        };

        const response = await this._request(protocol);
        if (response.code !== 0) {
            return {
                code: response.code,
                message: response.message,
            };
        }
        // 更新令牌
        await Global.setDictArea(response.data.D_DICTAREA);
        await Global.setOpeType(response.data.D_OPETYPE);
        await Global.setEqpType(response.data.D_EQPTYPE);
        await Global.setInvcType(response.data.D_INVC_TYPE);
    }

    async uploadFile(uploadGroup) {
        //const userinfo = Global.getUserInfo();
        // todo 通过 用户数据获取上传服务地址
        const uploadList = await FileManager.getFtpUploadTasks('27.151.117.67', 10089, '11', '$350100$', uploadGroup);
        return await FileManager.ftpUpload(uploadList);
    }

    async getUploadTasks(){
        return await FileManager.getUploadTasks();
    }

    /**
     * 获取上传结果
     * 
     * @param {*} ispId 任务ID列表
     */
    async putTestlog(ispId){
        const user = Global.getUserInfo();
        const protocol = {
            SERVICETYPE: 'putTestlog',
            ISP_ID:ispId,
            SUB_ISPID:'',
            OPE_USER_ID:user.userId,
            OPE_USER_NAME:user.username
        };

        const response = await this._request(protocol);
        if (response.code !== 0) {
            return {
                code: response.code,
                message: response.message,
            };
        }

        return response;
    }

    /**
     * 请求
     *
     * @param {*} data 参数
     * @memberof Request
     */
    async _request(data) {
        try {
            const businessData = JSON.stringify(data);
            const sm4Key = await Encrypt.generateSm4Key();
            const date = moment(new Date()).format('YYYYMMDDHHmmss');
            let sign = `${businessData}&${Request.appId}&${date}`;
            if (typeof Global.userInfo !== 'undefined' && typeof Global.userInfo.token !== 'undefined' && Global.userInfo.token !== '') {
                sign += `&${Global.userInfo.token}&${Global.userInfo.userId}`;
            }

            const protocol = {
                APPID: Request.appId,
                BUSIDATA: businessData,
                SIGN: await Encrypt.sm4Encrypt(sm4Key, sign),
                SM4KEY: await Encrypt.sm2Encrypt(Request.sm2Key, sm4Key),
                TIMESTAMP: date,
                USERID: Global.userInfo.userId,
                TOKEN: Global.userInfo.token,
            };

            Log.debug(`[business request]: ${JSON.stringify(protocol)}`);

            const response = await this.request.post('', protocol);
            const decrypted = await this._decrypt(response);
            if (decrypted.code !== 0) {
                return decrypted;
            } else {
                const result = typeof decrypted.data.OPE_MSG === 'undefined' ? decrypted.data : JSON.parse(decrypted.data.OPE_MSG);
                return { code: parseInt(result.ErrorCode), message: result.ErrorDescriptor, data: decrypted.data };
            }
        } catch (e) {
            return {
                code: -1,
                message: `请求出错: ${JSON.stringify(e)}`,
            };
        }
    }

    /**
     * 数据解密并校验
     *
     * @param {*} response 接收到的返回数据
     * @memberof result 解密后的结果
     */
    async _decrypt(response) {
        const { APPID, BUSIDATA, SIGN, SM4KEY, TIMESTAMP, USERID, TOKEN } = response;
        const decryptSm4Key = await Encrypt.sm2Decrypt(Request.sm2PrivateKey, SM4KEY);
        const decryptSign = await Encrypt.sm4Decrypt(decryptSm4Key, SIGN);
        const data = JSON.parse(BUSIDATA);
        // TODO 返回参数校验方式
        if (decryptSign === `${BUSIDATA}&${APPID}&${TIMESTAMP}` || decryptSign === `${BUSIDATA}&${APPID}&${TIMESTAMP}&${TOKEN}&${USERID}`) {
            return { code: 0, data: data };
        }
        return { code: -1, message: '数据解析失败', data: data };
    }
}
