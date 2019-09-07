import GameUI from "../view/GameUI"
/**
 * 敌人脚本，实现敌人击杀和回收
 */
export default class Enemy extends Laya.Script {
    constructor() { super() }
    onEnable() {
        //获得组件引用，避免每次获取组件带来不必要的查询开销
        // this._rig = this.owner.getComponent(Laya.RigidBody);
        //敌人等级
        this._level = Math.round(Math.random() * 5) + 1
        //等级文本
        this.textLevel = this.owner.getChildByName("textLevel")
        this.textLevel.text = `${this._level}`
        //僵尸动画
        // this.aniZombi = this.owner.getChildByName("aniZombi")
        // this.aniZombi.play(0, true)
    }

    onUpdate() {
        //让持续盒子旋转
        // this.owner.rotation++;
    }

    onTriggerEnter(other, self, contact) {
        //碰撞到子弹后，增加积分，播放声音特效
        let owner = this.owner
        if (other.label == "bullet") {
            if (this._level > 1) {
                this._level--
                this.textLevel.changeText(`${this._level}`)
                // owner.getComponent(Laya.RigidBody).setVelocity({ x: -10, y: 0 })
                Laya.SoundManager.playSound("sound/hit.wav")
            } else if (owner.parent) {
                let effect = Laya.Pool.getItemByCreateFun("effect", this._createEffect, this)
                effect.pos(owner.x, owner.y)
                owner.parent.addChild(effect)
                effect.play(0, true)
                owner.removeSelf()
                Laya.SoundManager.playSound("sound/destroy.wav")
            }
            GameUI.instance.addScore(1)
        }
        //只要有一个敌人抵达，则停止游戏 
        else if (other.label === "wall") {
            owner.removeSelf()
            // GameUI.instance.stopGame();
        }
    }

    onDisable() {
        //敌人被移除时，回收敌人，方便下次复用，减少对象创建开销。
        Laya.Pool.recover("enemy", this.owner)
        Laya.store.actions.delEnemy(this.owner)
    }

    _createEffect() {
        //使用对象池创建爆炸动画
        let ani = new Laya.Animation()
        ani.loadAnimation("ani/Bomb.ani")
        ani.on(Laya.Event.COMPLETE, null, () => {
            ani.removeSelf()
            Laya.Pool.recover("effect", ani)
        })
        return ani
    }
}