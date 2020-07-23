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

async function getIssuesList(viewType, project){

    const context = getContext(viewType)

    const issues = await listIssues(context, project)

    let issueItems = ""
    const issuesList = issues => {
        issues
            .filter((issue) => {
                let status = ""
                if (viewType == 'radar') {
                    status = "Em andamento"
                } else if (viewType == 'entrega') {
                    status = "Concluído"
                }

                return issue.status == status
            })
            .forEach((issue) => {
                issueItems += 
                    `<li class='demand'>
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
            })

        let listElement = document.querySelector('#demandList')
        listElement.innerHTML = issueItems

}
    issuesList(issues)

}

    document.querySelector('.getDemandList-form').addEventListener("submit", (e) => {
        e.preventDefault()
        getIssuesList(document.querySelector('#demandViewSelect').value
                    , document.querySelector('#projectSelect').value)
    })
