const modal = document.getElementById('modal')
const modalShow = document.getElementById('show-modal')
const modalClose = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form')
const websiteNameEl = document.getElementById('website-name')
const websiteUrlEl = document.getElementById('website-url')
const bookmarksContainer = document.getElementById('bookmarks-container')

let bookmarks = []

// Show Modal, Focus on Input
const showModal = () => {
    modal.classList.add('show-modal')
    websiteNameEl.focus()
}

// Modal Event Listners
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'))
window.addEventListener('click', (e) => (e.target === modal) ? modal.classList.remove('show-modal') : false)

// Validate form
const isValidData = (name, url) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    const regEx = new RegExp(expression)
    if(!name) {
        alert('Please enter a website name!')
        return false
    }
    if(!url.match(regEx)) {
        alert('Please enter a valid url')
        return false
    }
    return true
}

// Build Bookmarks DOM
const buildBookmarks = () => {
    // Remove all bookmarks elements
    bookmarksContainer.innerHTML = ''
    // Build bookmarks
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark
        const item = document.createElement('div')
        item.classList.add('item')
        const closeIcon = document.createElement('i')
        closeIcon.classList.add('fas', 'fa-times')
        closeIcon.setAttribute('title', 'Delete Bookmark')
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)

        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name')
        const favicon = document.createElement('img')
        favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`)
        favicon.setAttribute('alt', 'Favicon')

        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('target', '_blank')
        link.textContent = name

        // Append to bookmarks contianer
        linkInfo.append(favicon,link)
        item.append(closeIcon, linkInfo)
        bookmarksContainer.appendChild(item)

    })
}

// Fetch bookmarks from localStorage
const getBookmarks = () => {
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    } else {
        bookmarks = [
            {
                name: 'google search',
                url: 'https://google.com'
            }
        ]
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
    buildBookmarks()
}

// Delete Bookmark
const deleteBookmark = (url) => {
    console.log(url)
    bookmarks.forEach((bookmark, index) => {
        if (bookmark.url === url) {
            bookmarks.splice(index,1)
        }
    })
    // update the LS and re-populate bookmarks in DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    getBookmarks()
}

// Handle and Save Data from Form
const storeBookmark = (e) => {
    e.preventDefault()
    const websiteName = websiteNameEl.value
    let url = websiteUrlEl.value
    if(!url.includes('http://') && !url.includes('https://')) {
        url = `https://${url}`
    }
    if(!isValidData(websiteName, url)) {
        return false
    }
    const bookmark = {
        name: websiteName,
        url: url
    }
    bookmarks.push(bookmark)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    bookmarkForm.reset()
    websiteNameEl.focus()
    getBookmarks()
}

// Event Listner
bookmarkForm.addEventListener('submit', storeBookmark)

// On Load, Fetch Bookmarks
getBookmarks()