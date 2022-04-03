__TE__.xr = {}

__TE__.xr.profiles = {
    'oculus-touch' : {
        handedness : 'handedness',

        axes_x : 'gamepad.axes.2',
        axes_y : 'gamepad.axes.3',

        select_pressed : 'gamepad.buttons.0.pressed',
        select_touched : 'gamepad.buttons.0.touched',
        select_value : 'gamepad.buttons.0.value',

        squeeze_pressed : 'gamepad.buttons.1.pressed',
        squeeze_touched : 'gamepad.buttons.1.touched',
        squeeze_value : 'gamepad.buttons.1.value',

        axesclick_pressed : 'gamepad.buttons.3.pressed',
        axesclick_touched : 'gamepad.buttons.3.touched',
        axesclick_value : 'gamepad.buttons.3.value',

        first_pressed : 'gamepad.buttons.4.pressed',
        first_touched : 'gamepad.buttons.4.touched',
        first_value : 'gamepad.buttons.4.value',

        second_pressed : 'gamepad.buttons.5.pressed',
        second_touched : 'gamepad.buttons.5.touched',
        second_value : 'gamepad.buttons.5.value',

        btn_3_pressed : 'gamepad.buttons.2.pressed',
        btn_7_pressed : 'gamepad.buttons.6.pressed',

        btn_3_touched : 'gamepad.buttons.2.touched',
        btn_7_touched : 'gamepad.buttons.6.touched',

        axes_1 : 'gamepad.axes.0',
        axes_2 : 'gamepad.axes.1',
        btn_3_value : 'gamepad.buttons.2.value',
        btn_7_value : 'gamepad.buttons.6.value'
    }
}

__TE__.xr.get_controller_data = (src, val) => {
    // selecting profile structure
    let obj = null
    // match each profile
    Object.keys(__TE__.xr.profiles).forEach(profile => {
        if(src.profiles.includes(profile)) {
            obj = __TE__.xr.profiles[profile]
        }
    })
    // no profile match
    if(obj === null) { return }
    // path wise filter
    const arr = obj[val].split('.')
    arr.forEach(key => src = src[key])
    return src
}

__TE__.xr.init = modules => {
    // vr button
    let button = VRButton.createButton(modules.renderer)

    // setup dolly camera
    let dolly = new THREE.Group()
    let camera = modules.camera
    dolly.add(camera)
    modules.scene.add(dolly)
    modules.renderer.xr.getCamera(camera)

    let camHistory = new THREE.Vector3()

    // toggle cam for gl and xr
    modules.renderer.xr.addEventListener('sessionstart', () => {
        modules.camera.position.copy(camHistory)
        modules.controls.enabled = false
    })
    modules.renderer.xr.addEventListener('sessionend', () => {
        modules.controls.enabled = true
        camHistory.copy(modules.camera.position)
    })

    // session start
    modules.renderer.xr.addEventListener('sessionstart', e => {
        // xr session
        let session = modules.renderer.xr.getSession()
        // sources array
        let inputs = []
        // xr controller model factory
        let factory = new XRControllerModelFactory()
        // each controller
        for(let i = 0; i < 2; i++) {
            let controller = modules.renderer.xr.getController(i)
            let controllerGrip = modules.renderer.xr.getControllerGrip(i)
            let touch = __TE__.xr.build_touch(i)
            controllerGrip.add(factory.createControllerModel(controllerGrip))
            controller.add(touch)
            dolly.add(controller)
            dolly.add(controllerGrip)
            inputs.push({
                controller : controller,
                controllerGrip : controllerGrip,
                touch : touch
            })
        }
        modules.xr.session = session
        modules.xr.inputs = inputs
    })
    // touch model
    TrinityEngine.loadModel('../../engine/4.0/models/oculus_touch/scene.fbx', obj => {
        obj.scale.set(0.005, 0.005, 0.005)
        __TE__.xr.build_touch.model = obj
        modules.xr.inputs.forEach((input, i) => {
            __TE__.xr.build_touch.model = obj
            // controller is preloaded
            if(input.touch.children.length === 1) {
                let model = obj.clone()
                input.touch.add(model)
                // mirror for left hand
                if(i === 1) { model.scale.set(-0.005, 0.005, 0.005) }
            }
        })
    })
    // enable xr
    modules.renderer.xr.enabled = true
    TrinityEngine.createEventXR.check.modules = modules

    // return data
    return {
        camera : camera,
        controls : dolly,
        button : button,
        inputs : [],
        session : modules.renderer.xr.getSession(),
        update : TrinityEngine.createEventXR.check
    }
}

