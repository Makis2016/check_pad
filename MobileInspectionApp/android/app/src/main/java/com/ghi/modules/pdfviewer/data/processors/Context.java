package com.ghi.modules.pdfviewer.data.processors;

import android.app.AlertDialog;

import com.blankj.utilcode.util.CloneUtils;
import com.blankj.utilcode.util.FileUtils;
import com.blankj.utilcode.util.LogUtils;
import com.blankj.utilcode.util.StringUtils;
import com.blankj.utilcode.util.TimeUtils;
import com.blankj.utilcode.util.ToastUtils;
import com.foxit.sdk.PDFException;
import com.foxit.sdk.pdf.PDFDoc;
import com.foxit.sdk.pdf.PDFPage;
import com.foxit.sdk.pdf.graphics.GraphicsObject;
import com.foxit.sdk.pdf.interform.Field;
import com.ghi.miscs.JsonUtils;
import com.ghi.miscs.MapUtils;
import com.ghi.miscs.PdfUtils;
import com.ghi.miscs.event.RnEventEmitter;
import com.ghi.modules.pdfviewer.PdfViewer;
import com.ghi.modules.pdfviewer.data.core.BindingData;
import com.ghi.modules.pdfviewer.data.core.BindingDataMap;
import com.ghi.modules.pdfviewer.data.core.FieldNames;
import com.ghi.modules.pdfviewer.data.entities.ChangeResult;
import com.ghi.modules.pdfviewer.data.entities.ModifyLog;
import com.ghi.modules.pdfviewer.data.entities.Signature;
import com.ghi.modules.pdfviewer.data.entities.SystemLog;
import com.ghi.modules.pdfviewer.data.entities.TaskInformation;
import com.ghi.modules.pdfviewer.data.thirdparty.Compatible;
import com.ghi.modules.pdfviewer.data.thirdparty.compatibility.XMLUtil;
import com.ghi.modules.pdfviewer.data.validators.CheckErrorValidator;
import com.ghi.modules.pdfviewer.data.validators.CheckResultValidator;
import com.ghi.modules.pdfviewer.data.validators.DateValidator;
import com.ghi.modules.pdfviewer.data.validators.MeasureValidator;
import com.ghi.modules.pdfviewer.data.validators.RequiredValidator;
import com.ghi.modules.pdfviewer.data.validators.ResultValidator;
import com.ghi.modules.pdfviewer.data.validators.Validator;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

import org.json.JSONException;

import java.io.Closeable;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import lombok.Getter;
import lombok.Setter;

/**
 * 加载器上下文
 *
 * @author etrit
 */
@Getter
@Setter
public final class Context implements Closeable, BindingData.BindingDataEventListener {
    /**
     * 报告文件名称
     */
    private static final String REPORT_FILE_NAME = "/report.rep";

    /**
     * 复检标志
     */
    private static final String IS_REINSPECTION = "1";

    /**
     * 标志
     */
    private static final String 是 = "是";

    /**
     * 定检标志
     */
    private static final String 定检 = "3";

    /**
     * 监检标志
     */
    private static final String[] 监检 = {"2", "14", "15"};

    /**
     * 结论标志
     */
    private static final String 不合格 = "不合格";

    /**
     * 结论标志
     */
    private static final String 复检不合格 = "复检不合格";

    /**
     * 未定义标志
     */
    private static final String UNDEFINED = "/";

    /**
     * 结论
     */
    private static final String[] Conclusions = new String[]{"合格", "不合格", "复检合格", "复检不合格"};

    /**
     * 校验器集合
     */
    private static final Validator[] VALIDATORS = new Validator[]{
            new CheckResultValidator(),
            new RequiredValidator(),
            new CheckErrorValidator(),
            new MeasureValidator(),
            new DateValidator(),
            new ResultValidator(),
    };

    /**
     * 阅读器
     */
    private final PdfViewer viewer;

    /**
     * 路径
     */
    private final String path;

    /**
     * 设备信息
     */
    private final TaskInformation taskInformation;

    /**
     * 系统文件配置
     */
    private final SystemLog systemLog;

    /**
     * 修改日志
     */
    private final List<Map<String, List<ModifyLog>>> changeLog;

    /**
     * 绑定数据列表
     */
    private final BindingDataMap map;

    /**
     * 域列表
     */
    private final Map<String, String> fields;

    /**
     * 基础信息
     */
    private final Map<String, String> information;

    /**
     * 模板配置
     */
    private final Map<String, JsonElement> configurations;

    /**
     * 不合格项目列表
     */
    private List<Map<String, String>> failedFields = new ArrayList<>();

    /**
     * 签名列表
     */
    private List<Signature> signatures = new ArrayList<>();

