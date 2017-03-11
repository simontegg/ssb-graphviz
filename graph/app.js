const { assign } = Object
const xhr = require('xhr')
const { Domain, run } = require('inux')
const pullContinuable = require('pull-cont')
const html = require('inu/html')
const pull = require('pull-stream')

const { 
  SET, 
  SET_HOVER, 
  FETCH, 
  HOVER, 
  FILTER_GRAPH,
  set, 
  setHover, 
  fetch,
  filterGraph } = require('./actions')
const GraphView = require('./view')
const { fetchOne: fetchProfile } = require('../profiles/actions')
const ProfileView = require('../profiles/view')

module.exports = GraphApp

function GraphApp (config) {
  const graphView = GraphView(config)
  const profileView = ProfileView(config)

  return Domain({
    name: 'graph',
    init: () => ({
      model: {
        id: '',
        nodeMap: {},
        nodes: [],
        links: [],
        center: '',
        visibleNodes: [],
        visibleLinks: []
      },
      effect: fetch()
    }),
    update: {
      [SET]: (model, graph) => ({ 
        model: assign({}, graph, { center: graph.id }),
      }),
      [SET_HOVER]: (model, hover) => ({
        model: assign({}, model, { hover })
      }),
      [FILTER_GRAPH]: (model, center, graph) => {
        const { nodeMap, links } = graph ? graph : model
        return {
          model: assign({}, model, { 
            visibleNodes: nodeMap[center].data.friends,
            visisbleLinks: links.filter(({fromId, toId}) => (
              fromId === center || toId === center
            ))
          })
        }
      }
    },
    run: {
      [FETCH]: () => {
        return pullContinuable(cb => {
          xhr({
            url: '/api/graph',
            json: true
          }, (err, resp, { body } = {}) => {
            if (err) return cb(err)
            cb(null, pull.values([set(body), filterGraph(body.id, body)]))
          })
        })
      },
      [HOVER]: (id) => {
        return pull.values([
          setHover(id),
          run(fetchProfile(id))
        ])
      }
    },
    routes: [
      ['/', (params, model, dispatch) => {
        const { graph, profiles } = model
        const { hover } = graph
        const hoveredProfile = hover ? profiles[hover] : undefined

        return html`
          <div class='main'>
            ${graphView(graph, dispatch)}
            ${profileView(hoveredProfile, dispatch)}
          </div>
        `
      }]
    ]
  })
}
