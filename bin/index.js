let qa = x => Array.from(document.querySelectorAll(x))
let qs = x => document.querySelector(x)
let cr = x => qs(x).getBoundingClientRect()

let stamp = Date.now()
let delay = 5000

let render = () => {
    requestAnimationFrame(render)
    if(Date.now() - stamp > delay) {
        delay = 5000
        stamp = Date.now()
        let element = qs('body')
        let current = parseInt(element.getAttribute('index'))
        qs('body').setAttribute('index', ++current < 4 ? current : 0)
    }
}

render()

window.addEventListener('load', () => {
    qa('.cover-button').forEach((e, i) => {
        e.addEventListener('click', () => {
            qs('body').setAttribute('index', i)
            stamp = Date.now()
            delay = 8000
        })
    })
    qa('.example-item').forEach(e => {
        e.addEventListener('click', () => {
            window.open('examples/' + e.getAttribute('link'))
        })
    })
})

let examples = {
    "car-configurator" : {
        title : 'Car Configurator',
        description : 'Design your dream ride',
        category : 1
    },
    "clothing-customizer" : {
        title : 'Clothing Customizer',
        description : 'Select the color and design',
        category : 1
    },
    "diyazen" : {
        title : 'Diyazen',
        description : 'Sri Lanka\'s first humanoid robot',
        category : 0
    },
    "furniture-collection" : {
        title : 'Furniture Collection',
        description : 'For your living room',
        category : 1
    },
    "kitchen-mate" : {
        title : 'Kitchen Mate',
        description : 'AR experience in your kitchen',
        category : 3
    },
    "room-3d" : {
        title : 'Room 3D',
        description : 'VR experience in bedroom',
        category : 2
    },
    "star-runner" : {
        title : 'Star Runner',
        description : '3D motion and effects',
        category : 0
    },
    "virtual-exhibition" : {
        title : 'Virtual Exhibition',
        description : 'Virtual visit for showrooms',
        category : 2
    }
}

window.addEventListener('load', () => {
    Object.keys(examples).forEach(key => {
        let e = document.createElement('div')
        e.setAttribute('class', 'example-item')
        e.setAttribute('link', key)
        e.setAttribute('style', `background-image: url(./bin/examples/${key}.svg)`)
        let k = examples[key]
        e.innerHTML = `
            <div class="example-item-title">${k.title}</div>
            <div class="example-item-description"></div>
            <div class="example-item-button"></div>
        `
        qa('.example-list')[k.category].appendChild(e)
    })
})