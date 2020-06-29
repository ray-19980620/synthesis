cc.Class({
    extends: cc.Component,

    properties: {
        boomParticle: cc.Node,
        buy: cc.Node,
        baseBlock: cc.Prefab,
        particle_test: cc.Prefab
    },

    onLoad () {
        var _this = this;
        this.buy.on(cc.Node.EventType.MOUSE_DOWN, function(event) {
            var scene = cc.director.getScene();
            var node = cc.instantiate(_this.baseBlock);
            node.parent = scene;

            let x = Math.floor(Math.random() * 500);
            let y = Math.floor(Math.random() * 500);
            
            node.uid = _this.guid();

            node.setPosition(x, y);
            console.log(x, y);
            _this.bindTouchMove(node);
            _this.bindTouchEnd(node);
            //让方块瞎几把走
            _this.goWalk(node);
        });

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;

        window.isCollision = false;
        window.other = 0;

        // this.yellow.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        //     this.pauseAllActions();
        //     let delta = event.touch.getDelta();
        //     this.x += delta.x;
        //     this.y += delta.y;
        // }, this.yellow);
        // this.red.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
        //     this.pauseAllActions();
        //     let delta = event.touch.getDelta();
        //     this.x += delta.x;
        //     this.y += delta.y;
        // }, this.red);

        // this.red.on(cc.Node.EventType.TOUCH_END, function (event) {
        //     console.log('松手了')
        //     console.log(window.isCollision);
        //     if (window.isCollision) {
        //         cc.log('我要合成了');
        //         _this.red.active = false;
        //         _this.boom(_this.yellow.position);
        //         _this.yellow.color = new cc.Color(134, 255, 134, 255);
        //     } else {
        //         this.resumeAllActions();
        //     }
        // }, this.red);

        // this.goWalk(this.red);
        // this.goWalk(this.yellow);

    },

    bindTouchMove(node) {
        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            window.droping = node.uid;
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
            if (window.isCollision) {
                cc.log('我要合成了');
                node.active = false;
                window.other.active = false;
                _this.boom(window.collisionOther.position);
                //cc.log(window.collisionOther.position, window.collisionOther.convertToNodeSpaceAR(cc.v2(0, 0)),window.collisionOther.convertToWorldSpaceAR(cc.v2(0, 0)))
                window.isCollision = false;
            } else {
                this.resumeAllActions();
            }
        }, node);
    },

    goWalk(node) {


        nowPos = node.getPosition();
        //cc.log(nowPos)

        let windowSize=cc.view.getVisibleSize();
        
        let x = this.randomNum(0, windowSize.width);
        let y = this.randomNum(0, windowSize.height);
        cc.log(x, y);
        if (nowPos.x + x + node.width / 2 > windowSize.width) {
            x = windowSize.width - (nowPos.x - node.width / 2);
        }
        if (nowPos.x - x - node.width / 2 < node.width / 2) {
            x = nowPos.x - node.width / 2;
        }

        if (nowPos.y + y + node.height / 2  > windowSize.height) {
            y = windowSize.height - (nowPos.y - node.height / 2);
        }
        if (nowPos.y - y - node.height / 2  < node.height / 2) {
            y = nowPos.y - node.height / 2;
        }

        //cc.log('屏幕宽高' + windowSize.width + '*' + windowSize.height + '  现在位置' + nowPos.x + '|' + nowPos.y);
        
        let finished = cc.callFunc(function(target, nextNode) {
            this.goWalk(nextNode)
        }, this, node);
        let moveAction = cc.sequence(cc.moveBy(5, x, y), finished);
        node.runAction(moveAction);
    },

    start () {

    },

    boom(pos) {
        var scene = cc.director.getScene();
        var particle_test = cc.instantiate(this.particle_test);
        particle_test.parent = scene;

        let particle = particle_test.getComponent(cc.ParticleSystem);
        particle_test.setPosition(pos.x, pos.y);
        particle.resetSystem();
    },


    randomNum(Min,Max){
        let Range = Max - Min;
        let Rand = Math.random();  
        let num = Min + Math.round(Rand * Range);
        return num;
    },

    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    

    // update (dt) {},
});
