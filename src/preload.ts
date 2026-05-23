// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {


  getTopics: (filePath: string) => {
    return ipcRenderer.invoke("get-topics", filePath);
  },
  addTopic: (topicName: string) => {
    return ipcRenderer.invoke("add-topic", topicName);
  },
  
});