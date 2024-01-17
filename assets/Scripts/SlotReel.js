
const Reels = cc.Class({
    extends: cc.Component,

    properties: {
        symbols: cc.Prefab,
        atlas: cc.SpriteAtlas,
    },

    onLoad() {
        this.REEL_CONFIG = {
            TOTAL_SYMBOLS: 5,
            SYMBOL_CONFIG: {
                WIDTH: 80,
                HEIGHT: 80
            }
        };
        this.symbolPositions = [];
        this.initSymbols();

        this.symbols = this.node.children;
        this.topPosition = 400;
        this.count = 0;
    },

    initSymbols() {
        for (let i = this.REEL_CONFIG.TOTAL_SYMBOLS - 1; i >= 0; i-- ) {
            let symbol = cc.instantiate(this.symbols);
            symbol.parent = this.node;
            
            let yPos = i * this.REEL_CONFIG.SYMBOL_CONFIG.HEIGHT;
            symbol.setPosition(cc.v2(0, yPos));
            this.symbolPositions.push(cc.v2(0, yPos)); 
        }   
    },

    reset() {
        this.node.stopAllActions();
        for (let i = 0; i < this.REEL_CONFIG.TOTAL_SYMBOLS; i++) {
            let symbol = this.node.children[i]; 
            symbol.stopAllActions();
            symbol.setPosition(this.symbolPositions[i]); 
            symbol.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('default');
        }
        this.count = 0;
    },

    playReel(data, callback) {
        this.data = data;
        this.finishedCallback = callback;
        this.playReelAnimation();
    },

    playReelAnimation() {
        this.updateSymbolId();
        this.hideSymbol(() => {
            if (this.data[this.count + 1]) {
                this.playReelAnimation();
            } else {
                this.finishCallback();
            }
        })
    },

    updateSymbolId() {
        const { matrix } = this.data[this.count];
        this.symbols.forEach((symbol, index) => {
            const symbolId = matrix[index];
            let spriteFrameName = `symbol${symbolId}`;
            symbol.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(spriteFrameName);
        });
    },
    

    hideSymbol(callback) {
        let countToMove = 0;
        const {removeIndex } = this.data[this.count];
        removeIndex.forEach(symbolIndex => {
            this.symbols.forEach((symbol, index) => {
                if (index == symbolIndex) {
                    symbol.y = this.topPosition + this.REEL_CONFIG.SYMBOL_CONFIG.HEIGHT * countToMove;
                    countToMove++;
                }
            });
        });
        this.count++; 
        this.symbols.sort((a, b) => b.y - a.y);
        this.setCallback(2, callback);
        this.updateSymbolId();
    },  

    setCallback(time, callback) {
        this.node.runAction(cc.sequence(
            cc.delayTime(time),
            cc.callFunc(() => {
                callback && callback();
            })
        ));
    },     

    finishCallback() {
        this.finishedCallback && this.finishedCallback();
        this.finishedCallback = null;
    },
}); 

module.exports = Reels;