const waterfall = require('run-waterfall')
const sendJson = require('send-data/json')
const sendError = require('send-data/error')
const Routes = require('http-routes')

const buildLinks = require('./helpers/build-links')
const buildNodes = require('./helpers/build-nodes')
const buildNodeMap = require('./helpers/build-node-map')

module.exports = GraphApi

function GraphApi (ssb, config) {
  return Routes([
    ['/api/graph', {
      get: (req, res, next) => {
        sendGraph(req, res)
      }
    }]
  ])

  function sendGraph (req, res) {
    getGraph((err, graph) => {
      if (err) {
        sendError(req, res, { body: err })
      } else {
        sendJson(req, res, { body: graph })
      }
    })
  }

  function getGraph (cb) {
    waterfall([
      ssb.friends.all,
      (friends, cb) => {
        cb(null, {
          id: ssb.id,
          nodeMap: buildNodeMap(friends),
          nodes: buildNodes(friends),
          links: buildLinks(friends)
        })
      }
    ], cb)
  }
}
