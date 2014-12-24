"use strict";

(function(dice) {

    function rnd() {
      return Math.random();
    }

    function create_shape(vertices, faces, radius) {
        var cv = [], cf = [];
        for (var i = 0; i < vertices.length; ++i) {
            var v = vertices[i];
            var l = radius / Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            cv.push(new CANNON.Vec3(v[0] * l, v[1] * l, v[2] * l));
        }
        for (var i = 0; i < faces.length; ++i) {
            var f = faces[i];
            cf.push(faces[i].slice(0, faces[i].length - 1));
        }
        return new CANNON.ConvexPolyhedron(cv, cf);
    }

    function make_geom(vertices, faces, radius, tab, af) {
        var geom = new THREE.Geometry();
        for (var i = 0; i < vertices.length; ++i) {
            var vertex = (new THREE.Vector3).fromArray(vertices[i]).normalize().multiplyScalar(radius);
            vertex.index = geom.vertices.push(vertex) - 1;
        }
        for (var i = 0; i < faces.length; ++i) {
            var ii = faces[i], fl = ii.length - 1;
            var aa = Math.PI * 2 / fl;
            for (var j = 0; j < fl - 2; ++j) {
                geom.faces.push(new THREE.Face3(ii[0], ii[j + 1], ii[j + 2], [geom.vertices[ii[0]],
                            geom.vertices[ii[j + 1]], geom.vertices[ii[j + 2]]], 0, ii[fl] + 1));
                geom.faceVertexUvs[0].push([
                        new THREE.Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab),
                            (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
                        new THREE.Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
                            (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
                        new THREE.Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
                            (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))]);
            }
        }
        geom.computeFaceNormals();
        geom.computeVertexNormals();
        geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
        return geom;
    }

    function create_geom(vertices, faces, radius, tab, af) {
        var geom = make_geom(vertices, faces, radius, tab, af);
        geom.cannon_shape = create_shape(vertices, faces, radius);
        return geom;

        var chamfer_vertices = [], chamfer_vectors = [], chamfer_faces = [];

        for (var i = 0; i < vertices.length; ++i) {
            chamfer_vectors.push((new THREE.Vector3).fromArray(vertices[i]).normalize());
        }
        for (var i = 0; i < faces.length; ++i) {
            var ii = faces[i], fl = ii.length - 1;
            var center_point = new THREE.Vector3();
            var face = [];
            for (var j = 0; j < fl; ++j) {
                var vv = (new THREE.Vector3).fromArray(vertices[ii[j]]).normalize();
                center_point.add(vv);
                face.push(chamfer_vectors.push(vv) - 1);
            }
            center_point.divideScalar(fl);
            for (var j = 0; j < fl; ++j) {
                var vv = chamfer_vectors[face[j]];
                vv.subVectors(vv, center_point);
                vv.multiplyScalar(that.chamfer);
                vv.addVectors(vv, center_point);
            }
            for (var j = 0; j < fl - 1; ++j) {
                chamfer_faces.push([ii[j], ii[j + 1], face[j + 1], face[j], -1]);
            }
            chamfer_faces.push([ii[fl - 1], ii[0], face[0], face[fl - 1], -1]);

            face.push(ii[fl]);
            chamfer_faces.push(face);
        }
        for (var i = 0; i < chamfer_vectors.length; ++i) {
            chamfer_vertices.push(chamfer_vectors[i].toArray());
        }
        var geom = make_geom(chamfer_vertices, chamfer_faces, radius, tab, af);
        geom.cannon_shape = create_shape(vertices, faces, radius);
        return geom;
    }

    this.standart_d20_dice_face_labels = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8'];

    this.create_dice_materials = function(face_labels, size, margin, color) {
        function create_text_texture(text, color, back_color) {
            if (text == undefined) return null;
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.id = 'dice_canvas';
            canvas.width = size + margin;
            canvas.height = size + margin;
            context.font = size + "pt Arial";
            context.fillStyle = back_color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = color;
            context.fillText(text, canvas.width / 2, canvas.height / 2);
            if (text == '6' || text == '9') {
                context.fillText('  .', canvas.width / 2, canvas.height / 2);
            }
            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }
        var materials = [];
        console.log('Color: ' + color);
        this.dice_color = color;

        for (var i = 0; i < face_labels.length; ++i)
            materials.push(new THREE.MeshPhongMaterial(copyto(this.material_options,
                        { map: create_text_texture(face_labels[i], this.label_color, this.dice_color) })));
        return materials;
    }

    this.create_d6_geometry = function(radius) {
        var vertices = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
        var faces = [[0, 3, 2, 1, 1], [1, 2, 6, 5, 2], [0, 1, 5, 4, 3],
                [3, 7, 6, 2, 4], [0, 4, 7, 3, 5], [4, 5, 6, 7, 6]];
        return create_geom(vertices, faces, radius, 0.1, Math.PI / 4);
    }

    this.create_d8_geometry = function(radius) {
        var vertices = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
        var faces = [[0, 2, 4, 1], [0, 4, 3, 2], [0, 3, 5, 3], [0, 5, 2, 4], [1, 3, 4, 5],
                [1, 4, 2, 6], [1, 2, 5, 7], [1, 5, 3, 8]];
        return create_geom(vertices, faces, radius, 0, -Math.PI / 4 / 2);
    }

    this.count = 0;
    this.scale = 50;
    this.chamfer = 0.6;
    this.material_options = {
        specular: '#171d1f',
        color: '#ffffff',
        emissive: '#000000',
        shininess: 70,
        shading: THREE.FlatShading,
    };
    this.label_color = '#aaaaaa';
    this.dice_color = '#202020';
    this.known_types = ['d6', 'd8', 'd8', 'd8', 'd8', 'd8', 'd8'];
    this.dice_mass = { 'd6': 300, 'd8': 340 };
    this.dice_inertia = { 'd6': 13, 'd8': 10 };

    //onclick, add a color to the array
    //for the selected die
    this.dice_selection = [];

    this.create_d6 = function() {
        if (!this.d6_geometry) this.d6_geometry = this.create_d6_geometry(this.scale * 0.9);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
                this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, this.scale, '#202020'));
        return new THREE.Mesh(this.d6_geometry, this.dice_material);
    }

    this.create_d8 = function() {
        var color = '';
        switch (this.count){
          case 0:
            color = '#202020';
          break;
          case 1:
            color = '#FF0000';
          break;
          case 2:
            color = '#5BC22B';
          break;
          case 3:
            color = '#0000FF';
          break;
          case 4:
            color = '#D7D7E0';
          break;
          case 5:
            color = '#FFF700';
          break;
        }

        this.count = this.count += 1;
        console.log(this.count);
        if (!this.d8_geometry) this.d8_geometry = this.create_d8_geometry(this.scale);
        this.dice_material = new THREE.MeshFaceMaterial(
                this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2,
                    this.scale * 1.2, color));
        return new THREE.Mesh(this.d8_geometry, this.dice_material);
    }

    this.parse_notation = function(notation) {
        var dr = /\s*(\d*)([a-z]+)(\d+)(\s*\+\s*(\d+)){0,1}\s*(\+|$)/gi;
        var ret = { set: [], constant: 0 }, res;
        while (res = dr.exec(notation)) {
            var command = res[2];
            if (command != 'd') continue;
            var count = parseInt(res[1]);
            if (res[1] == '') count = 1;
            var type = 'd' + res[3];
            if (this.known_types.indexOf(type) == -1) continue;
            while (count--) ret.set.push(type);
            if (res[5]) ret.constant += parseInt(res[5]);
        }
        return ret;
    }

    this.stringify_notation = function(nn) {
        var dict = {}, notation = '';
        for (var i in nn.set)
            if (!dict[nn.set[i]]) dict[nn.set[i]] = 1; else ++dict[nn.set[i]];
        for (var i in dict) {
            if (notation.length) notation += ' + ';
            notation += dict[i] + i;
        }
        if (nn.constant) notation += ' + ' + nn.constant;
        return notation;
    }

    var that = this;

    this.dice_box = function(container, dimentions) {
        this.cw = container.clientWidth / 2;
        this.ch = container.clientHeight / 2;
        if (dimentions) {
            this.w = dimentions.w;
            this.h = dimentions.h;
        }
        else {
            this.w = this.cw;
            this.h = this.ch;
        }
        this.aspect = Math.min(this.cw / this.w, this.ch / this.h);
        that.scale = Math.sqrt(this.w * this.w + this.h * this.h) / 13;
        this.use_adapvite_timestep = true;

        console.log(container);

        this.renderer = window.WebGLRenderingContext
            ? new THREE.WebGLRenderer({ antialias: true, alpha: true})
            : new THREE.CanvasRenderer({ antialias: true, alpha: true});

        this.renderer.setSize(this.cw * 2, this.ch * 2);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;
        this.renderer.autoClear = true;
        //this.renderer

        this.dices = [];
        this.scene = new THREE.Scene();
        this.world = new CANNON.World();

        console.log(this.renderer.domElement);
        container.appendChild(this.renderer.domElement);

        this.world.gravity.set(0, 0, -9.8 * 800);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 8;

        var wh = Math.min(this.cw, this.ch) / this.aspect / Math.tan(10 * Math.PI / 180);
        this.camera = new THREE.PerspectiveCamera(20, this.cw / this.ch, 1, wh * 1.3);
        this.camera.position.z = wh;

        var ambientLight = new THREE.AmbientLight(0xf0f0f0);
        this.scene.add(ambientLight);
        var mw = Math.max(this.w, this.h);
        var light = new THREE.SpotLight(0xffffff);
        light.position.set(-mw / 2, mw / 2, mw * 2);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        //light.onlyShadow = true;
        light.intensity = 0.6;
        light.shadowCameraNear = mw / 10;
        light.shadowCameraFar = mw * 3;
        light.shadowCameraFov = 50;
        light.shadowBias = 0.001;
        light.shadowDarkness = 0.3;
        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;
        this.scene.add(light);

        this.dice_body_material = new CANNON.Material();
        var desk_body_material = new CANNON.Material();
        var barrier_body_material = new CANNON.Material();

        this.world.addContactMaterial(new CANNON.ContactMaterial(
                    desk_body_material, this.dice_body_material, 0.01, 0.5));
        this.world.addContactMaterial(new CANNON.ContactMaterial(
                    barrier_body_material, this.dice_body_material, 0, 0.5));
        this.world.addContactMaterial(new CANNON.ContactMaterial(
                    this.dice_body_material, this.dice_body_material, 0, 0.5));

        this.desk = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 2, this.h * 2, 1, 1),
                new THREE.MeshLambertMaterial({ color: 0xffffff, opacity: 0, transparent: true}));
        this.desk.receiveShadow = true;
        this.scene.add(this.desk);

        this.world.add(new CANNON.RigidBody(0, new CANNON.Plane(), desk_body_material));
        var barrier;
        barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
        barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
        barrier.position.set(0, this.h * 0.93, 0);
        this.world.add(barrier);

        barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
        barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        barrier.position.set(0, -this.h * 0.93, 0);
        this.world.add(barrier);

        barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
        barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
        barrier.position.set(this.w * 0.93, 0, 0);
        this.world.add(barrier);

        barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
        barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        barrier.position.set(-this.w * 0.93, 0, 0);
        this.world.add(barrier);

        this.last_time = 0;
        this.running = false;

        this.renderer.render(this.scene, this.camera);
    }

    this.dice_box.prototype.create_dice = function(type, pos, velocity, angle, axis) {
        var dice = that['create_' + type]();
        dice.castShadow = true;
        dice.dice_type = type;
        dice.body = new CANNON.RigidBody(that.dice_mass[type],
                dice.geometry.cannon_shape, this.dice_body_material);
        dice.body.position.set(pos.x, pos.y, pos.z);
        dice.body.quaternion.setFromAxisAngle(new CANNON.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
        dice.body.angularVelocity.set(angle.x, angle.y, angle.z);
        dice.body.velocity.set(velocity.x, velocity.y, velocity.z);
        dice.body.linearDamping = 0.1;
        dice.body.angularDamping = 0.1;
        this.scene.add(dice);
        this.dices.push(dice);
        this.world.add(dice.body);
    }

    this.dice_box.prototype.check = function() {
        var res = true;
        var e = 6;
        var time = (new Date()).getTime();
        if (time - this.running < 10000) {
            for (var i = 0; i < this.dices.length; ++i) {
                var dice = this.dices[i];
                if (dice.dice_stopped == true) continue;
                var a = dice.body.angularVelocity, v = dice.body.velocity;
                if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e &&
                        Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
                    if (dice.dice_stopped) {
                        if (time - dice.dice_stopped > 50) {
                            dice.dice_stopped = true;
                            continue;
                        }
                    }
                    else dice.dice_stopped = (new Date()).getTime();
                    res = false;
                }
                else {
                    dice.dice_stopped = undefined;
                    res = false;

                }
            }
        }
        if (res) {
            this.running = false;
            var values = [];
            for (var i in this.dices) {
                var dice = this.dices[i], invert = dice.dice_type == 'd4' ? -1 : 1;
                var intersects = (new THREE.Raycaster(
                            new THREE.Vector3(dice.position.x, dice.position.y, 200 * invert),
                            new THREE.Vector3(0, 0, -1 * invert))).intersectObjects([dice]);
                var matindex = intersects[0].face.materialIndex - 1;
                if (dice.dice_type == 'd100') matindex *= 10;
                values.push(matindex);
            }
            if (this.callback) this.callback.call(this, values);
        }
    }

    this.dice_box.prototype.__animate = function(threadid) {
        var time = (new Date()).getTime();
        if (this.use_adapvite_timestep) {
            var time_diff = (time - this.last_time) / 1000;
            if (time_diff > 3) time_diff = 1 / 60;
            while (time_diff > 1.1 / 60) {
                this.world.step(1 / 60);
                time_diff -= 1 / 60;
            }
            this.world.step(time_diff);
        }
        else {
            this.world.step(1 / 60);
        }
        for (var i in this.scene.children) {
            var interact = this.scene.children[i];
            if (interact.body != undefined) {
                interact.body.position.copy(interact.position);
                interact.body.quaternion.copy(interact.quaternion);
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.last_time = this.last_time ? time : (new Date()).getTime();
        if (this.running == threadid) this.check();
        if (this.running == threadid) {
            (function(t, tid) {
                requestAnimationFrame(function() { t.__animate(tid); });
            })(this, threadid);
        }
    }

    this.dice_box.prototype.clear = function() {
        this.running = false;
        var dice;
        while (dice = this.dices.pop()) {
            this.scene.remove(dice);
            if (dice.body) this.world.remove(dice.body);
        }
        if (this.pane) this.scene.remove(this.pane);
        this.renderer.render(this.scene, this.camera);
    }

    function make_random_vector(vector) {
        var random_angle = rnd() * Math.PI / 5 - Math.PI / 5 / 2;
        var vec = {
            x: vector.x * Math.cos(random_angle) - vector.y * Math.sin(random_angle),
            y: vector.x * Math.sin(random_angle) + vector.y * Math.cos(random_angle)
        };
        if (vec.x == 0) vec.x = 0.01;
        if (vec.y == 0) vec.y = 0.01;
        return vec;
    }

    this.dice_box.prototype.generate_vectors = function(notation, vector, boost) {
        var vectors = [];
        for (var i in notation.set) {
            var vec = make_random_vector(vector);
            var pos = {
                x: this.w * (vec.x > 0 ? -1 : 1) * 0.9,
                y: this.h * (vec.y > 0 ? -1 : 1) * 0.9,
                z: rnd() * 200 + 200
            };
            var projector = Math.abs(vec.x / vec.y);
            if (projector > 1.0) pos.y /= projector; else pos.x *= projector;
            var velvec = make_random_vector(vector);
            var velocity = { x: velvec.x * boost, y: velvec.y * boost, z: -10 };
            var inertia = that.dice_inertia[notation.set[i]];
            var angle = {
                x: -(rnd() * vec.y * 5 + inertia * vec.y),
                y: rnd() * vec.x * 5 + inertia * vec.x,
                z: 0
            };
            var axis = { x: rnd(), y: rnd(), z: rnd(), a: rnd() };
            console.log('Notation set is: ' + notation.set[i]);
            vectors.push({ set: notation.set[i], pos: pos, velocity: velocity, angle: angle, axis: axis });
        }
        return vectors;
    }

    this.dice_box.prototype.roll = function(vectors, callback) {
        this.clear();
        for (var i in vectors) {
            this.create_dice(vectors[i].set, vectors[i].pos, vectors[i].velocity,
                    vectors[i].angle, vectors[i].axis);
        }
        this.callback = callback;
        this.running = (new Date()).getTime();
        this.last_time = 0;
        this.__animate(this.running);
    }

    this.dice_box.prototype.__selector_animate = function(threadid) {
        var time = (new Date()).getTime();
        var time_diff = (time - this.last_time) / 1000;
        if (time_diff > 3) time_diff = 1 / 60;
        var angle_change = 0.3 * time_diff * Math.PI * Math.min(24000 + threadid - time, 6000) / 6000;
        if (angle_change < 0) this.running = false;
        for (var i in this.dices) {
            this.dices[i].rotation.y += angle_change;
            this.dices[i].rotation.x += angle_change / 4;
            this.dices[i].rotation.z += angle_change / 10;
        }

        this.last_time = time;
        this.renderer.render(this.scene, this.camera);
        if (this.running == threadid) {
            (function(t, tid) {
                requestAnimationFrame(function() { t.__selector_animate(tid); });
            })(this, threadid);
        }
    }

    this.dice_box.prototype.search_dice_by_mouse = function(ev) {
        var intersects = (new THREE.Raycaster(this.camera.position,
                    (new THREE.Vector3((ev.clientX - this.cw) / this.aspect,
                                       (ev.clientY - this.ch) / this.aspect, this.w / 9))
                    .sub(this.camera.position).normalize())).intersectObjects(this.dices);
        if (intersects.length) return intersects[0].object.userData;
    }

    this.dice_box.prototype.draw_selector = function() {
        this.clear();
        var step = this.w / 4.5;
        this.pane = new THREE.Mesh(new THREE.PlaneGeometry(this.cw * 20, this.ch * 20, 1, 1),
                new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true}));
        this.pane.receiveShadow = true;
        this.pane.position.set(0, 0, 1);
        this.scene.add(this.pane);

        var mouse_captured = false;

        //DRAWING THE SELECTOR HERE

        for (var i = 0, pos = -3; i < that.known_types.length; ++i, ++pos) {
            var dice = eaw.dice['create_' + that.known_types[i]]();
            dice.position.set(pos * step, 0, step * 0.5);
            dice.castShadow = true;
            dice.userData = that.known_types[i];
            this.dices.push(dice); this.scene.add(dice);
        }

        this.running = (new Date()).getTime();
        this.last_time = 0;
        this.__selector_animate(this.running);
    }

    this.dice_box.prototype.bind_mouse = function(container, notation_getter, before_roll, after_roll) {
        var box = this;
        bind(container, ['mousedown', 'touchstart'], function(ev) {
            box.mouse_time = (new Date()).getTime();
            box.mouse_start = { x: ev.clientX, y: ev.clientY };
        });
        bind(container, ['mouseup', 'touchend', 'touchcancel'], function(ev) {
            if (box.rolling) return;
            var vector = { x: ev.clientX - box.mouse_start.x, y: -(ev.clientY - box.mouse_start.y) };
            var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            if (dist < Math.sqrt(box.w * box.h * 0.01)) return;
            var notation = notation_getter.call(box);
            if (notation.set.length == 0) return;

            var time_int = (new Date()).getTime() - box.mouse_time;
            if (time_int > 2000) time_int = 2000;
            vector.x /= dist; vector.y /= dist;
            var boost = Math.sqrt((2500 - time_int) / 2500) * dist * 2;
            var vectors = box.generate_vectors(notation, vector, boost);
            box.rolling = true;
            if (before_roll) before_roll.call(box, vectors, notation);
            if (after_roll) {
                box.clear();
                box.roll(vectors, function(result) {
                    if (after_roll) after_roll.call(box, notation, result);
                    box.rolling = false;
                });
            }
        });
    }

    this.dice_box.prototype.bind_throw = function(button, notation_getter, before_roll, after_roll) {
        var box = this;
        bind(button, ['mouseup', 'touchend', 'touchcancel'], function(ev) {
            if (box.rolling) return;
            ev.stopPropagation();
            var vector = { x: (rnd() * 2 - 1) * box.w, y: -(rnd() * 2 - 1) * box.h };
            var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            var notation = notation_getter.call(box);
            if (notation.set.length == 0) return;

            vector.x /= dist; vector.y /= dist;
            var boost = (rnd() + 3) * dist;
            var vectors = box.generate_vectors(notation, vector, boost);
            box.rolling = true;
            if (before_roll) before_roll.call(box, vectors, notation);
            if (after_roll) {
                box.clear();
                box.roll(vectors, function(result) {
                    if (after_roll) after_roll.call(box, notation, result);
                    box.rolling = false;
                });
            }
        });
    }


}).apply(eaw.dice = eaw.dice || {});