    /**
     * 验签的结果 -1为不需要电子签字的报告 0为验签不成功的 1为验签成功的
     */
    private String isSigned = "";

    /**
     * 构造函数
     *
     * @param viewer          阅读器
     * @param taskInformation 设备信息
     * @param systemLog       系统文件配置
     * @param changeLog       修改日志
     * @param information     基础信息
     * @param configurations  模板配置
     * @throws PDFException 异常
     */
    public Context(final PdfViewer viewer, final String path, final TaskInformation taskInformation, final SystemLog systemLog, final List<Map<String, List<ModifyLog>>> changeLog, final Map<String, String> information, final Map<String, JsonElement> configurations) throws PDFException {
        this.viewer = viewer;
        this.path = path;
        this.taskInformation = taskInformation;
        this.systemLog = systemLog;
        this.changeLog = changeLog;
        this.information = information;
        this.configurations = configurations;
        this.map = BindingDataMap.create(this.viewer.getUiExtensionsManager());
        this.fields = new ConcurrentHashMap<>();
    }

    /**
     * 获取临时PDF文件路径
     *
     * @param filename PDF文件路径
     * @return 文件路径
     */
    private static String getTempPdfFilename(final String filename) {
        return filename + "tmp";
    }

    /**
     * 获取报告文件路径
     *
     * @param path       路径
     * @param reportCode 报告号
     * @return 文件路径
     */
    private static String getReportFilename(final String path, final String reportCode) {
        return path + File.separator + reportCode + REPORT_FILE_NAME;
    }

    @Override
    public void close() throws IOException {
        // TODO: 注销回调函数
    }

    /**
     * @return 是否为空白原始记录首次打开
     */
    public boolean isFirstOpenWithEmptyFile() {
        // 是否首次打开的判断规则包含以下：
        //（1）	firstopen字段为0。打开后点保存时将其置为1，表示已经打开修改过。
        //（2）	PDF文件中eqp_cod域的值和当前打开的设备号不一致。
        // 空白原始记录首次打开: firstopen：0，其余标志也为0或者设备号不符
        return ((systemLog.getFirstopen() == 0) && (systemLog.getCopyflag() == 0) && (systemLog.getCopydataflag() == 0)) || !map.equals(FieldNames.EQP_COD, taskInformation.getEqpCode());
    }

    /**
     * @return 是否为PDF文件复制首次打开
     */
    public boolean isFirstOpenWithFileCopied() {
        // 复制的pdf原始记录首次打开: Copyflag=1，firstopen=0
        return ((systemLog.getFirstopen() == 0) && (systemLog.getCopyflag() == 1));
    }

    /**
     * @return 是否为数据复制首次打开
     */
    public boolean isFirstOpenWithDataCopied() {
        // 数据复制首次打开: copydataflag标志为1，firstopen标志为0
        return ((systemLog.getFirstopen() == 0) && (systemLog.getCopydataflag() == 1));
    }

    /**
     * @return 是否为复检首次打开
     */
    public boolean isReinspection() {
        // 复检原始记录首次打开: 复检标志为是
        // TODO: 确认如何判定复检原始记录首次打开
        // RE_ISP：是否复检，1为是。
        return IS_REINSPECTION.equals(taskInformation.getRepIs());
    }

    /**
     * @return 是否为报告书修订报告
     */
    public boolean isFixReport() {
        // TODO: if_fixrep：是否报告书修订报告，1为是。
        return false;
    }

    /**
     * @return 是否为定检
     */
    public boolean isRegularInspection() {
        // 定检情况（ope_tyep=3）
        return 定检.equals(taskInformation.getOpeType());
    }

    /**
     * @return 是否为监检
     */
    public boolean isSupervision() {
        // 监检情况（ope_type=2、14、15）
        return Arrays.asList(监检).contains(taskInformation.getOpeType());
    }

    /**
     * @return 是否为限速器校验
     */
    public boolean isLimit() {
        // 是否限速器校验（if_limit = 1）
        return 是.equals(taskInformation.getIfLimit());
    }

    /**
     * 获取结论所在页面
     *
     * @return 页面
     */
    public PDFPage getResultPage() {
        final BindingData data = map.get(FieldNames.RESULT);
        if (data == null) {
            return null;
        }

        return PdfUtils.getPage(data.getField());
    }

    /**
     * 清除结论
     */
    public void clearResult() {
        PDFPage page = getResultPage();
        if (page == null) {
            return;
        }

        try {
            while (page.getGraphicsObjectCount() > 0) {
                GraphicsObject go = page.getGraphicsObject(0);
                page.removeGraphicsObject(go);
            }
        } catch (Exception e) {
            LogUtils.e(e);
        }
    }

