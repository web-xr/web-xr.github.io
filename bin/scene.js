let element = document.querySelector('.cover-canvas')

let modules = TrinityEngine.createScene(1, 1, '#1f2d2d', 'low-power')
let setup = () => {
    let height = cr('.cover-title').height + cr('.cover-button-container').height
    let width = element.getBoundingClientRect().width
    let scale = width * 0.00007
    scale = width * 0.000025
    TrinityEngine.setupScene(modules.composer, modules.camera, width, height)
    if(modules.model) {
        TrinityEngine.setupObject(modules.model, {
            position : { x : 0, y : -scale * 22, z : 0 },
            scale : { x : scale, y : scale, z : scale },
            rotation : { x : -Math.PI * 0.5, y : 0, z : 0 }
        })
    }
}

// ambient light
modules.light.intensity = 0.1

// direct light
modules.direct = TrinityEngine.createLight('DIRECT', 0xffffff, 0.2)
modules.direct.castShadow = true
modules.direct.shadow.mapSize.width = 1024
modules.direct.shadow.mapSize.height = 1024
modules.direct.shadow.radius = 1
modules.direct.shadow.camera.near = 0.1
modules.direct.shadow.camera.far = 1000
modules.direct.position.x = 30
modules.direct.position.y = 20
modules.direct.position.z = 60
modules.scene.add(modules.direct)

// hemisphere light
modules.hemisp = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.4);
modules.scene.add(modules.hemisp)

// renderer shadow map
modules.renderer.shadowMap.enabled = true
modules.renderer.shadowMapSoft = true
modules.renderer.shadowMap.type = THREE.PCFShadowMap

// controls setup
TrinityEngine.setupControls(
    'ORBIT', modules.controls,
    { x : 1.646975163866991, y : 1.5868920309808743, z : -1.9414547359169998 },
    { x : 0, y : 0, z : 0 },
    {
        maxPolarAngle : Math.PI / 3.1, minPolarAngle : Math.PI / 3.1,
        maxAzimuthAngle : 9.4, minAzimuthAngle : 8,
        autoRotate : false, autoRotateSpeed : -2, enableZoom  : false,
        enabled : true
    }
)

// window resize setup
window.addEventListener('resize', setup)

// load model
TrinityEngine.loadModel(`resources/models/magicalvoxel_room_04/scene.obj`, model => {
    model.traverse(function(child) {
        if(child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    modules.model = model

    setup()

    modules.bloomPass.strength = 0.1
    modules.light.intensity = 0.4
    modules.direct.intensity = 0.2
    modules.hemisp.intensity = 0.5
    modules.renderer.toneMapping = THREE.LinearToneMapping

    modules.scene.add(model)
})

// ssao
modules.ssaoPass = TrinityEngine.createEffect(
    'SSAO', modules.scene, modules.camera, modules.composer, {
        kernelRadius : 55, kernelSize : 65,
        minDistance : 0.1, maxDistance : 0.4,
        enabled : 1
    }
)

// bloom
modules.bloomPass = TrinityEngine.createEffect(
    'UnrealBloom', modules.scene, modules.camera, modules.composer, {
        strength : 0.3,
        enabled : 1
    }
)

element.appendChild(modules.renderer.domElement)