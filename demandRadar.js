async function getIssues() {
    const url = 'http://127.0.0.1:3333/api/v1/getIssuesList'
    try {
        const response = await fetch(url)
        const content = await response.text()
        return JSON.parse(content)
    } catch(err){
        return
    }
}

async function listIssues(){
    const res = await getIssues()
    const issues = res.issue

    return issues
}

async function getIssuesList(viewType){

    const issues = await listIssues()

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
        getIssuesList(document.querySelector('#demandViewSelect').value)
    })
