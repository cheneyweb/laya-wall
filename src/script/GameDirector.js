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
        this._store = Laya.store                                //全局状态
        this._started = false                                   //是否已经开始游戏
        this._lastCreateEnemyTime = Date.now()                  //上次刷新敌人时间
        this._lastCreateBulletTime = Date.now()                 //上次创建子弹时间
        this._createEnemyInterval = 1000                        //创建敌人时间间隔
        this._createBulletInterval = 100                        //创建子弹时间间隔  
        this.spriteBox = this.owner.getChildByName("spriteBox") //敌人和子弹所在的容器
    }

    onUpdate() {
        let now = Date.now()
        //每间隔一段时间创建敌人
        if (this._started && now - this._lastCreateEnemyTime > this._createEnemyInterval) {
            this._lastCreateEnemyTime = now
            this._createEnemy()
        }
        //每间隔一段时间创建子弹
        if (this._started && now - this._lastCreateBulletTime > this._createBulletInterval) {
            this._lastCreateBulletTime = now
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
            enemy.pos(Math.random() * 100, Math.random() * Laya.stage.height)
            this.spriteBox.addChild(enemy)
            this._store.actions.addEnemy(enemy)
        }
    }

    _createWeapon() {
        //使用对象池创建炮塔
        let weapon = this._weapon = this.weapon.create()
        weapon.pos(Laya.stage.width - 100, Laya.stage.height / 2)
        weapon.getChildByName('aniTurret').play(0, true)
        this.spriteBox.addChild(weapon)
    }

    _createBullet() {
        //获取所有敌人,x坐标从大到小排序，0首位最近
        let enemyArr = [...this._store.state.enemyMap.keys()].sort((a, b) => b.x - a.x)
        let enemyTarget = enemyArr[0]
        //获取武器
        let weapon = this._weapon
        //武器准备好且敌人出现了
        if (weapon && enemyTarget) {
            //使用对象池创建子弹
            let bullet = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet)

            //设定子弹初始位置
            bullet.pos(weapon.x - 90, weapon.y - 20)
            //设定子弹初速度
            let vx = (enemyTarget.x - bullet.x) / 15
            let vy = (enemyTarget.y - bullet.y) / 15
            //武器旋转角度
            let rotation = Math.atan(vy / vx) / (Math.PI / 180)
            weapon.rotation = rotation
            // if (Math.abs(weapon.rotation - rotation) > 15) {
            // Laya.Tween.to(weapon, { rotation }, 100, Laya.Ease.elasticInOut)
            // }
            bullet.getComponent(Laya.RigidBody).setVelocity({ x: vx, y: vy })
            this.spriteBox.addChild(bullet)
        }
    }
}