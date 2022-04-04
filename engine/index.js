let TrinityEngine = {}
let __TE__ = {}

TrinityEngine.init = (root, callback) => {
    TrinityEngine._glob = {
        root : root,
        xr : { profile : { layouts : {} } }
    }
    delete TrinityEngine.init
    let index = 0
    let ended = false
    let array = [
        // three
        '../source/three/THREE.js',
        // loaders
        '../source/three/loaders/GLTFLoader.js',
        '../source/three/loaders/FBXLoader.js',
        '../source/three/libs/fflate.min.js',
        '../source/three/loaders/OBJLoader.js',
        '../source/three/loaders/MTLLoader.js',
        '../source/three/loaders/DDSLoader.js',
        '../source/three/loaders/PLYLoader.js',
        // shaders
        '../source/three/shaders/CopyShader.js',
        '../source/three/shaders/SSRShader.js',
        '../source/three/shaders/SSAOShader.js',
        '../source/three/shaders/LuminosityHighPassShader.js',
        // controls
        '../source/three/controls/OrbitControls.js',
        // postprocessing
        '../source/three/postprocessing/EffectComposer.js',
        '../source/three/postprocessing/RenderPass.js',
        '../source/three/postprocessing/OutlinePass.js',
        '../source/three/postprocessing/ShaderPass.js',
        '../source/three/postprocessing/SSRPass.js',
        '../source/three/postprocessing/SSAOPass.js',
        '../source/three/math/SimplexNoise.js',
        '../source/three/postprocessing/UnrealBloomPass.js',
        // webxr
        '../source/three/webxr/VRButton.js',
        '../source/three/webxr/XRControllerModelFactory.js',
        '../source/three/libs/motion-controllers.module.js',
        // gsap
        '../source/gsap/gsap.js',
        // trinity engine
        '../import.js',
        'check.js',
        'create.js',
        'find.js',
        'load.js',
        'setup.js',
        'tween.js',
        'xr.js'
    ]
    let load = (manual = false) => {
        let script = document.createElement('script')
        script.src = (manual ? location.toString() : root) + array[index]
        document.head.appendChild(script)

        script.onload = () => {
            if(index === array.length - 1) {
                if(ended) { return }
                if(callback === undefined) {
                    return
                } else if(Array.isArray(callback)) {
                    array = callback
                    index = 0
                    ended = true
                    load(true)
                } else if(typeof callback === 'string') {
                    array = [callback]
                    index = 0
                    ended = true
                    load(true)
                } else if(typeof callback === 'function') {
                    callback(TrinityEngine)
                }
            } else {
                // load next file
                index++
                load(ended)
            }
        }
    }
    load()
}
