<template>
    <div class="fd-nav">
        <div class="fd-nav-left">
            <div class="fd-nav-back">
                <i class="anticon anticon-left"></i>
            </div>
            <div class="fd-nav-title">{{ title}}</div>
        </div>

        <div class="fd-nav-center">
            <div class="step-tab">
                <div v-for="(item, index) in steps" :key="index" class="step"
                    :class="[activeStep == item.key ? 'active' : '']" @click="changeSteps(item)">
                    <span class="step-index">{{ index + 1 }}</span>
                    {{ item.label }}
                </div>
            </div>
        </div>
        <div class="fd-nav-right">
            <button type="button" class="ant-btn button-publish" @click="publish">
                <span>发 布</span>
            </button>
        </div>
    </div>
    <div style="position: absolute;top:80px;left: 60px;z-index: 10">
      <button class="ant-btn button-publish" type="button" @click="onPrint">打印</button>
    </div>
    <div v-if="processConfig"  v-show="activeStep === 'basicSetting'" >
        <BasicSetting ref="basicSetting"  :basicData="processConfig" @nextChange="changeSteps" />
    </div>
    <div v-if="nodeConfig" v-show="activeStep === 'processDesign'">
        <Process ref="processDesign"   :processData="nodeConfig" @nextChange="changeSteps" />
    </div>
</template>

<script setup>
import { ref, onMounted  } from "vue";
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { getMockWorkFlowData } from '@/api/index';
import { getApiWorkFlowData, setApiWorkFlowData } from '@/api/jdCloudApi';
import { FormatUtils } from '@/utils/formatcommit_data' 
import { FormatDisplayUtils } from '@/utils/formatdisplay_data'
import { showLoading, closeLoading } from '@/utils/loading'
const route = useRoute(); 
const basicSetting = ref(null);
const processDesign = ref(null);
import { getNodeMap } from './index'

let activeStep = ref("processDesign"); // 激活的步骤面板

let steps = ref([
    { label: "基础设置", key: "basicSetting" },
    { label: "流程设计", key: "processDesign" },
]);

const changeSteps = (item) => {
    activeStep.value = item.key;
};

