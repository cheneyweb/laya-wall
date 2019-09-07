/**
 * 游戏导演控制类
 */
export default class GameDirector extends Laya.Script {
    /** @prop {name:enemy,tips:"敌人预置对象",type:Prefab}*/
    /** @prop {name:weapon,tips:"武器预置对象",type:Prefab}*/
    /** @prop {name:bullet,tips:"子弹预置对象",type:Prefab}*/
    constructor() {
        super()
        GameDirector.instance = this
    }

    onEnable() {
        //是否已经开始游戏
        this._started = false
        //开始时间
        this._lastCreateEnemyTime = Date.now()
        //创建敌人时间间隔
        this._createEnemyInterval = 3000
        //敌人和子弹所在的容器
        this.spriteBox = this.owner.getChildByName("spriteBox")
    }

    onUpdate() {
        //每间隔一段时间创建敌人
        let now = Date.now()
        if (this._started && now - this._lastCreateEnemyTime > this._createEnemyInterval) {
            this._lastCreateEnemyTime = now
            this._createEnemy()
            //创建子弹
            this._createBullet()
        }

    }

    // onStageClick(e) {
    //     //停止事件冒泡，提高性能
    //     e.stopPropagation()
    // }

    /**开始游戏，通过激活本脚本方式开始游戏*/
    startGame() {
        if (!this._started) {
            this._started = true
            this._createWeapon()
        }
    }

    /**结束游戏，通过非激活本脚本停止游戏 */
    stopGame() {
        this._started = false
        this._createEnemyInterval = 1000
        this.spriteBox.removeChildren()
    }

    /**提升难度 */
    adjustLevel() {
        if (this._createEnemyInterval > 600) {
            this._createEnemyInterval -= 10
        }
    }

    _createEnemy() {
        //使用对象池创建敌人
        for (let i = 0; i < 10; i++) {
            let enemy = Laya.Pool.getItemByCreateFun("enemy", this.enemy.create, this.enemy)
            // enemy.pos(Math.random() * (Laya.stage.width - 100), -100);
            enemy.pos(Math.random() * 300, Math.random() * (Laya.stage.height - 200))
            this.spriteBox.addChild(enemy)
        }
    }

    _createWeapon() {
        //使用对象池创建炮塔
        let weapon = this._weapon = this.weapon.create()
        // enemy.pos(Math.random() * (Laya.stage.width - 100), -100);
        // this._weapon = this.weapon.create()
        weapon.pos(Laya.stage.width - 100, Laya.stage.height / 2)
        weapon.getChildByName('aniTurret').play(0, true)
        this.spriteBox.addChild(weapon)
    }

    _createBullet() {
        let weapon = this._weapon
        if (weapon) {
            //使用对象池创建子弹
            for (let i = 0; i < 10; i++) {
                let bullet = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet)
                bullet.pos(weapon.x, Laya.stage.height * Math.random())
                this.spriteBox.addChild(bullet)
            }
        }
    }
}