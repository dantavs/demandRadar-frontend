async function getIssues(context, project) {
//    const url = `http://127.0.0.1:3333/api/v1/getIssuesList/radarSOC`
    const url = `http://127.0.0.1:3333/api/v1/getIssuesListbyContext?project=${project}&id=1`
    try {
        const response = await fetch(url)
        const content = await response.text()
        return JSON.parse(content)
    } catch(err){
        return
    }
}

async function listIssues(context, project){
    const res = await getIssues(context, project)
    const issues = res.issue

    return issues
}

function getContext(option){
    let context = ''
    switch (option){
        case ('radar'):
            context = 'radarSOC'
            break
        case ('entrega'):
            context ='radarSOC'
            break
        default:
            break
    }
    return context
}

function getPageItems(items, page){
    const itemsPerPage = 6
    const pagesTotal = Math.ceil(items.length / itemsPerPage)
    let currentPage = page
    
    let pageItems = []

    let pageStart = (currentPage-1) * itemsPerPage
    
    let pageEnd = 0
    if (pagesTotal === page){
        pageEnd = items.length
    }else{
        pageEnd = currentPage * itemsPerPage
    }
    

    for (var i = pageStart; i < pageEnd; i++){
        pageItems.push(items[i])
    }
    console.log("pageItems: ", pageItems)
    return pageItems
}

function setLiItem(issue){
    const issueItem = `<li class='demand'>
        <div class='header'>
            <strong>${issue.key}</strong>
        </div>
        <strong class='epicName'>${issue.epicName}</strong>
        <span class='summary'>${issue.summary}</span>
        <div class='tags'>
            <span class='project'>${issue.project}</span>
            <span class='status'>${issue.status}</span>
        </div>
    </li>`

    return issueItem
}

function setPageItems (issueList){
    let pageItems = ""

    issueList.forEach((issue) => { 
            pageItems += setLiItem(issue)
    })

    return pageItems
}

function setIssuesList(issues, viewType, page) {

    let filteredIssues = issues
    .filter((issue) => {
        let status = ""
        if (viewType == 'radar') {
            status = "Em andamento"
        } else if (viewType == 'entrega') {
            status = "Concluído"
        }

        return issue.status == status
    })

    const pageItems = getPageItems(filteredIssues, page)
    const pageData = setPageItems(pageItems)

    return pageData
}

async function getIssuesList(viewType, project, page){
    console.log("getPage: ", page)
    const context = getContext(viewType)
    const issues = await listIssues(context, project)

    const issuesListItems = setIssuesList(issues, viewType, page)

    let listElement = document.querySelector('#demandList')
    listElement.innerHTML = issuesListItems

    let pageNumberElement = document.querySelector('#pageNumber')
    pageNumberElement.innerHTML = page

    let pagesTotalElement = document.querySelector('#pagesTotal')
    pagesTotalElement.innerHTML = 2

    document.querySelector('#prevButton').style.display = "block"
    document.querySelector('#nextButton').style.display = "block"
    document.querySelector('#prevButton').disabled = true
}


async function goToNextPage() {
    console.log("Next Page")
    await getIssuesList(document.querySelector('#demandViewSelect').value
                , document.querySelector('#projectSelect').value
                , parseInt(document.querySelector('#pageNumber').innerHTML) + 1)

    const currentPage = document.querySelector('#pageNumber').innerHTML
    const pagesTotal = document.querySelector('#pagesTotal').innerHTML

    if (currentPage === pagesTotal){
        document.querySelector('#nextButton').disabled = true
    }

    document.querySelector('#prevButton').disabled = false
}

async function goToPrevPage() {
    console.log("Prev Page")
    await getIssuesList(document.querySelector('#demandViewSelect').value
                , document.querySelector('#projectSelect').value
                , parseInt(document.querySelector('#pageNumber').innerHTML) - 1)

    const currentPage = document.querySelector('#pageNumber').innerHTML

    if (currentPage === 1){
        document.querySelector('#prevButton').disabled = true
    }

    document.querySelector('#nextButton').disabled = false
}

document.querySelector('.getDemandList-form').addEventListener("submit", (e) => {
    e.preventDefault()
    getIssuesList(document.querySelector('#demandViewSelect').value
                , document.querySelector('#projectSelect').value, 1)
})

