const { assign } = Object
const html = require('inu/html')
const { run } = require('inux')
const { map } = require('lodash')
const Widget = require('cache-element/widget')


const { hover } = require('./actions')

module.exports = GraphView

function GraphView (config) {
  var two
  const width = 900
  const height = 900

  return Widget({
    render: function (graph, dispatch) {
      return html`<div class='graph'>
        <svg 
          id='diagram'
          width=${width}
          height=${height}
          xmlns="http://www.w3.org/2000/svg" >      
          <defs xmlns="http://www.w3.org/2000/svg">
            <filter id="dropshadow" width='150%' height="150%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/> 
              <feOffset dx="-1" dy="2" result="offsetblur"/> 
              <feMerge> 
                <feMergeNode />
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>
          <g id='links'>



          </g>
        </svg>
      </div>`
    },
    onupdate: function (el, graph, dispatch) {
      console.log('graph', graph)

    
    }
  })

//      if (!display) {
//        ngraph = fromJson(graph)
//        display = Display(el)
//        display.on('nodehover', NodeHoverHandler(dispatch))
//      } else {
//        // TODO a better way to update the graph
//        // updateGraph(graph)
//        // display.off('nodehover')
//        // display.on('nodehover', NodeHoverHandler(dispatch))
//      }
//    }
  /*
  function updateGraph ({ nodes, links }) {
    ngraph.beginUpdate()
    ngraph.forEachLink(link => {
      ngraph.removeLink(link)
    })
    ngraph.forEachNode(node => {
      ngraph.removeNode(node)
    })
    nodes.forEach(node => {
      ngraph.addNode(node.id, node.data)
    })
    links.forEach(link => {
      ngraph.addLink(link.fromId, link.toId, link.data)
    })
    ngraph.endUpdate()
  }
  */

  function Display (node) {
    const ngraphConfig = assign({ container: node }, config)
    return Renderer(ngraph, ngraphConfig)
  }

  function NodeHoverHandler (dispatch) {
    return (node) => {
      if (node === undefined) return

      dispatch(run(hover(node.id)))

      display.forEachLink(linkUI => {
        const { from, to } = linkUI
        const friends = node.data.friends

        const isFromTarget = node.id === from.id
        const isToTarget = node.id === to.id

        const isFromFriend = friends.indexOf(from.id) > -1
        const isToFriend = friends.indexOf(to.id) > -1
        const involvesFoaF = isFromFriend || isToTarget

        var fromColor = 0x000066
        var toColor = 0x000066

        const close = 0xffffff
        const mid = 0xa94caf
        const far = 0x000066

        if (isFromTarget) {
          fromColor = close
          toColor = mid
        } else if (isToTarget) {
          fromColor = mid
          toColor = close
        } else if (involvesFoaF && isFromFriend) {
          fromColor = mid
          toColor = far
        } else if (involvesFoaF && isToFriend) {
          fromColor = far
          toColor = mid
        }

        linkUI.fromColor = fromColor
        linkUI.toColor = toColor
      })
    }
  }
}
