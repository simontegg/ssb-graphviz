const { Action } = require('inux')

const SET = Symbol('set')
const SET_HOVER = Symbol('setHover')
const FETCH = Symbol('fetch')
const HOVER = Symbol('hover')
const FILTER_GRAPH = Symbol('filterGraph')
const LAYOUT = Symbol('layout')

const set = Action(SET)
const setHover = Action(SET_HOVER)
const fetch = Action(FETCH)
const hover = Action(HOVER)
const filterGraph = Action(FILTER_GRAPH)
const layout = Action(LAYOUT)

module.exports = {
  SET,
  SET_HOVER,
  FETCH,
  HOVER,
  FILTER_GRAPH,
  LAYOUT,
  set,
  setHover,
  fetch,
  hover,
  filterGraph,
  layout
}