let processConfig = ref(null);
let nodeConfig = ref(null);
let title = ref('');  
onMounted(async () => { 
    showLoading();
    let mockjson = {};
    if (route.query.id) {
        mockjson = await getApiWorkFlowData({ id: route.query.id });
    } else {
        mockjson = await getMockWorkFlowData({ id: 0 });
    }
    let data = FormatDisplayUtils.getToTree(mockjson.data); 
    processConfig.value = data;
    title.value = data.bpmnName;
    const options = {"confId":35,"nodeId":"Gb2","nodeType":1,"nodeProperty":1,"nodePropertyName":null,"nodeFrom":"","nodeFroms":null,"prevId":[],"batchStatus":0,"approvalStandard":2,"nodeName":"发起人","nodeDisplayName":"发起人","annotation":null,"isDeduplication":0,"isSignUp":0,"orderedNodeType":null,"remark":"","isDel":0,"nodeTo":["UcgYu4"],"property":null,"params":null,"buttons":{"startPage":[],"approvalPage":[2],"viewPage":null},"templateVos":null,"approveRemindVo":null,"formCode":"PROJECT_uoSXu4","conditionNodes":[],"childNode":{"nodeId":"TPAZ3D","nodeName":"审核人","nodeType":4,"nodeFrom":"","prevId":[],"nodeTo":[],"setType":2,"directorLevel":1,"signType":1,"noHeaderAction":2,"childNode":{"nodeId":"UcgYu4","nodeName":"路由","nodeType":2,"nodeFrom":"Gb2","prevId":[],"nodeTo":["IhgYu4","TkgYu4"],"error":true,"property":null,"conditionNodes":[{"nodeId":"IhgYu4","nodeName":"条件1","nodeDisplayName":"总支出金额 < 2000","nodeType":3,"nodeFrom":"UcgYu4","prevId":[],"nodeTo":["YviYu4"],"priorityLevel":1,"nodeApproveList":[],"error":false,"isDefault":0,"conditionList":[{"showType":"1","columnId":"1","type":2,"showName":"总支出金额","optType":"1","zdy1":"2000","opt1":"<","zdy2":"","opt2":"<","columnDbname":"parkArea","columnType":"Double"}],"conditionNodes":[],"childNode":{"nodeId":"YviYu4","nodeName":"审核人2","nodeType":4,"nodeFrom":"IhgYu4","prevId":[],"nodeTo":[],"setType":1,"directorLevel":1,"signType":1,"noHeaderAction":1,"error":false,"nodeProperty":5,"nodeApproveList":[{"type":1,"targetId":6,"name":"马八"}],"conditionNodes":[],"nodeDisplayName":"马八"}},{"nodeId":"TkgYu4","nodeName":"条件2","nodeDisplayName":"总支出金额 < 2","nodeType":3,"nodeFrom":"UcgYu4","prevId":[],"nodeTo":[],"priorityLevel":2,"nodeApproveList":[],"isDefault":0,"error":false,"conditionList":[{"showType":"1","columnId":"1","type":2,"showName":"总支出金额","optType":"1","zdy1":"2","opt1":"<","zdy2":"","opt2":"<","columnDbname":"outTotalMoney","columnType":"Double"}],"conditionNodes":[],"childNode":{"nodeId":"PICZ3D","nodeName":"路由","nodeType":2,"nodeFrom":"","prevId":[],"nodeTo":[],"childNode":{"nodeId":"DUDZ3D","nodeName":"审核人3","nodeType":4,"nodeFrom":"","prevId":[],"nodeTo":[],"setType":2,"directorLevel":1,"signType":1,"noHeaderAction":2,"childNode":null,"error":false,"property":null,"nodeApproveList":[],"nodeDisplayName":"直接主管"},"error":true,"property":null,"conditionNodes":[{"nodeId":"VBCZ3D","nodeName":"条件4","nodeDisplayName":"总支出金额 < 2","nodeType":3,"nodeFrom":"","prevId":[],"nodeTo":[],"priorityLevel":1,"conditionList":[{"showType":"1","columnId":"1","type":2,"showName":"总支出金额","optType":"1","zdy1":"2","opt1":"<","zdy2":"","opt2":"<","columnDbname":"outTotalMoney","columnType":"Double"}],"nodeApproveList":[],"error":false,"isDefault":0,"childNode":null},{"nodeId":"HGCZ3D","nodeName":"条件5","nodeDisplayName":"总支出金额 < 2","nodeType":3,"nodeFrom":"","prevId":[],"nodeTo":[],"priorityLevel":2,"conditionList":[{"showType":"1","columnId":"1","type":2,"showName":"总支出金额","optType":"1","zdy1":"2","opt1":"<","zdy2":"","opt2":"<","columnDbname":"outTotalMoney","columnType":"Double"}],"nodeApproveList":[],"childNode":null,"isDefault":0,"error":false}]}},{"nodeId":"MTAZ3D","nodeName":"条件3","nodeType":3,"nodeFrom":"","prevId":[],"nodeTo":[],"priorityLevel":3,"conditionList":[{"showType":"1","columnId":"1","type":2,"showName":"总支出金额","optType":"1","zdy1":"2","opt1":"<","zdy2":"","opt2":"<","columnDbname":"outTotalMoney","columnType":"Double"}],"nodeApproveList":[],"childNode":null,"isDefault":0,"error":false,"nodeDisplayName":"总支出金额 < 2"}],"childNode":{"nodeId":"W1EZ3D","nodeName":"审核人4","nodeType":4,"nodeFrom":"","prevId":[],"nodeTo":[],"setType":2,"directorLevel":1,"signType":1,"noHeaderAction":2,"childNode":null,"error":false,"property":null,"nodeApproveList":[],"nodeDisplayName":"直接主管"}},"error":false,"property":null,"nodeApproveList":[],"nodeDisplayName":"直接主管"}}
    // nodeConfig.value = data.nodeConfig;
    nodeConfig.value = options
    closeLoading();
});
 
const publish = () => {
    const step1 = basicSetting.value.getData();
    const step2 = processDesign.value.getData();
    Promise.all([step1, step2])
        .then((res) => {
            ElMessage.success("设置成功,F12控制台查看数据");
            let basicData = res[0].formData;  
            var nodes = FormatUtils.formatSettings(res[1].formData); 
            Object.assign(basicData, { nodes: nodes });
            return basicData;
        })
        .then((data) => { 
           console.log("提交到API=data================================",data);
        
            // setApiWorkFlowData(data).then((resLog) => {
            //     if (resLog.code == 200) { 
            //         console.log("提交到API返回成功"); 
            //     }else {
            //         console.log("提交到API返回失败=",JSON.stringify(resLog));
            //     } 
            // });
        })
        .catch((err) => {
            if (err && err.msg)
                ElMessage.error("设置失败" + JSON.stringify(err.msg));
        });
};

function onPrint() {
  console.log('nodeConfig', nodeConfig.value)
  console.log('nodeConfig2', JSON.stringify(nodeConfig.value))
  console.log(getNodeMap(nodeConfig.value))
}

</script>
<style scoped>
.step-tab {
    display: flex;
    justify-content: center;
    position: relative;
    height: 60px;
    font-size: 14px;
    border-right: 0px solid #1583f2;
    text-align: center;
    cursor: pointer
}

.fd-nav .step {
    width: 140px;
    line-height: 100%;
    padding-left: 30px;
    padding-right: 30px;
    line-height: 60px;
    cursor: pointer;
    position: relative;
}

.fd-nav .step:hover {
    background: #5af
}

.fd-nav .step:active {
    background: #1583f2
}

.fd-nav .active {
    background: #5af;
}

.fd-nav .step-index {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1px solid #fff;
    border-radius: 8px;
    line-height: 18px;
    text-align: center;
    box-sizing: border-box;
}
</style>