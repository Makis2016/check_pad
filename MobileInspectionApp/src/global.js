import User from '@/modules/repository/user';
import LastUser from '@/modules/repository/lastUser';
import DictArea from '@/modules/repository/area';
import EqpType from '@/modules/repository/eqpType';
import OpeType from '@/modules/repository/opeType';

/**
 * 全局数据
 *
 * @class Global
 */
class _Global {
    /**
     * 构造函数
     *
     * @memberof Global
     */
    constructor() {
        this.userInfo = {
            userId: '',
            password: '',
            lastModifiedTime: '0',
            token: '',
            username: '',
            departId: '',
            departName: '',
            ftpServiceIP: '',
            ftpServicePort: '',
            ftpServiceUsername: '',
            ftpServiceUserPassword: '',
            sdnFtpServiceIp: '',
            sdnFtpServicePort: '',
            sdnFtpServiceUsername: '',
            sdnFtpServiceUserPassword: '',
            officeId:'',
            officeName:''
        };
        // 区域字典
        this.dictArea = [];
        // 设备种类
        this.eqpType = [];
        // 业务类型
        this.opeType = [];
        // 发票类型
        this.invcType = [];
    }

    /**
     * 获取用户信息
     *
     * @return {*} 用户信息
     * @memberof Global
     */
    getUserInfo() {
        return this.userInfo;
    }

    /**
     * 获取区域字典
     *
     * @return {*} 区域字典
     * @memberof _Global
     */
    getDictArea() {
        return this.dictArea;
    }

    /**
     * 获取设备种类
     *
     * @return {*} 设备种类
     * @memberof _Global
     */
    getEqpType() {
        return this.eqpType;
    }

    /**
     * 获取业务类型
     *
     * @return {*} 业务类型
     * @memberof _Global
     */
    getOpeType() {
        return this.opeType;
    }

    /**
     * 获取发票类型
     */
    getInvcType(){
        return this.invcType;
    }

    /**
     * 设置用户信息
     *
     * @param {*} userInfo 用户信息
     * @memberof Global
     */
    async setUserInfo(userInfo) {
        this.userInfo = userInfo;

        // 将用户信息存到realm
        // await new User().modify(userInfo);

        // // 记录最后一次登录者
        // await new LastUser().modify({
        //     id: 'lastUser',
        //     userId: userInfo.userId,
        // });
    }

    /**
     * 设置登录参数
     *
     * @param {*} userId 用户索引
     * @param {*} rememberUser 记住用户
     * @param {*} autoLogin 自动登录
     * @memberof Global
     */
    async setLoginParameters(userId, rememberUser, autoLogin) {
        // await new User().modify({
        //     userId: userId,
        //     rememberState: rememberUser,
        //     autoLoginState: autoLogin,
        // });
    }

    /**
     * 更新令牌
     *
     * @param {*} token 令牌
     * @memberof Global
     */
    async updateToken(token) {
        this.userInfo.token = token;
        this.userInfo.lastModifiedTime = new Date().getTime();

        // 将用户信息存到realm
        // await new User().modify(this.userInfo);
    }

    /**
     * 设置区域字典信息
     *
     * @param {*} areas 区域信息列表
     * @memberof _Global
     */
    async setDictArea(areas) {
        console.debug('setDictArea===', areas.length)
        if (areas && areas.length <= 0) {
            return;
        }
        this.dictArea = areas;

        // const dictArea = new DictArea();
        // for (let i = 0; i < areas.length; i++) {
        //     const areaItem = areas[i];
        //     // await dictArea.modify(areaItem);   132871
        // }
    }

    /**
     * 设置业务类型
     *
     * @param {*} opeTypes 业务类型信息列表
     * @memberof _Global
     */
    async setOpeType(opeTypes) {
        if (opeTypes && opeTypes.length <= 0) {
            return;
        }
        this.opeType = opeTypes;

        // const opeType = new OpeType();
        // for (let i = 0; i < opeTypes.length; i++) {
        //     const opeTypeItem = opeTypes[i];
            // await opeType.modify(opeTypeItem);
        // }
    }

    /**
     * 设置设备种类
     *
     * @param {*} eqpTypes 设备种类信息列表
     * @memberof _Global
     */
    async setEqpType(eqpTypes) {
        if (eqpTypes && eqpTypes.length <= 0) {
            return;
        }
        this.eqpType = eqpTypes;

        // const eqpType = new EqpType();
        // for (let i = 0; i < eqpTypes.length; i++) {
        //     const eqpTypeItem = eqpTypes[i];
            // await eqpType.modify(eqpTypeItem);
        // }
    }

    /**
     * 设置发票类型
     * 
     * @param {*} invcTypes 
     */
    async setInvcType(invcTypes){
        if (invcTypes && invcTypes.length <= 0) {
            return;
        }
        this.invcType = JSON.parse(invcTypes).map((item)=>{
            return {'label':item.INVC_TYPE_NAME,'value':item.INVC_TYPE_ID}
        });
    }
}

const Global = new _Global();
export default Global;
