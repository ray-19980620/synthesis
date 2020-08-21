cc.Class({
    extends: cc.Component,

    properties: {
        buy: cc.Node,   //购买按钮
        boomParticle: cc.Prefab,    //爆炸粒子
        shop_button: cc.Node,   //商城文字按钮
        shop_bg: cc.Node,   //商城背景
        trash: cc.Node, //垃圾桶节点
        face1: cc.Prefab,
        face2: cc.Prefab,
        face3: cc.Prefab,
        face4: cc.Prefab,
        face5: cc.Prefab,
        face6: cc.Prefab,
        face7: cc.Prefab,
        face8: cc.Prefab,
        face9: cc.Prefab,
        face10: cc.Prefab
    },

    onLoad () {
        var _this = this;
        //点击购买按钮触发
        this.buy.on(cc.Node.EventType.MOUSE_DOWN, function(event) {
            var scene = cc.director.getScene();
            var nodeTexture = _this.getTexture();
            var node = cc.instantiate(nodeTexture.node);
            node.group = nodeTexture.group;
            node.parent = scene;

            //计算随机出现的位置
            let windowSize=cc.view.getVisibleSize();
            let x = _this.randomNum(0 + node.width / 2, windowSize.width - node.width / 2);
            let y = _this.randomNum(0 + node.height / 2, windowSize.height - node.height / 2);
            
            node.uid = _this.guid();
            node.level = 1;

            node.setPosition(x, y);

            _this.bindTouchMove(node);
            _this.bindTouchEnd(node);
            //让方块瞎几把走
            _this.goWalk(node);
        });

        //点击商城按钮
        this.shop_button.on(cc.Node.EventType.MOUSE_DOWN, function(event) {
            
        });

        //初始化碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;    //是否显示碰撞边框线

        window.isCollision = false;
        window.other = 0;

    },

    /**
     * 动态获得prefab节点
     * 不传参数返回1级资源
     * 传参数返回该参数下一级资源
     */
    getTexture(level) {
        var _this = this;
        
        switch (level) {
            case undefined:
                return {node: _this.face1, group: 'level1'};
                break;
            case 1:
                return {node: _this.face2, group: 'level2'};
                break;
            case 2: 
                return {node: _this.face3, group: 'level3'};
                break;
            case 3:
                return {node: _this.face4, group: 'level4'};
                break;
            case 4:
                return {node: _this.face5, group: 'level5'};
                break;
            case 5:
                return {node: _this.face6, group: 'level6'};
                break;
            case 6:
                return {node: _this.face7, group: 'level7'};
                break;
            case 7:
                return {node: _this.face8, group: 'level8'};
                break;
            case 8:
                return {node: _this.face9, group: 'level9'};
                break;
            case 9:
                return {node: _this.face10, group: 'level10'};
                break;
        }
    },

    /**
     * @description: 给节点绑定touch事件 touch时节点跟随鼠标移动
     * @param node 节点 
     * @return null 
     */
    bindTouchMove(node) {
        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            window.droping = node.uid;
            this.pauseAllActions();
            let delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
        }, node);
    },

    /**
     * @description: touch松手事件 同级节点碰撞出发升级/继续暂停的移动动作 1手上的节点销毁 2目标节点销毁 3展示粒子效果 4新建更高级节点并使用原手上节点坐标位置
     * @param {type} 
     * @return {type} 
     */
    bindTouchEnd(node) {
        var _this = this;
        
        //let collider = node.addComponent(cc.PhysicsBoxCollider);

        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('松手了')
            
            //是否停留在垃圾桶上
            if (event.target.x >= 960 - _this.trash.width && event.target.y <= _this.trash.height) {
                node.destroy();
            }

            if (window.isCollision) {
                cc.log('我要合成了');
                node.destroy();
                window.collisionOther.destroy();
                _this.boom(window.collisionOther.position);
                
                var newNodeTexture = _this.getTexture(node.level);
                var scene = cc.director.getScene();
                var newNode = cc.instantiate(newNodeTexture.node);
                newNode.group = newNodeTexture.group;
                newNode.parent = scene;
                newNode.uid = _this.guid();
                newNode.level = node.level + 1;
                newNode.setPosition(node.position.x, node.position.y);
                _this.bindTouchMove(newNode);
                _this.bindTouchEnd(newNode);
                _this.goWalk(newNode);

                window.isCollision = false;
            } else {
                this.resumeAllActions();
            }
        }, node);
    },

    /**
     * @description: 递归调用移动动作
     * @param node 
     * @return null 
     */
    goWalk(node) {

        nowPos = node.getPosition();
        //cc.log(nowPos)

        let windowSize=cc.view.getVisibleSize();
        
        let x = y = 0;

        let offsetX = this.randomNum(0, windowSize.width / 3);
        let offsetY = this.randomNum(0, windowSize.height / 3);
        
        if (offsetX % 2 == 0) {
            if (nowPos.x + offsetX <= windowSize.width - node.width / 2) {
                x = nowPos.x + offsetX;
            } else {
                x = nowPos.x - offsetX;
            }
        } else {
            if (nowPos.x - offsetX >= node.width / 2) {
                x = nowPos.x - offsetX;
            } else {
                x = nowPos.x + offsetX;
            }
        }

        if (offsetY % 2 == 0) {
            if (nowPos.y + offsetY <= windowSize.height - node.height / 2) {
                y = nowPos.y + offsetY;
            } else {
                y = nowPos.y - offsetY;
            } 
        } else {
            if (nowPos.y - offsetY >= node.height / 2) {
                y = nowPos.y - offsetY;
            } else {
                y = nowPos.y + offsetY;
            }
        }

        
        //cc.log(x, y);
        //cc.log('屏幕宽高' + windowSize.width + '*' + windowSize.height + '  现在位置' + nowPos.x + '|' + nowPos.y);
        
        let finished = cc.callFunc(function(target, nextNode) {
            this.goWalk(nextNode)
        }, this, node);
        let moveAction = cc.sequence(cc.moveTo(3, x, y), finished);
        node.runAction(moveAction);
    },

    start () {

    },

    /**
     * @description: 粒子效果爆炸到指定坐标
     * @param pos 位置
     */
    boom(pos) {
        var scene = cc.director.getScene();
        var boomParticle = cc.instantiate(this.boomParticle);
        boomParticle.parent = scene;

        let particle = boomParticle.getComponent(cc.ParticleSystem);
        boomParticle.setPosition(pos.x, pos.y);
        particle.resetSystem();
    },


    /**
     * @description: 随机数
     * @param {min} 最小值
     * @param {max} 最大值
     * @return {num} 随机数
     */
    randomNum(Min,Max){
        let Range = Max - Min;
        let Rand = Math.random();  
        let num = Min + Math.round(Rand * Range);
        return num;
    },

    /**
     * @description: 获得一个唯一的uuid
     * @return {string} uuid 
     */
    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    

    // update (dt) {},
});
