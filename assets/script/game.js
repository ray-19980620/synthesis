cc.Class({
    extends: cc.Component,

    properties: {
        red: cc.Node,
        yellow: cc.Node,
        boomParticle: cc.Node,
        buy: cc.Node,
        baseBlock: cc.Prefab
    },

    onLoad () {
        var _this = this;
        this.buy.on(cc.Node.EventType.MOUSE_DOWN, function(event) {
            var scene = cc.director.getScene();
            var node = cc.instantiate(_this.baseBlock);
            node.parent = scene;

            let x = Math.floor(Math.random() * 500);
            let y = Math.floor(Math.random() * 500);

            node.setPosition(x, y);
            _this.bindTouchMove(node);
            _this.bindTouchEnd(node);
            //让方块瞎几把走
            _this.goWalk(node);
        });

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;

        window.iscollision = false;
        window.other = 0;

        this.yellow.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.pauseAllActions();
            let delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
        }, this.yellow);
        this.red.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
            this.pauseAllActions();
            let delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
        }, this.red);

        this.red.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('松手了')
            console.log(window.iscollision);
            if (window.iscollision) {
                cc.log('我要合成了');
                _this.red.active = false;
                _this.boom(_this.yellow.position);
                _this.yellow.color = new cc.Color(134, 255, 134, 255);
            } else {
                this.resumeAllActions();
            }
        }, this.red);

        this.goWalk(this.red);
        this.goWalk(this.yellow);
    },

    bindTouchMove(node) {
        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.pauseAllActions();
            let delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
        }, node);
    },

    bindTouchEnd(node) {
        var _this = this;

        //let collider = node.addComponent(cc.PhysicsBoxCollider);

        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('松手了')
            console.log(window.iscollision);
            if (window.iscollision) {
                cc.log('我要合成了');
                cc.log(window.other);
                node.active = false;
                window.other.active = false;
                _this.boom(node.position);
            } else {
                this.resumeAllActions();
            }
        }, node);
    },

    goWalk(node) {
        let x = Math.floor(Math.random() * 500);
        if (Math.round(Math.random) < 5) {
            x = -x;
        }
        let y = Math.floor(Math.random() * 500);
        if (Math.round(Math.random) < 5) {
            y = -y;
        }

        nowPos = node.getPosition();

        let windowSize=cc.view.getVisibleSize();
        
        if (nowPos.x + x + node.width / 2 > windowSize.width / 2) {
            x = windowSize.width / 2 - nowPos.x - node.width / 2;
        }
        if (nowPos.x - x - node.width / 2 < -windowSize.width / 2) {
            x = -windowSize.width / 2 - nowPos.x - node.width / 2;
        }

        if (nowPos.y + y + node.height / 2  > windowSize.height / 2) {
            y = windowSize.height / 2 - nowPos.y - node.height / 2;
        }
        if (nowPos.y - y - node.height / 2  < -windowSize.height / 2) {
            y = -windowSize.height / 2 - nowPos.y + node.height / 2;
        }

        //cc.log('屏幕宽高' + windowSize.width + '*' + windowSize.height + '  现在位置' + nowPos.x + '|' + nowPos.y);
        
        let finished = cc.callFunc(function(target, nextNode) {
            this.goWalk(nextNode)
        }, this, node);
        let moveAction = cc.sequence(cc.moveTo(5, cc.v2(x, y)), finished);
        node.runAction(moveAction);
    },

    start () {

    },

    boom(pos) {
        this.boomParticle.setPosition(pos);
        let particle = this.boomParticle.getComponent(cc.ParticleSystem);
        particle.resetSystem();
    },





    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        console.log('on collision enter');

        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;

        // 碰撞组件的 aabb 碰撞框
        var aabb = world.aabb;

        // 节点碰撞前上一帧 aabb 碰撞框的位置
        var preAabb = world.preAabb;

        // 碰撞框的世界矩阵
        var t = world.transform;

        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;

        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        var ps = world.points;
    },

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        window.iscollision = true;
        window.other = other;
        console.log('on collision stay');
    },  

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        window.iscollision = false;
        window.other = 0;
        console.log('on collision exit');
    },
    

    // update (dt) {},
});
