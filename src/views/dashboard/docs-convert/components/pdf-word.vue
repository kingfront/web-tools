<template>
  <div class="pdf-word">
    <a-row :gutter="20">
      <a-col>
        <a-upload
          :custom-request="customRequest"
          :download="true"
          accept=".pdf"
        >
          <template #upload-button>
            <div
              style="
                width: 580px;
                height: 158px;
                color: var(--color-neutral-8);
                line-height: 158px;
                text-align: center;
                background-color: var(--color-fill-2);
                border: 1px dashed var(--color-fill-3);
                border-radius: 2;
              "
            >
              <div>
                拖拽PDF到这里 或者
                <span style="color: #3370ff"> 点击上传</span>
              </div>
            </div>
            <a-row v-if="loading" justify="center">
              <a-col :span="2"><a-spin tip="转换中..." dot /></a-col>
            </a-row>
          </template>
        </a-upload>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const loading = ref(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const customRequest = (option: any) => {
    let upEvent = {};
    const { onProgress, onError, onSuccess, fileItem, name } = option;
    const xhr = new XMLHttpRequest();
    if (xhr.upload) {
      xhr.upload.onprogress = function (event) {
        let percent;
        if (event.total > 0) {
          // 0 ~ 1
          percent = event.loaded / event.total - 0.2;
          loading.value = true;
        }
        upEvent = event;
        onProgress(percent, event);
      };
    }
    xhr.onerror = function error(e) {
      loading.value = false;
      onError(e);
    };
    // eslint-disable-next-line consistent-return
    xhr.onload = function onload() {
      const rep = JSON.parse(xhr.response);
      if (xhr.status < 200 || xhr.status >= 300 || rep.code !== 200) {
        loading.value = false;
        return onError(xhr.responseText);
      }
      loading.value = false;
      onProgress(1, upEvent);
      fileItem.url = baseUrl + rep.data.url;
      fileItem.name = rep.data.name;
      onSuccess(xhr.response);
    };
    const formData = new FormData();
    formData.append(name || 'file', fileItem.file);
    xhr.open('post', `${baseUrl}/api/pdfToWord`, true);
    xhr.send(formData);
    return {
      abort() {
        xhr.abort();
      },
    };
  };
</script>

<style scoped lang="less">
  .pdf-word {
    margin-top: 30px;
  }
</style>
