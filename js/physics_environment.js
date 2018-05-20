/** ===============================================================
 *
 *  全局物理环境
 *
 *  =============================================================== **/

var PhysicsEnvironment = (function () {

    var env = function () {
        // 物理环境设置参数
        this.collisionConfiguration = null;
        this.dispatcher = null;
        this.broadphase = null;
        this.solver = null;
        this.physicsWorld = null;
        this.transformUtil = null;
        initPhysics(this);
    };

    env.prototype.bindSpriteWithEnvironment = function (threeSprite, mass, radius, margin, filterGroup, filterMask) {
        var self = this;
        var ammoShape = new Ammo.btSphereShape(radius);
        ammoShape.setMargin(margin);
        self.bindWithEnvironment(threeSprite, ammoShape, mass, filterGroup, filterMask);
        return threeSprite;
    };

    env.prototype.bindBoxShapeWithEnvironment = function (threeBoxShape, mass, margin, filterGroup, filterMask) {
        var self = this;
        var sx = threeBoxShape.geometry.parameters.width;
        var sy = threeBoxShape.geometry.parameters.height;
        var sz = threeBoxShape.geometry.parameters.depth;
        var ammoShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5 * sx, 0.5 * sy, 0.5 * sz));
        ammoShape.setMargin(margin);
        self.bindWithEnvironment(threeBoxShape, ammoShape, mass, filterGroup, filterMask);
        return threeBoxShape;
    };
    
    env.prototype.bindWithEnvironment = function (threeObject, ammoShape, mass, filterGroup, filterMask) {
        var self = this;
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(threeObject.position.x, threeObject.position.y, threeObject.position.z));
        transform.setRotation(new Ammo.btQuaternion(threeObject.quaternion.x, threeObject.quaternion.y, threeObject.quaternion.z, threeObject.quaternion.w));
        var motionState = new Ammo.btDefaultMotionState(transform);

        // 惯性
        var localInertia = new Ammo.btVector3(0, 0, 0);
        ammoShape.calculateLocalInertia(mass, localInertia);

        var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, ammoShape, localInertia);
        var body = new Ammo.btRigidBody(rbInfo);
        body.setRestitution(0.0);
        threeObject.userData.physicsBody = body;

        // Ammo中质量等于0的表示固定物体
        if (mass > 0) {
            body.setActivationState(4);
        }
        self.physicsWorld.addRigidBody(body, filterGroup, filterMask);
        return body;
    };

    env.prototype.updatePhysics = function ( deltaTime) {
        var self = this;
        self.physicsWorld.stepSimulation(deltaTime);
    };

    function initPhysics(self) {
        self.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        self.dispatcher = new Ammo.btCollisionDispatcher(self.collisionConfiguration);
        self.broadphase = new Ammo.btDbvtBroadphase();
        self.solver = new Ammo.btSequentialImpulseConstraintSolver();
        self.physicsWorld = new Ammo.btDiscreteDynamicsWorld(self.dispatcher, self.broadphase, self.solver, self.collisionConfiguration);
        self.physicsWorld.setGravity(new Ammo.btVector3(0, 0, 0));
        self.transformUtil = new Ammo.btTransform();
    }

    return env;
})();