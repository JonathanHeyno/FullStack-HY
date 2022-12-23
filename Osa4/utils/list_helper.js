var maxBy = require('lodash/maxBy');
var countBy = require('lodash/countBy');
var groupBy = require('lodash/groupBy');
var mapValues= require('lodash/mapValues');
var max = require('lodash/max');
var sumBy = require('lodash/sumBy');
const { forEach } = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (array) => {
    const reducer = (sum, item) => {
      return sum + item.likes
    }
  
    return array.reduce(reducer, 0)
}

const favoriteBlog = (array) => {
    if (array && array.length) {
        const reducer = (largest, item) => {
        return item.likes > largest.likes ? item : largest
        }
        return array.reduce(reducer, array[0])
    }
    return null
}

const mostBlogs = (array) => {
    if (array && array.length) {
        const blogsCounted = countBy(array, 'author')
        const maxValue = max(Object.values(blogsCounted))
        const author = Object.keys(blogsCounted).reduce((a, b) => blogsCounted[a] > blogsCounted[b] ? a : b);
        return {"author": author, "blogs": maxValue}
    }
    return null
}

const mostLikes = (array) => {
    if (array && array.length) {
        const blogsGrouped = groupBy(array, 'author')
        const likesCounted = mapValues(blogsGrouped, function(o) { return sumBy(o, 'likes'); })
        const maxValue = max(Object.values(likesCounted))
        const author = Object.keys(likesCounted).reduce((a, b) => likesCounted[a] > likesCounted[b] ? a : b);
        return {"author": author, "likes": maxValue}
    }
    return null
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}