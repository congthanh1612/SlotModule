const dataStorage = require('DataStorage');

cc.Class({
    extends: cc.Component,

    properties: {
        dataPopup: cc.Label,
    },

    onLoad () {
        this.initFileSelector();
    },

    initFileSelector() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = '.json'; 

        input.addEventListener('change', this.loadFile.bind(this));
        input.click();
    },

    loadFile(event){
        const file = event.target.files[0];  
        const reader = new FileReader();
        reader.onload = (ev)=>{
            const data = JSON.parse(ev.target.result)   
            cc.log(data)
            dataStorage.instance.setData(data)
            this.dataPopup.node.emit('SHOWUP_DATA', data)
        }
        reader.readAsText(file)
    },
});