__TE__.xr.build_touch = i => {
    // attributes
    let position = new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1 ], 3)
    let color = new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0 ], 3)
    // geometry
    let geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', position)
    geometry.setAttribute('color', color)
    // material
    let material = new THREE.LineBasicMaterial({
        vertexColors : true,
        blending : THREE.AdditiveBlending
    })
    // mesh
    const line = new THREE.Line(geometry, material)
    line.name = 'line'
    line.scale.set(3, 3, 5)
    // group
    let group = new THREE.Group()
    group.add(line)
    // model is preloaded
    if(__TE__.xr.build_touch.model) {
        let model = __TE__.xr.build_touch.model.clone()
        group.add(model)
        // mirror for left hand
        if(i === 1) { model.scale.set(-0.005, 0.005, 0.005) }
    }
    return group
}

TrinityEngine.createEventXR = function() {
    let args = _args(arguments)
    let type = args.str[0]
    let objs = args.obj[0] || null
    let func = args.fun[0] || function() {}
    let indx = args.num[0] !== undefined ? args.num[0] : args.str[1] || 'any'

    let arr = TrinityEngine.createEventXR.list[type]
    if(arr) {
        arr.push({
            object : objs,
            touched : false,
            callback : func,
            index : indx
        })
    }
}

TrinityEngine.createEventXR.list = {
    'focus'          : [],
    'focusstart'     : [],
    'focusend'     : [],

    'axes'           : [],
    'axesup'         : [],
    'axesdown'       : [],
    'axesleft'       : [],
    'axesright'      : [],
    
    'axesclickstart' : [],
    'axesclick'      : [],
    'axesclickend'   : [],

    'selectstart'    : [],
    'select'         : [],
    'selectend'      : [],

    'squeezestart'   : [],
    'squeeze'        : [],
    'squeezeend'     : [],

    'firststart'     : [],
    'first'          : [],
    'firstend'       : [],

    'secondstart'    : [],
    'second'         : [],
    'secondend'      : [],

    'axesclicktouchstart' : [],
    'axesclicktouch'      : [],
    'axesclicktouchend'   : [],

    'selecttouchstart'    : [],
    'selecttouch'         : [],
    'selecttouchend'      : [],

    'squeezetouchstart'   : [],
    'squeezetouch'        : [],
    'squeezetouchend'     : [],

    'firsttouchstart'     : [],
    'firsttouch'          : [],
    'firsttouchend'       : [],

    'secondtouchstart'    : [],
    'secondtouch'         : [],
    'secondtouchend'      : []
}

TrinityEngine.createEventXR.history = [
    {
        select : false,
        squeeze : false,
        axesclick : false,
        axesup : false,
        axesdown : false,
        axesleft : false,
        axesright : false,
        first : false,
        second : false,

        selecttouch : false,
        squeezetouch : false,
        axestouch : false,
        firsttouch : false,
        secondtouch : false
    },
    {
        select : false,
        squeeze : false,
        axesclick : false,
        axesup : false,
        axesdown : false,
        axesleft : false,
        axesright : false,
        first : false,
        second : false,

        selecttouch : false,
        squeezetouch : false,
        axestouch : false,
        firsttouch : false,
        secondtouch : false
    }
]

