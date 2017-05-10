// Automatically instantiates itself based on a class name of mzw-randoms-app.
// i.e. insert <div class="mzw-randoms-app"></div>
function MazeWorldRandoms(app) {

    // Context.
    var self = this

    // Clean slate.  No luxury of DOM-diffing here.
    app.innerHTML = ""

    self.scratchpad = document.createElement('h4')
    self.scratchpad.id = 'scratchpad'
    app.appendChild(self.scratchpad)

    self.collections = document.createElement('ul')
    app.appendChild(self.collections)

    self.fetchAllCollections()
        .then(self.renderCollections.bind(self))
}

MazeWorldRandoms.prototype.renderCollections = function(collections) {
    var self = this
    self.collections.innerHTML = ""
    collections.forEach(function(collection) {
        var collectionListItem = document.createElement('li')
        var collectionLink = document.createElement('a')
        collectionLink.innerText = collection
        collectionLink.href = '#scratchpad'
        collectionLink.setAttribute('data-collection', collection)
        collectionLink.addEventListener('click', function(e) {
            e.preventDefault()
            var desiredCollection = e.target.getAttribute('data-collection')
            self.newRandomTerm(desiredCollection)
        })
        collectionListItem.appendChild(collectionLink)
        self.collections.appendChild(collectionListItem)
    })
}

MazeWorldRandoms.prototype.newRandomTerm = function(term) {
    var self = this;
    this.fetchCollection(term)
        .then(function(resultText) {
            self.scratchpad.innerHTML = ""
            self.scratchpad.innerText = term
            var showoff = document.createElement('tt')
            showoff.innerText = resultText
            self.scratchpad.appendChild(showoff)
        })
        .catch(console.error)
}

MazeWorldRandoms.prototype.fetchAllCollections = function() {
    return fetch('https://mazeworld-randoms-api.now.sh/v1/collections')
        .then(function(res) {
            return res.json()
        })
        .then(function(collections) {
            return collections.collections
        })
        .catch(function(err) {
            console.error(err)
        })
}

MazeWorldRandoms.prototype.fetchCollection = function(collection) {
    return fetch('https://mazeworld-randoms-api.now.sh/v1/collections/'+collection)
        .then(function(res) {
            return res.json()
        })
        .then(function(collection) {
            return collection.term
        })
        .catch(function(err) {
            console.error(err)
        })
}



document.addEventListener('DOMContentLoaded', function() {
    Array.prototype.slice.call(document.querySelectorAll('.mzw-randoms-app')).forEach(function(app) {
        new MazeWorldRandoms(app)
    })
})