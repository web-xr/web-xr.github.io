let TrinityEngine = {}
let __TE__ = {}

TrinityEngine.init = (version, callback) => {
    delete TrinityEngine.init
    let index = 0
    let ended = false
    let array = [
        // three
        'engine/source/three/THREE.js',
        // loaders
        'engine/source/three/loaders/GLTFLoader.js',
        'engine/source/three/loaders/FBXLoader.js',
        'engine/source/three/libs/fflate.min.js',
        'engine/source/three/loaders/OBJLoader.js',
        'engine/source/three/loaders/MTLLoader.js',
        'engine/source/three/loaders/DDSLoader.js',
        'engine/source/three/loaders/PLYLoader.js',
        // shaders
        'engine/source/three/shaders/CopyShader.js',
        'engine/source/three/shaders/SSRShader.js',
        'engine/source/three/shaders/SSAOShader.js',
        'engine/source/three/shaders/LuminosityHighPassShader.js',
        // controls
        'engine/source/three/controls/OrbitControls.js',
        // postprocessing
        'engine/source/three/postprocessing/EffectComposer.js',
        'engine/source/three/postprocessing/RenderPass.js',
        'engine/source/three/postprocessing/OutlinePass.js',
        'engine/source/three/postprocessing/ShaderPass.js',
        'engine/source/three/postprocessing/SSRPass.js',
        'engine/source/three/postprocessing/SSAOPass.js',
        'engine/source/three/math/SimplexNoise.js',
        'engine/source/three/postprocessing/UnrealBloomPass.js',
        // webxr
        'engine/source/three/webxr/VRButton.js',
        'engine/source/three/webxr/XRControllerModelFactory.js',
        'engine/source/three/libs/motion-controllers.module.js',
        // gsap
        'engine/source/gsap/gsap.js',
        // trinity engine
        'engine/import.js',
        'engine/$VERSION/check.js',
        'engine/$VERSION/create.js',
        'engine/$VERSION/find.js',
        'engine/$VERSION/load.js',
        'engine/$VERSION/setup.js',
        'engine/$VERSION/tween.js',
        'engine/$VERSION/xr.js'
    ]
    let load = (manual = false) => {
        let script = document.createElement('script')
        
        let domain = location.toString()
        let source = array[index]

        if(manual) {
            source = domain + source
        } else {
            if(domain.indexOf('/staging/') > -1 || domain.indexOf('/examples/') > -1) {
                source = '../../' + source
            } else { source = './' + source }
        }

        script.src = source.replace('$VERSION', version)
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
