function xyzByDist(p1, p2, d) {
    var u = Math.pow(
        Math.pow(p2.x - p1.x, 2) +
        Math.pow(p2.y - p1.y, 2) +
        Math.pow(p2.z - p1.z, 2),
    0.5)
    d = u - d
    var s = d / u
    return {
        x : p1.x + s * (p2.x - p1.x),
        y : p1.y + s * (p2.y - p1.y),
        z : p1.z + s * (p2.z - p1.z)
    }
}

let tweenControls = function() {
    var args = _args(arguments)
    var type     = args.str[0].toUpperCase()
    var controls = args.obj[0]
    var pos_1    = args.obj[1]
    var pos_2    = args.obj[2]
    var callback = args.fun[0] || function() {}
    var ease     = args.str[1] || 'power1'
    var offset, time
    var t_0, t_1, p_0, p_1, d, a, b

    var t = controls.target
    var p = controls.object.position

    controls.enabled = false

    if(type === 'FIXED') {
        time   = args.num[0] / 1000
        d = { x : t.x - p.x, y : t.y - p.y, z : t.z - p.z }
        t_0 = { x : t.x, y : t.y, z : t.z }
        t_1 = { ease : ease, duration : time }
        Object.keys(pos_1).forEach(function(k) { t_1[k] = pos_1[k] })

        GSAP.timeline({
            onComplete : function() {
                controls.enabled = true
                controls.update()
                callback()
            },
            onUpdate : function() {
                controls.object.position.set(t_0.x, t_0.y, t_0.z)
                controls.target.set(t_0.x + d.x, t_0.y + d.y, t_0.z + d.z)
                controls.update()
            }
        }).fromTo(t_0, t_0, t_1)
    }

    if(type === 'LOOSE') {
        offset = args.num[0]
        time   = args.num[1] / 1000
        t_0 = { x : t.x, y : t.y, z : t.z }
        p_0 = { x : p.x, y : p.y, z : p.z }
        t_1 = { ease : ease, duration : time }
        Object.keys(pos_1).forEach(function(k) { t_1[k] = pos_1[k] })

        p_1 = xyzByDist(p_0, t_1, offset)
        var startRotation = new THREE.Euler().copy(controls.object.rotation)
        
        a = { px : p_0.x, py : p_0.y, pz : p_0.z, tx : t_0.x, ty : t_0.y, tz : t_0.z }
        b = { px : p_1.x, py : p_1.y, pz : p_1.z, tx : t_1.x, ty : t_1.y, tz : t_1.z }
        b.ease = ease
        b.duration = time

        GSAP.timeline({
            onComplete : function() {
                controls.enabled = true
                callback()
            },
            onUpdate : function() {
                controls.target.set(a.tx, a.ty, a.tz)
                controls.object.position.set(a.px, a.py, a.pz)
                controls.update()
                controls.object.rotation.copy(startRotation)
            }
        }).fromTo(a, a, b)

    }

    if(type === 'EXACT') {
        time = args.num[0] / 1000
        t_0 = { x : t.x, y : t.y, z : t.z }
        p_0 = { x : p.x, y : p.y, z : p.z }
        p_1 = { }
        t_1 = { ease : ease, duration : time }
        Object.keys(pos_1).forEach(function(k) { t_1[k] = pos_1[k] })
        Object.keys(pos_2).forEach(function(k) { p_1[k] = pos_2[k] })
        a = { px : p_0.x, py : p_0.y, pz : p_0.z, tx : t_0.x, ty : t_0.y, tz : t_0.z }
        b = { px : p_1.x, py : p_1.y, pz : p_1.z, tx : t_1.x, ty : t_1.y, tz : t_1.z }
        b.ease = ease
        b.duration = time
        GSAP.timeline({
            onComplete : function() {
                controls.enabled = true
                callback()
            },
            onUpdate : function() {
                controls.target.set(a.tx, a.ty, a.tz)
                controls.object.position.set(a.px, a.py, a.pz)
                controls.update()
            }
        }).fromTo(a, a, b)
    }
    
}

tweenControls.captureSpot = function() {
    var args = _args(arguments)
    var controls = args.obj[0]
    var scene    = args.obj[1]
    window.addEventListener('dblclick', function() {
        console.log(['TARGET'])
        console.log('x ==> ', controls.target.x)
        console.log('y ==> ', controls.target.y)
        console.log('z ==> ', controls.target.z)
        console.log(['CAMERA'])
        console.log('x ==> ', controls.object.position.x)
        console.log('y ==> ', controls.object.position.y)
        console.log('z ==> ', controls.object.position.z)
        console.log(['SCENE'])
        console.log('x ==> ', scene.rotation.x)
        console.log('y ==> ', scene.rotation.y)
        console.log('z ==> ', scene.rotation.z)
    })
}

