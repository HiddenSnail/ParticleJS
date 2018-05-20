var SmokeCreater = (function () {
    var SmokeClass = function (option) {
        ParticleSystem.ParticleManager.call(this, option);
        this.__initCallBacks();
        this.maxParticlesNum = 1000;
        this.onceEjectNum = 2;

        this.maxParticleRadius = 5;
        this.minParticleRadius = 0.1;
    };
    Utils.inherit(SmokeClass, ParticleSystem.ParticleManager);

    SmokeClass.prototype.update = function (deltaTime) {
        var self = this;
        ParticleSystem.ParticleManager.prototype.update.call(self, deltaTime);
    };

    SmokeClass.prototype.__initCallBacks = function () {
        var self = this;
        self._onInitParticleCb = function (particle) {
            initParticle(particle, self);
        };
        self._onResetParticleCb = function (particle) {
            resetParticle(particle, self);
        };
    };

    // var texture = new THREE.CanvasTexture(Utils.generateFragment());
    var texture = new THREE.TextureLoader().load("../textures/smoke2.png");
    function initParticle(particle, manager) {
        particle.create();
        particle.velocity.y = 10;
        particle.scale = new THREE.Vector3(12,12,12);
        // particle.scale = new THREE.Vector3(1,1,1);
        particle.texture = texture;
        particle.opacity = 0;
        if (manager._physicsEnv) {
            manager._physicsEnv.bindSpriteWithEnvironment(particle.target, particle.mass, 2, 0.5, 0x0001, 0x0001 | 0x0002);
        }
        setTweenFrames(particle, manager);
    }
    
    function resetParticle(particle, manager) {
        particle.velocity.x = Utils.randomFrom(-1, 1);
        particle.velocity.z = Utils.randomFrom(-1, 1);
        particle.velocity.y = 10;
        particle.position.set(Utils.randomFrom(-2, 2), 5, Utils.randomFrom(-2, 2));
        particle.opacity = 0;
        particle.setLifeTime(150);
        setTweenFrameData(particle, manager);
    }

    function setTweenFrames(particle, manager) {
        particle.tweenFrames.__SC__opacityChange = new ParticleSystem.Particle.TweenData({ opacity: 0 });
        var opacityChange = particle.tweenFrames.__SC__opacityChange;
        particle.tweenFrames.__SC__physicsSizeChange = new ParticleSystem.Particle.TweenData({ size: manager.minParticleRadius });
        var physicsSizeChange = particle.tweenFrames.__SC__physicsSizeChange;

        setTweenFrameData(particle, manager);

        opacityChange.tween
            .onUpdate(function () {
                particle.opacity = opacityChange.object.opacity;
                particle.redraw(["opacity"]);
            });
        physicsSizeChange.tween
            .onUpdate(function () {
                var physicsBody;
                physicsBody = particle.target.userData.physicsBody;
                var t = physicsBody.getCollisionShape();
                t.set
                console.log(t.getMargin());
            })


    }

    function setTweenFrameData(particle, manager, tweenFrameNames) {
        if (tweenFrameNames) {
            tweenFrameNames.forEach(function (frameName) {
                selectTweenFrameToSetData(particle, manager, frameName);
            });
        } else {
            selectTweenFrameToSetData(particle, manager, "__SC__TWEEN_ALL__");
        }
    }

    function selectTweenFrameToSetData(particle, manager, frameName) {
        var isBreak = true;
        switch (frameName) {
            case "__SC__TWEEN_ALL__": {
                isBreak = false;
            }
            case "__SC__opacityChange": {
                var tweenData = particle.tweenFrames.__SC__opacityChange;
                if (!tweenData) { console.log("tweenData [__SC__opacityChange] missing."); return;}
                else {
                    tweenData.object.opacity = 0;
                    tweenData.tween.to({
                        opacity: 0.65
                    }, 1000);
                }
                if (isBreak) break;
            }
            case "__SC__physicsSizeChange": {
                var tweenData = particle.tweenFrames.__SC__physicsSizeChange;
                if (!tweenData) { console.log("tweenData [__SC__physicsSizeChange] missing."); return;}
                else {
                    tweenData.object.size = manager.minParticleRadius;
                    tweenData.tween.to({
                        size: manager.maxParticleRadius
                    }, 2000);
                    if (isBreak) break;
                }
            }
            default : break;
        }
    };

    return SmokeClass;
})();