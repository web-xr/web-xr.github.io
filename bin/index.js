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