let tweenObject = function() {
    var args = _args(arguments)
    var obj  = args.obj[0]
    var val  = args.obj[1]
    var ease = args.str[0] || 'power1'
    var time = args.num[0] || 1000
    var back = args.fun[0] || function() {}
    // prepare
    var a = {}, b = { ease : ease, duration : time / 1000 }
    var arr = ['position', 'rotation', 'scale']
    arr.forEach(function(type) {
        // defaults
        a[type + 'X'] = b[type + 'X'] = obj[type].x
        a[type + 'Y'] = b[type + 'Y'] = obj[type].y
        a[type + 'Z'] = b[type + 'Z'] = obj[type].z
        // updates
        if(val[type]) {
            if(val[type].x !== undefined) { b[type + 'X'] = val[type].x }
            if(val[type].y !== undefined) { b[type + 'Y'] = val[type].y }
            if(val[type].z !== undefined) { b[type + 'Z'] = val[type].z }
        }
    })
    // tween
    GSAP.timeline({
        onComplete : function() {
            back()
        },
        onUpdate : function() {
            Object.keys(a).forEach(function(key) {
                if(key === '_GSAP') { return }
                var type = key.substr(0, key.length - 1)
                var axis = key[key.length - 1].toLocaleLowerCase()
                if(type === '_gsa') { return }
                obj[type][axis] = a[key]
            })
        }
    }).fromTo(a, a, b)
}

let tweenMaterial = function() {
    var args = _args(arguments)
    var type = args.str[0] || 'VALUE'
    var mesh = args.obj[0]
    var data = args.obj[1]
    var time = args.num[0] || 1000
    var ease = args.str[1] || 'power1'
    var back = args.fun[0] || function() {}
    var a, b

    if(type === 'CLONE') {
        // mesh duplicate
        let new_mesh = mesh.clone(false)
        mesh.add(new_mesh)
        // material duplicate
        new_mesh.material = mesh.material.clone()
        // maps array
        let mprr = [
            'alphaMap', 'aoMap', 'bumpMap', 'displacementMap', 'emissiveMap',
            'envMap', 'lightMap', 'map', 'normalMap', 'roughnessMap'
        ]
        // clone maps
        mprr.forEach(function(map) {
            if(mesh.material[map]) {
                new_mesh.material[map] = mesh.material[map].clone()
                new_mesh.material[map].needsUpdate = true
            }
        })
        // set maps
        Object.keys(data).forEach(function(key) {
            if(mprr.indexOf(key) > -1) {
                new_mesh.material[key].image = data[key]
            } else {
                new_mesh.material[key] = data[key]
            }
        })
        // transparent
        new_mesh.material.transparent = true
        new_mesh.material.opacity = 0
        new_mesh.material.needsUpdate = true
        // tween
        a = { opacity : 0 }
        b = { opacity : 1, duration : time / 1000, ease : ease }
        GSAP.timeline({
            onComplete : function() {
                // callback
                mesh.material = new_mesh.material
                mesh.remove(new_mesh)
                back()
            },
            onUpdate : function() {
                new_mesh.material.opacity = a.opacity
            }
        }).fromTo(a, a, b)

    }

    if(type === 'VALUE') {
        a = {}
        b = { duration : time / 1000, ease : ease }
        Object.keys(data).forEach(function(key) {
            if(typeof mesh.material[key] === 'object') {
                let obj = mesh.material[key]
                Object.keys(obj).forEach(function(sky) {
                    a[key + '.' + sky] = mesh.material[key][sky]
                    b[key + '.' + sky] = data[key][sky]
                })
            } else {
                a[key] = mesh.material[key]
                b[key] = data[key]
            }
        })
      
        GSAP.timeline({
            onComplete : function() {
                back()
            },
            onUpdate : function() {
                Object.keys(a).forEach(function(key) {
                    if(key.indexOf('.') > -1) {
                        var t = key.split('.')
                        mesh.material[t[0]][t[1]] = a[key]
                    } else {
                        mesh.material[key] = a[key]
                    }
                })
            }
        }).fromTo(a, a, b)

    }


}

// ============================================================================

TrinityEngine.tweenControls = tweenControls
TrinityEngine.tweenMaterial = tweenMaterial
TrinityEngine.tweenObject = tweenObject