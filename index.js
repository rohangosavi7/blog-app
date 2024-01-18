const tabContent = document.querySelector(".tab-content");

const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

const mainDiv = document.querySelector(".main")


tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        target.classList.add('active')
    })
})

//defining all arrays

// let allCategories = [
//     {
//         name: "Tech"
//     },
//     {
//         name: "Education"
//     },
//     {
//         name: "News"
//     }
// ];


// const tabContentContainer = tabContent.querySelectorall("#tab-content-container")

// // Make an AJAX request to the server
// var xhr = new XMLHttpRequest();
// xhr.open("GET", "http://localhost:3000/blogs/:title", true);


//     let blog1 = `<img src="src/images/img1.jpg" alt="" />
//         <h4 class="blog-category">${category}</h4>
//         <h3 class="blog-title">${title}</h3>
//         <p class="blog-desc">${content}
//         </p>`

//     tabContentContainer.insertAdjacentHTML("beforeend", blog1);

