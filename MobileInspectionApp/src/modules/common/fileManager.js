import rnfs from 'react-native-fs';
import UUIDGenerator from 'react-native-uuid-generator';
import _FileManager from '@/modules/native/fileManager';
import Log from '@/modules/common/logger';

// 创建下载目录
const downloadPath = `${rnfs.ExternalDirectoryPath}/downloads`;
rnfs.mkdir(downloadPath);

/**
 * 文件管理器
 *
 * @export
 * @class FileManager
 */
export default class FileManager {
    /**
     * 获取下载空白记录的文件列表相关信息
     *
     * @static
     * @param {*} logModuleCode 模板号
     * @param {*} reportCode 报告号
     * @param {*} ispUsers 检验员ID集合，字符串逗号分隔
     * @param {*} taskDataPath 任务数据路径（上传保存路径）
     * @memberof FileManager
     */
    static getMouldFilesPath = (logModuleCode, reportCode, ispUsers, taskDataPath) => {
        const firstHalf = logModuleCode.substr(0, 6);
        const secondHalf = logModuleCode.substr(6, 4);
        rnfs.mkdir(`${downloadPath}/FJSEIMOD/${firstHalf}/${secondHalf}/`);
        rnfs.mkdir(`${downloadPath}/${reportCode}/`);
        rnfs.mkdir(`${downloadPath}/FJSEIPIC/`);
        console.debug('生成文件夹', downloadPath);
        let tasks = [
            {
                fileName: 'testlog.pdf',
                downloadPath: `/module/${firstHalf}/${secondHalf}/`,
                savePath: `${downloadPath}/FJSEIMOD/${firstHalf}/${secondHalf}/`,
                checkFile: true,
                encrypt: false,
            },
            {
                fileName: 'testlogcfg.ses',
                downloadPath: `/module/${firstHalf}/${secondHalf}/`,
                savePath: `${downloadPath}/FJSEIMOD/${firstHalf}/${secondHalf}/`,
                checkFile: false,
                encrypt: false,
            },
            {
                fileName: 'systemlog.ses',
                downloadPath: `/module/pdfcfg/`,
                savePath: `${downloadPath}/${reportCode}/`,
                checkFile: true,
                encrypt: false,
            },
            {
                fileName: 'source.ses',
                downloadPath: `/${taskDataPath}/`,
                savePath: `${downloadPath}/${reportCode}/`,
                checkFile: false,
                encrypt: true,
            },
            {
                fileName: 'testlog.pdf',
                downloadPath: `/module/${firstHalf}/${secondHalf}/`,
                savePath: `${downloadPath}/${reportCode}/`,
                checkFile: true,
                encrypt: false,
            },
        ];
        if (typeof ispUsers === 'undefined' || ispUsers === '') {
            return tasks;
        } else {
            // 遍历所有用户ID，下载.png文件
            const userIds = ispUsers.split(',');
            userIds.forEach((item) => {
                tasks.concat([
                    {
                        fileName: `${item}.png`,
                        downloadPath: `/userpic/`,
                        savePath: `${downloadPath}/FJSEIPIC/`,
                        checkFile: false,
                        encrypt: false,
                    },
                    {
                        fileName: `${item}.png`,
                        downloadPath: `/userpic/`,
                        savePath: `${downloadPath}/${reportCode}/`,
                        checkFile: true,
                        encrypt: false,
                    },
                ]);
            });
            return tasks;
        }
    };

    /**
     * 获取下载任务列表
     *
     * @static
     * @param {*} ip ftp服务器IP地址
     * @param {*} port 端口号
     * @param {*} username 用户名
     * @param {*} password 密码
     * @param {*} taskPaths 任务相关文件地址信息集合
     * @return {*} 下载的任务列表
     * @memberof FileManager
     */
    static async getFtpDownloadTasks(ip, port, username, password, taskPaths) {
        const getTaskInfo = async (taskPaths) => {
            let tasks = [];
            for (let index = 0; index < taskPaths.length; index++) {
                const task = {
                    uuid: await UUIDGenerator.getRandomUUID(),
                    ip: ip,
                    port: port,
                    username: username,
                    password: password,
                    remotePath: taskPaths[index].downloadPath,
                    localPath: taskPaths[index].savePath,
                    filename: taskPaths[index].fileName,
                    isActiveMode: false,
                };
                tasks.push(task);
            }
            return tasks;
        };
        return await getTaskInfo(taskPaths);
    }

    /**
     * 获取下载的任务组
     *
     * @static
     * @param {*} ip ftp服务器IP地址
     * @param {*} port 端口号
     * @param {*} username 用户名
     * @param {*} password 密码
     * @param {*} tasks 下载任务列表
     * @return {*}
     * @memberof FileManager
     */
    static async getFtpDownloadTaskGroups(ip, port, username, password, tasks) {
        let asynFun2 = async (tasks) => {
            let taskGroups = [];
            for (let index = 0; index < tasks.length; index++) {
                console.debug('tasks[index]', tasks);
                console.debug('tasks[index]', tasks[index]);
                console.debug('detail: ', tasks[index].LOG_MODULE_COD, tasks[index].REPORT_COD, tasks[index].OPE_USERS_ID, tasks[index].DATA_PATH);
                const task = {
                    uuid: await UUIDGenerator.getRandomUUID(),
                    tasks: await FileManager.getFtpDownloadTasks(ip, port, username, password, FileManager.getMouldFilesPath(tasks[index].LOG_MODULE_COD, tasks[index].REPORT_COD, tasks[index].OPE_USERS_ID), tasks[index].DATA_PATH),
                };
                console.debug('task--------');
                taskGroups.push(task);
            }
            return taskGroups;
        };
        let taskGroups = await asynFun2(tasks);
        return taskGroups;
    }

