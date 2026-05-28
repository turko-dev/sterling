// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {

  getDecks: (filePath: string) => {
    return ipcRenderer.invoke("get-decks", filePath);
  },
  addDeck: (deckName: string) => {
    return ipcRenderer.invoke("add-deck", deckName);
  },
  deleteDeck: (key: number) => {
    return ipcRenderer.invoke("delete-deck", key)
  },
  renameDeck: (key: number, rename: string) => {
    return ipcRenderer.invoke("rename-deck", key, rename)
  },
  getCardsFromDeck: (key: number) => {
    return ipcRenderer.invoke("get-cards-from-deck", key)
  },
  addCard: (deckId: string, front: string, back: string) => {
    return ipcRenderer.invoke("add-card", deckId, front, back)
  }
  
});