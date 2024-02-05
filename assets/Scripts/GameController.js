const dataStorage = require('DataStorage');
const reels = require('SlotReel')

cc.Class({
    extends: cc.Component,

    properties: {
        reelSymbol: reels, 
        dataPopup: cc.Label,
        matrixInput: cc.EditBox,
        removeIndexInput: cc.EditBox,
    },

    onLoad() {
        dataStorage.instance = new dataStorage();
        cc.director.getPhysicsManager().enabled = true;
        this.dataPopup.node.on('SHOWUP_DATA', this.showupData, this)
        cc.log(this.matrixInput.enabled)
    },

    playAnimation(data) {
        this.onInputState(false);
        this.reelSymbol.playReel(data, () => { 
            this.onInputState(true);
            cc.warn("FINISHED!!!");
        });
    },

    startGame() {
        const inputData = dataStorage.instance.getData();
        if (!inputData || !inputData.length) {
            return cc.warn("There is no data to play!!!");
        }
        this.playAnimation(inputData);
    },

    resetGame() {
        this.onInputState(true);
        this.reelSymbol.reset();
        dataStorage.instance.clearData();
        this.dataPopup.string = '';
    },

    submitData() {
        if (!this.matrixInput.string.length) {
            return cc.warn("something went wrong!!!");
        }
        const inputData = dataStorage.instance.data;
        let matrix = this.matrixInput.string.split(",");
        const removeIdInput = this.removeIndexInput.string;
        const removeId = removeIdInput === "" ? [] : removeIdInput.split(',');

        if (matrix.length === 5 || removeId.length) {
            const data = { matrix: matrix, removeIndex: removeId };
            inputData.push(data);
            dataStorage.instance.setData(inputData);
            cc.log(inputData);
            this.showupData();

            this.matrixInput.string = "";
            this.removeIndexInput.string = "";
        } else {
            cc.warn("something went wrong!!!");
        }
    },

    showupData(){
        const inputData = dataStorage.instance.getData();
        let inputString = '';
        inputData.forEach((item, index) => {
            inputString += `Input ${index + 1}: `;
            inputString += `Matrix [${item.matrix.join(",")}], RemoveId [${item.removeIndex.join(",")}]\n`;
        });
        this.dataPopup.string = inputString;
    },

    onInputState(enable){
        this.matrixInput.enabled = enable;
        this.removeIndexInput.enabled = enable;
    },
 
});