    /**
     * 计算下检日期
     */
    public void calculateEffDate() {
        // 若结论为不合格则设置下检日期
        BindingData result = map.get(FieldNames.RESULT);
        if ((result != null) && (result.getValue() != null)) {
            String content = result.getValue().toString();
            if (不合格.equals(content) || 复检不合格.equals(content)) {
                map.set(FieldNames.EFF_DATE, UNDEFINED);
                return;
            }
        }

        // 检查检验日期域是否存在并有内容
        BindingData ispDate = map.get(FieldNames.ISP_DATE);
        if ((ispDate == null) || (ispDate.getValue().toString().length() == 0) || (UNDEFINED.equals(ispDate.getValue()))) {
            return;
        }

        String taskDate = taskInformation.getTaskDate();
        String cycle = information.get(FieldNames.ISP_CYCLE);
        String opeType = taskInformation.getIspType();

        String IF_METALLURGY = information.get(FieldNames.IF_METALLURGY);
        if (map.get(FieldNames.IF_METALLURGY) != null) {
            IF_METALLURGY = map.get(FieldNames.IF_METALLURGY).getValue().toString();
        }
        if ("1".equals(IF_METALLURGY)) {
            cycle = "12";
        }

        String EQP_USE_OCCA = information.get(FieldNames.EQP_USE_OCCA);
        if (map.get(FieldNames.EQP_USE_OCCA) != null) {
            EQP_USE_OCCA = map.get(FieldNames.EQP_USE_OCCA).getValue().toString();
        }
        if ("吊运熔融金属".equals(EQP_USE_OCCA)) {
            cycle = "12";
        }

        java.sql.Date effDate = Compatible.getFactEffDate(ispDate.getValue().toString(), taskDate, Integer.parseInt(cycle), opeType);
        map.set(FieldNames.EFF_DATE, new SimpleDateFormat("yyyy-MM-dd", Locale.CHINESE).format(effDate));
    }

    /**
     * 下结论
     */
    public void makeConclusion() {
        PDFPage page = getResultPage();
        if (page == null) {
            return;
        }

        // 进行域内容验证
        if (!checkPdf()) {
            return;
        }

        // 跳转到指定页面
        PdfUtils.gotoPage(viewer.getUiExtensionsManager().getPDFViewCtrl(), page);

        // 显示对话框
        new AlertDialog.Builder(viewer.getActivity()).setTitle("现场检验意见").setItems(Conclusions, (dialog, which) -> {
            switch (which) {
                case 0:
                    final BindingData dateField = map.get("COR_DATE");
                    final BindingData codeField = map.get("COR_NOTES");
                    if (dateField != null && !"/".equals(dateField.getValue()) && !"／".equals(dateField.getValue())) {
                        ToastUtils.showLong("选择合格，但是整改反馈确认期限及检查意见通知书编号不为'/'");
                        return;
                    }
                    if (codeField != null && !"/".equals(codeField.getValue()) && !"／".equals(codeField.getValue())) {
                        ToastUtils.showLong("选择合格，但是整改反馈确认期限及检查意见通知书编号不为'/'");
                        return;
                    }
                    break;
                case 1:
                case 3:
                    final BindingData effDateField = map.get("EFF_DATE");
                    if (effDateField != null) {
                        effDateField.setValue("/");
                    }
                    break;
                case 2:
                    break;
                default:
                    return;
            }

            // 设置结论
            MapUtils.setValue(map, FieldNames.RESULT, (bindingData) -> bindingData.setValue(Conclusions[which]));
        }).show();
    }

    /**
     * 保存
     *
     * @return 是否成功
     */
    public boolean save() {
        if (!generateReport()) {
            return false;
        }

        try {
            savePdf(Loader.getPdfFilename(path, taskInformation.getReportCode()));
            return true;
        } catch (PDFException e) {
            LogUtils.e(e);
            return false;
        }
    }

    /**
     * 生成报告文件
     *
     * @return 是否成功
     */
    public boolean generateReport() {
        final List<ChangeResult> changeResults = JsonUtils.getArray(configurations, FieldNames.CHANGE_RESULT, new TypeToken<ArrayList<ChangeResult>>() {
        }.getType());
        // TODO: 实现signatures、checkUser、isSigned
        return XMLUtil.createRepFile(getReportFilename(path, taskInformation.getReportCode()), map, configurations, changeResults, signatures, false, fields, isSigned);
    }

