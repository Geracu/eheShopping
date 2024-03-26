const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
        const validSendChannels = ['verificarLogin', 'updateProduct', 'sendOrder'];
        if (validSendChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        const validReceiveChannels = ['respuestaLogin', 'productUpdateResponse', 'idEmpleado', 'orderResponse'];
        if (validReceiveChannels.includes(channel)) {
            ipcRenderer.removeAllListeners(channel);
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    recibirProductUpdateResponse: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },
    showAlert: (options) => ipcRenderer.invoke('show-alert', options),
    enviarProductos: (channel, data) => {
        const validSendChannels = ['solicitarProductos', 'solicitarProveedor', 'registrarPedido', 'idEmpleado', 'solicitarPedidosPendientes'];
        if (validSendChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    recibirProductos: (channel, func) => {
        const validReceiveChannels = ['enviarProductos', 'enviarProveedor', 'pedidoResponse', 'enviarPedidosPendientes'];
        if (validReceiveChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    receiveIdEmpleado: (callback) => ipcRenderer.on('obtain-idempleado', callback)
});




