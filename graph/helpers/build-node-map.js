const { keys } = Object

module.exports = buildNodeMap

function buildNodeMap (friends) {
  return keys(friends).reduce((memo, id)  => {
    memo[id] = {
      data: {
        friends: keys(friends[id])
      }
    }
    return memo
  }, {})
}