    /**
     * 保存PDF文件
     *
     * @param filename 文件名
     * @throws PDFException 异常
     */
    public void savePdf(final String filename) throws PDFException {
        final String tempFilename = getTempPdfFilename(filename);
        final PDFDoc document = this.viewer.getUiExtensionsManager().getPDFViewCtrl().getDoc();

        // 保存临时文件
        document.saveAs(tempFilename, 0);

        // 复制目标文件
        FileUtils.delete(filename);
        FileUtils.copy(tempFilename, filename);
    }

    /**
     * 复制PDF文件
     *
     * @param reportCodes 报告号列表
     * @throws PDFException 异常
     */
    public void copyPdf(final List<String> reportCodes) throws PDFException {
        // 保存PDF文件
        final String source = Loader.getPdfFilename(path, taskInformation.getReportCode());
        savePdf(source);

        // 遍历设备号列表
        for (String reportCode : reportCodes) {
            // 复制PDF文件和临时PDF文件
            final String filename = Loader.getPdfFilename(path, reportCode);
            final String tempFilename = getTempPdfFilename(filename);
            FileUtils.copy(source, filename);
            FileUtils.copy(source, tempFilename);

            // 复制系统文件配置
            final SystemLog systemLog = CloneUtils.deepClone(this.systemLog, SystemLog.class);
            systemLog.setCopyflag(1);
            systemLog.setFirstopen(0);
            systemLog.setCopyfrom_eqp_cod(taskInformation.getEqpCode());
            SystemLogConfiguration.write(path, reportCode, systemLog);

            // 复制修改日志
            final List<Map<String, List<ModifyLog>>> changeLog = new ArrayList<>(0);
            ModifyLogProcessor.write(path, reportCode, changeLog);

            // 添加修改日志
            ModifyLogProcessor.add(changeLog, new ModifyLog("复制PDF", reportCode, reportCode));
        }

        // 保存修改日志
        saveModifyLog();
    }

    /**
     * 复制原始记录数据
     *
     * @param reportCodes 报告号列表
     * @throws JSONException 异常
     */
    public void copyData(final List<String> reportCodes) throws JSONException {
        // 保存原始记录数据
        final String source = TestLogDataProcessor.getFilename(path, taskInformation.getReportCode());
        TestLogDataProcessor.write(path, taskInformation.getReportCode(), map);

        // 遍历设备号列表
        for (String reportCode : reportCodes) {
            // 复制原始记录数据
            final String filename = TestLogDataProcessor.getFilename(path, reportCode);
            FileUtils.copy(source, filename);

            // 复制系统文件配置
            final SystemLog systemLog = SystemLogConfiguration.read(path, reportCode);
            if (systemLog != null) {
                systemLog.setFirstopen(0);
                systemLog.setCopydataflag(1);
                systemLog.setCopyfrom_eqp_cod(taskInformation.getEqpCode());
                SystemLogConfiguration.write(path, reportCode, systemLog);
            }

            // 添加修改日志
            ModifyLogProcessor.add(changeLog, new ModifyLog("复制数据", reportCode, reportCode));
        }

        // 保存修改日志
        saveModifyLog();
    }

    /**
     * 保存修改日志
     */
    public void saveModifyLog() {
        ModifyLogProcessor.write(path, taskInformation.getReportCode(), changeLog);
    }

    /**
     * 填充测试数据
     */
    public void fillTestData() {
        for (BindingData data : map.values()) {
            if (data.getValue() == null || StringUtils.isEmpty(data.getValue().toString())) {
                if (data.getType() == Field.e_TypeComboBox) {
                    data.setValue(((List<?>) data.getOptions()).get(0));
                } else if (data.getName().toLowerCase().contains("date")) {
                    data.setValue(TimeUtils.date2String(new Date(), "yyyy-MM-dd"));
                } else if ((data.getFlags() & Field.e_FlagRequired) == Field.e_FlagRequired) {
                    data.setValue("test");
                }
            }
        }
    }

    @Override
    public void onChanged(final BindingData bindingData, final Object oldValue, final Object newValue) {
        // 所有的值一经修改，都要清除签字信息
        // 记录日志，每个检验员操作的动作都需要记录一次日志
        // 当选项变成×，结论又是合格的话，要清空结论，并且弹窗“请重新下结论”, 触发文本变更的域名为fname
    }

    /**
     * 检查PDF文档中是否有错误
     *
     * @return 是否有错误
     */
    private boolean checkPdf() {
        for (Validator validator : VALIDATORS) {
            if (!validator.validate(this)) {
                // 跳转到错误域所在页
                PdfUtils.gotoPage(viewer.getUiExtensionsManager().getPDFViewCtrl(), map.get(validator.getErrorFieldName()));
                // 显示错误提示
                RnEventEmitter.emit(viewer.getReactContext(), RnEventEmitter.EVENT_TOAST, validator.getErrorMessage());
                return false;
            }
        }

        return true;
    }
}