TrinityEngine.createEventXR.check = () => {
    let modules = TrinityEngine.createEventXR.check.modules
    if(modules.xr.session && modules.renderer.xr.isPresenting) {
        modules.xr.session.inputSources.forEach((src, idx) => {
            let getData = __TE__.xr.get_controller_data
            let callback = TrinityEngine.createEventXR.callback
            // new and old data objects
            let old = TrinityEngine.createEventXR.history[idx]
            let crr = {}
            let lst = TrinityEngine.createEventXR.list

            // focus
            callback('focus', idx)
            callback('focusstart', idx)
            callback('focusend', idx)

            // axes
            let axes_x = getData(src, 'axes_x')
            let axes_y = getData(src, 'axes_y')
            
            crr.axesup    = axes_y < 0 && Math.abs(axes_y) > Math.abs(axes_x),
            crr.axesdown  = axes_y > 0 && Math.abs(axes_y) > Math.abs(axes_x),
            crr.axesleft  = axes_x < 0 && Math.abs(axes_x) > Math.abs(axes_y),
            crr.axesright = axes_x > 0 && Math.abs(axes_x) > Math.abs(axes_y)

            // axes events
            if(crr.axesup) { callback('axesup', idx) }
            if(crr.axesdown) { callback('axesdown', idx) }
            if(crr.axesleft) { callback('axesleft', idx) }
            if(crr.axesright) { callback('axesright', idx) }

            // any axes event
            if(crr.axesup || crr.axesdown || crr.axesleft || crr.axesright) {
                callback('axes', idx, crr)
            }

            const mod = [
                { data : '_pressed', type : '' }, 
                { data : '_touched', type : 'touch' }
            ]
            const arr = ['select', 'squeeze', 'axesclick', 'first', 'second']

            for(let k = 0; k < mod.length; k++) {
                for(let i = 0; i < arr.length; i++) {
                    const type = arr[i]
                    const mode = mod[k]
                    const eType = type + mode.type

                    crr[eType] = getData(src, type + mode.data)
                    
                    const oData = old[eType]
                    const nData = crr[eType]

                    if(oData && nData) { callback(eType, idx) }
                    if(oData && !nData) { callback(eType + 'start', idx) }
                    if(!oData && nData) { callback(eType + 'end', idx) }
                }
            }
            TrinityEngine.createEventXR.history[idx] = crr
        })
    }
}

__TE__.Matrix4 = new THREE.Matrix4()
__TE__.Raycaster = new THREE.Raycaster()

TrinityEngine.createEventXR.callback = (type, index) => {
    TrinityEngine.createEventXR.list[type].forEach(obj => {
        if(obj.index === 'any' || obj.index === index) {
            let mod = TrinityEngine.createEventXR.check.modules
            let src = mod.xr.session.inputSources[index]
            let ctr = mod.xr.inputs[index].controller
            let out = {
                source : src,
                history : TrinityEngine.createEventXR.history[index]
            }

            if(obj.object) {
                const raycaster = __TE__.Raycaster
                __TE__.Matrix4.identity().extractRotation(ctr.matrixWorld)
                raycaster.ray.origin.setFromMatrixPosition(ctr.matrixWorld)
                raycaster.ray.direction.set(0, 0, -1).applyMatrix4(__TE__.Matrix4)
                const arr = raycaster.intersectObjects([obj.object], false)
                const old = obj.touched
                if(arr.length > 0) {
                    out = arr[0]
                    out.source = src
                    out.history = TrinityEngine.createEventXR.history[index]
                    obj.touched = true
                    if(type !== 'focusstart' && type !== 'focusend') {
                        obj.callback(out)
                    }
                } else { obj.touched = false }
                if(type === 'focusstart' && old === false && obj.touched === true) {
                    obj.callback(out)
                } else if(type === 'focusend' && old === true && obj.touched === false) {
                    obj.callback(out)
                }
            } else {
                obj.callback(out)
            }


        }
    })
}