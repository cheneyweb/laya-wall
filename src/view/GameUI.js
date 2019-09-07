import GameDirector from "../script/GameDirector"
/**
 * 游戏界面UI层
 */
export default class GameUI extends Laya.Scene {
    constructor() {
        super();
        GameUI.instance = this;
        //关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;
        //加载场景文件
        this.loadScene("GameUI.scene");
    }

    onEnable() {
        this._director = GameDirector.instance;
        //点击提示文字，开始游戏
        this.labelStart.on(Laya.Event.CLICK, this, this.startGame);
    }

    /**开始游戏 */
    startGame() {
        this.labelStart.visible = false;
        this._score = 0;
        this._director.startGame();
    }

    /**停止游戏 */
    stopGame() {
        this.labelStart.visible = true;
        this._director.stopGame();
    }

    /**增加分数 */
    addScore(value) {
        this._score += value;
        this.labelScore.changeText(`分数:${this._score}`);
        //随着分数越高，难度增大
        if (this._score % 20 == 0) {
            this._director.adjustLevel()
        }
    }
}