    /**
     * 执行任务组的下载
     *
     * @static
     * @param {*} taskGroups 下载的任务组
     * @return {*}
     * @memberof FileManager
     */
    static async ftpDownloadGroups(taskGroups) {
        const tasks = JSON.stringify(taskGroups);

        Log.debug(`ftpDownload start: ${tasks}`);
        const result = await _FileManager.download(tasks);
        Log.debug(`ftpDownload result: ${result}`);
        return result;
    }

    /**
     * 获取下载信息
     *
     * @static
     * @param {*} groupUuid 任务组ID，可空
     * @return {*} 下载进度信息
     * @memberof FileManager
     */
    static async getDownloadTasks(groupUuid) {
        Log.debug(`ftpDownload groupUuid: ${groupUuid}`);
        const result = await _FileManager.getDownloadTasks(groupUuid);
        Log.debug(`ftpDownload groupResult: ${result}`);
        return result;
    }

    /**
     * ftp文件下载
     *
     * @static
     * @param {*} ip ftp服务器IP地址
     * @param {*} port 端口号
     * @param {*} username 用户名
     * @param {*} password 密码
     * @param {*} remotePath 线上下载文件的路径
     * @param {*} filename 文件名称
     * @memberof FileManager
     */
    static async ftpDownload(ip, port, username, password, remotePath, filename) {
        const tasks = JSON.stringify([
            {
                uuid: await UUIDGenerator.getRandomUUID(),
                tasks: [
                    {
                        uuid: await UUIDGenerator.getRandomUUID(),
                        ip: ip,
                        port: port,
                        username: username,
                        password: password,
                        remotePath: remotePath,
                        localPath: downloadPath,
                        filename: filename,
                        isActiveMode: false,
                    },
                ],
            },
        ]);

        Log.debug(`ftpDownload start: ${tasks}`);
        const result = await _FileManager.download(tasks);
        Log.debug(`ftpDownload result: ${result}`);
    }

    static async testFtpDownload() {
        await this.ftpDownload('27.151.117.67', 10089, '11', '$350100$', '/', 'developer_guide_android_CN.pdf');
    }

    /**
     * 获取上传信息
     *
     * @static
     * @param {*} groupUuid 任务组ID，可空
     * @return {*} 上传进度信息
     * @memberof FileManager
     */
    static async getUploadTasks(groupUuid) {
        const result = await _FileManager.getUploadTasks(groupUuid);
        return result;
    }

    /**
     * 获取上传任务列表
     *
     * @static
     * @param {*} ip ftp服务器IP地址
     * @param {*} port 端口号
     * @param {*} username 用户名
     * @param {*} password 密码
     * @param {*} uploadGroups 上传任务信息
     * @return {*} 下载的任务列表
     * @memberof FileManager
     */
    static async getFtpUploadTasks(ip, port, username, password, uploadGroups) {
        const fileNames = ['testlog.pdf', 'systemlog.ses', 'changelog.ses', 'signmsg.ses', 'report.rep'];
        const getTaskInfo = async (uploadGroups) => {
            let taskGroups = [];
            for (let index = 0; index < uploadGroups.length; index++) {
                let tasks = [];
                for (i in fileNames) {
                    const task = {
                        uuid: await UUIDGenerator.getRandomUUID(),
                        ip: ip,
                        port: port,
                        username: username,
                        password: password,
                        remotePath: '/' + uploadGroups[index].dataPath,
                        localPath: `${downloadPath}/${uploadGroups[index].reportCod}`,
                        filename: fileNames[i],
                        isActiveMode: false,
                    };
                    tasks.push(task);
                }
                const groupInfo = {
                    uuid: await UUIDGenerator.getRandomUUID(),
                    tasks: tasks,
                };
                taskGroups.push(groupInfo);
            }
            return taskGroups;
        };
        return await getTaskInfo(uploadGroups);
    }

    /**
     * 文件上传
     *
     * @param {*} tasks 上传任务列表
     */
    static async ftpUpload(groups) {
        console.debug('ftpUpload:', groups);
        if (groups.length === 0) {
            return { code: 1, message: '上传任务为空！' };
        }
        let flag = true;
        for (gIndex in groups) {
            const tasks = groups[gIndex].tasks;
            for (tIndex in tasks) {
                const task = tasks[tIndex];
                flag = await rnfs.exists(task.localPath + '/' + task.filename);
                if (!flag) {
                    return {
                        code: 1,
                        message: `文件${task.filename}不存在`,
                    };
                }
            }
        }
        const result = await _FileManager.upload(JSON.stringify(groups));
        if (!result) {
            return {
                code: 1,
                message: '上传失败！',
            };
        }
        Log.debug(`ftpupload result: ${result}`);
        return { code: 0, message: '上传中。。。' };
    }
}
