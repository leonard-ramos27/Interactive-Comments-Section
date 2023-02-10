const mainSection = document.getElementsByTagName('main')[0]
let commentsData = {}
let currentUser = null

getLocalCommentsData()

function getLocalCommentsData(){
    if(localStorage.getItem('commentsData') === null){
        const requestData = new XMLHttpRequest()
        requestData.open('GET', 'https://leonard-ramos27.github.io/Interactive-Comments-Section/script/data.json')
        requestData.onload = () => {
            if(requestData.status >= 200 && requestData.status < 400){
                const receivedData = JSON.parse(requestData.responseText)
                console.log(receivedData)
                commentsData = receivedData
                currentUser = commentsData.currentUser
                commentsData.votedComments = {
                    "upvoted_comments":[],
                    "downvoted_comments":[]
                }
                displayComments()
            }else{
                alert("Error Loading Data")
            }
        }
        requestData.send()
    }else{
        commentsData = JSON.parse(localStorage.getItem('commentsData'))
        currentUser = commentsData.currentUser
        displayComments()
    }
}

function updateLocalCommentsData(){
    if(commentsData !== null){
        localStorage.setItem('commentsData', JSON.stringify(commentsData))
    }
}

function generateNewID(){
    let comments = commentsData.comments
    let newID = 1
    comments.forEach(comment => {
        if(comment.id >= newID){
            newID = comment.id+1
        }
        if(comment.replies.length > 0){
            comment.replies.forEach(reply => {
                if(reply.id >= newID){
                    newID = reply.id+1
                }
            })
        }
    })
    return newID
}

function newComment(content){
    commentsData.comments.push(new function(){
        this.id = generateNewID()
        this.content = content
        const options = {year: 'numeric', month: 'short', day: 'numeric' };
        this.createdAt = new Date().toLocaleDateString('en-us', options)
        this.score = 0
        this.user = currentUser
        this.replies = []
    })
}

function addNewReply(commentID, replyContent){
    commentsData.comments.forEach(comment => {
        if(comment.id == commentID){
            newReply(comment, comment.user.username, replyContent)
        }else if(comment.replies.length > 0){
            comment.replies.forEach(reply => {
                if(reply.id == commentID){
                    newReply(comment, reply.user.username, replyContent)
                }
            })
        }
    })
    mainSection.innerHTML = ""
    displayComments()
}

function newReply(comment, replyingToUsername, replyContent){
    comment.replies.push(new function(){
        this.id = generateNewID()
        this.content = replyContent
        const options = {year: 'numeric', month: 'short', day: 'numeric' };
        this.createdAt = new Date().toLocaleDateString('en-us', options)
        this.score = 0
        this.replyingTo = replyingToUsername
        this.user = currentUser
    })
}

function retrieveCommentData(commentID){
    let returnComment = {}
    commentsData.comments.forEach(comment => {
        if(comment.id == commentID){
            returnComment = comment
        }
        if(comment.replies.length > 0){
            comment.replies.forEach(reply =>{
                if(reply.id == commentID){
                    returnComment = reply
                }
            })
        }
    })
    return returnComment
}

function updateCommentContent(commentID, newContent){
    commentsData.comments.forEach(comment => {
        if(comment.id == commentID){
            comment.content = newContent
            const options = {year: 'numeric', month: 'short', day: 'numeric' };
            comment.createdAt = new Date().toLocaleDateString('en-us', options)
        }else if(comment.replies.length > 0){
            comment.replies.forEach(reply => {
                if(reply.id == commentID){
                    reply.content = newContent
                    const options = {year: 'numeric', month: 'short', day: 'numeric' };
                    reply.createdAt = new Date().toLocaleDateString('en-us', options)
                }
            })
        }
    })
}

function deleteComment(commentID){
    const newArrayComments = commentsData.comments.filter(comment => {
        if(comment.id == commentID){
            return false
        }else if(comment.replies.length > 0){
            const newArrayReplies = comment.replies.filter(reply => {
                if(reply.id == commentID){
                    return false
                }else{
                    return true
                }
            })
            comment.replies = newArrayReplies
            return true
        }else{
            return true
        }
    })
    commentsData.comments = newArrayComments
    removeVotedComment(commentID)
}

function removeVotedComment(commentID){
    //Check if Comment ID is included in Upvoted Array and remove it
    if(commentsData.votedComments.upvoted_comments.length > 0){
        const newUpVotedList = commentsData.votedComments.upvoted_comments.filter(ID => {
            if(ID == commentID){
                return false
            }else{
                return true
            }
        })
        commentsData.votedComments.upvoted_comments = newUpVotedList
    }
    //Check if CommentID is included in Downvoted Array and remove it
    if(commentsData.votedComments.downvoted_comments.length > 0){
        const newDownVotedList = commentsData.votedComments.downvoted_comments.filter(ID => {
            if(ID == commentID){
                return false
            }else{
                return true
            }
        })
        commentsData.votedComments.downvoted_comments = newDownVotedList
    }
}

function upvoteComment(commentID){
    commentsData.comments.forEach(comment => {
        if(comment.id == commentID){
            comment.score++
            addUpvotedComment(commentID)
        }else if(comment.replies.length > 0){
            comment.replies.forEach(reply => {
                if(reply.id == commentID){
                    reply.score++
                    addUpvotedComment(commentID)
                }
            })
        }
    })
}

function downvoteComment(commentID){
    commentsData.comments.forEach(comment => {
        if(comment.id == commentID && comment.score > 0){
            comment.score--
            addDownvotedComment(commentID)
        }else if(comment.replies.length > 0){
            comment.replies.forEach(reply => {
                if(reply.id == commentID && reply.score > 0){
                    reply.score--
                    addDownvotedComment(commentID)
                }
            })
        }
    })
}

function addUpvotedComment(commentID){
    //Add Comment ID to Upvoted Array
    commentsData.votedComments.upvoted_comments.push(commentID)
    //Check if CommentID is included in Downvoted Array and remove it
    if(commentsData.votedComments.downvoted_comments.length > 0){
        const newDownVotedList = commentsData.votedComments.downvoted_comments.filter(ID => {
            if(ID == commentID){
                return false
            }else{
                return true
            }
        })
        commentsData.votedComments.downvoted_comments = newDownVotedList
    }
}

function addDownvotedComment(commentID){
    //Add Comment ID to Downvoted Array
    commentsData.votedComments.downvoted_comments.push(commentID)
    //Check if Comment ID is included in Upvoted Array and remove it
    if(commentsData.votedComments.upvoted_comments.length > 0){
        const newUpVotedList = commentsData.votedComments.upvoted_comments.filter(ID => {
            if(ID == commentID){
                return false
            }else{
                return true
            }
        })
        commentsData.votedComments.upvoted_comments = newUpVotedList
    }
}


function displayComments(){
    let comments = commentsData.comments
    comments.forEach(comment => {
        //Create Newcomment and add it to Main
        const newComment = createComment(comment)
        mainSection.appendChild(newComment)
        //Check if the comment has replies
        const commentReplies = comment.replies
        if(commentReplies.length > 0){
            const replyWrapper = document.createElement('div')
            replyWrapper.classList.add('reply-wrapper')
            commentReplies.forEach(reply => {
                const newReply = createComment(reply)
                //Add the replyto in the comment content
                const replyContent = newReply.querySelector('.comment-content')
                const getcurrentContent = replyContent.innerText
                replyContent.innerHTML = `<span class="replying-to">@${reply.replyingTo}</span> ${getcurrentContent}`
                //Add newreply to the replywrapper
                replyWrapper.appendChild(newReply)
            })
            //Add replywrapper to the Main
            mainSection.appendChild(replyWrapper)
        }
    })
    //Create Add Comment section
    const addCommentContainer = document.createElement('section')
    addCommentContainer.classList.add('add-comment-container')
    //Create Form Add Comment
    const formAddComment = document.createElement('form')
    formAddComment.classList.add('form-add-comment')
    //Create User image and add to the Form
    const formUserImage = document.createElement('img')
    formUserImage.src = currentUser.image.png
    formUserImage.classList.add('user-image')
    formAddComment.appendChild(formUserImage)
    //Create Text area and add to form
    const formTextArea = document.createElement('textarea')
    formTextArea.classList.add('txt-comment')
    formTextArea.name = "txt-add-comment"
    formTextArea.id = "txt-add-comment"
    formTextArea.cols = 10
    formTextArea.rows = 4
    formTextArea.placeholder = "Add a comment..."
    formAddComment.appendChild(formTextArea)
    //Create Send button and add to form
    const formBtnSend = document.createElement('button')
    formBtnSend.type = "submit"
    formBtnSend.classList.add('btn-send')
    formBtnSend.classList.add('blue-button')
    formBtnSend.innerText = "Send"
    formBtnSend.addEventListener('click', btnSendCommentClicked)
    formAddComment.appendChild(formBtnSend)
    //Add form to add comment section then add it to Main
    addCommentContainer.appendChild(formAddComment)
    mainSection.appendChild(addCommentContainer)
}

function createComment(comment){
    //Create Commentwrapper Div
    const commentWrapper = document.createElement('div')
    commentWrapper.classList.add('comment-wrapper')
    commentWrapper.dataset.comment_id = comment.id
    //Create Commentcontainer section
    const commentContainer = document.createElement('section')
    commentContainer.classList.add('comment-container')
    //Create User image and append to Commentcontainer
    const userImage = document.createElement('img')
    userImage.src = comment.user.image.png
    userImage.classList.add('user-image')
    commentContainer.appendChild(userImage)
    //Create Username and append to Commentcontainer
    const userName = document.createElement('p')
    userName.innerText = comment.user.username
    userName.classList.add('user-name')
    commentContainer.appendChild(userName)
    //Create Date Created and append to Commentcontainer
    const dateCreated = document.createElement('p')
    dateCreated.innerText = comment.createdAt
    dateCreated.classList.add('date-created')
    commentContainer.appendChild(dateCreated)
    //Create Comment content and append to Commentcontainer
    const commentContent = document.createElement('p')
    commentContent.innerText = comment.content
    commentContent.classList.add('comment-content')
    commentContainer.appendChild(commentContent)
    //Create Score section and append to Commentcontainer
    const scoreSection = document.createElement('div')
    scoreSection.classList.add('score-section')
    const btnUpvote = document.createElement('button')
    btnUpvote.classList.add('btn-upvote')
    btnUpvote.addEventListener('click', btnUpvoteClicked)
    scoreSection.appendChild(btnUpvote)
    const commentScore = document.createElement('p')
    commentScore.innerText = comment.score
    commentScore.classList.add('score')
    scoreSection.appendChild(commentScore)
    const btnDownvote = document.createElement('button')
    btnDownvote.classList.add('btn-downvote')
    btnDownvote.addEventListener('click', btnDownvoteClicked)
    scoreSection.appendChild(btnDownvote)
    commentContainer.appendChild(scoreSection)
    //Check if comment is from the current user or from another user
    if(comment.user.username === currentUser.username){
        //Add from-current-user class
        commentContainer.classList.add('from-current-user')
        //Add the word you in username
        userName.innerHTML = comment.user.username+' <span class="reply-you">you</span>'
        //Create Delete and Edit button and append to Commentcontainer
        const divDeleteEdit = document.createElement('div')
        divDeleteEdit.classList.add('btn-delete-edit')
        const btnDelete = document.createElement('button')
        btnDelete.classList.add('btn-delete')
        btnDelete.innerHTML = '<img src="./images/icon-delete.svg" alt="Delete icon">Delete'
        btnDelete.addEventListener('click', openModalDeleteComment)
        divDeleteEdit.appendChild(btnDelete)
        const btnEdit = document.createElement('button')
        btnEdit.classList.add('btn-edit')
        btnEdit.innerHTML = '<img src="./images/icon-edit.svg" alt="Edit icon">Edit'
        btnEdit.addEventListener('click', btnEditReplyClicked)
        divDeleteEdit.appendChild(btnEdit)
        commentContainer.appendChild(divDeleteEdit)
    }else{
        //Add from-other-user class
        commentContainer.classList.add('from-other-user')
        //Create Reply button and append to Commentcontainer
        const btnReply = document.createElement('button')
        btnReply.classList.add('btn-reply')
        btnReply.innerHTML = '<img src="./images/icon-reply.svg" alt="Reply icon">Reply'
        btnReply.addEventListener('click',btnReplyClicked)
        commentContainer.appendChild(btnReply)
    }
    commentWrapper.appendChild(commentContainer)
    return commentWrapper
}

function removeOtherReplyContainer(){
    const replyContainer = document.querySelector('.add-reply-container')
    if(replyContainer !== null){
        const btnReply = replyContainer.closest('.comment-wrapper').querySelector('.btn-reply')
        btnReply.disabled = false
        replyContainer.style.animation = "slide-out .3s ease"
        replyContainer.addEventListener('animationend', ()=>{
            replyContainer.remove()
        })
    }
}

function removeAddReplyContainer(button){
    //Get the CommentWrapper of the Button
    const commentWrapper = button.closest('.comment-wrapper')
    //Get the addReplyContainer and delete it
    const addReplyContainer = commentWrapper.querySelector('.add-reply-container')
    //Add Animation and wait for it to end before removing container
    addReplyContainer.style.animation = "slide-out .3s ease"
    addReplyContainer.addEventListener("animationend", ()=>{
        addReplyContainer.remove()
    })
    //Enable the Reply Button
    const btnReply = commentWrapper.querySelector('.btn-reply')
    btnReply.disabled = false
}

function openModalDeleteComment(event){
    //Get the CommentWrapper of the Button
    const commentWrapper = event.target.closest('.comment-wrapper')
    //Create the Modal Container
    const divModalBackground = document.createElement('div')
    divModalBackground.classList.add('modal-background')
    //Create the Modal Section and child elements
    const sectionModalDelete = document.createElement('section')
    sectionModalDelete.classList.add('modal-delete-comment')
    const modalh1 = document.createElement('h1')
    modalh1.innerText = "Delete Comment"
    sectionModalDelete.appendChild(modalh1)
    const modalp = document.createElement('p')
    modalp.innerText = "Are you sure you want to delete this comment? This will remove the comment and can't be undone."
    sectionModalDelete.appendChild(modalp)
    const btnModalCancel = document.createElement('button')
    btnModalCancel.classList.add('btn-modal-cancel')
    btnModalCancel.innerText = "No, cancel"
    btnModalCancel.addEventListener('click', closeModalDeleteComment)
    sectionModalDelete.appendChild(btnModalCancel)
    const btnModalDelete = document.createElement('button')
    btnModalDelete.classList.add('btn-modal-delete')
    btnModalDelete.innerText = "Yes, delete"
    btnModalDelete.dataset.comment_id = commentWrapper.dataset.comment_id
    btnModalDelete.addEventListener('click', btnModalDeleteClicked)
    sectionModalDelete.appendChild(btnModalDelete)
    //Add Modal Section to the Modal Container
    divModalBackground.appendChild(sectionModalDelete)
    //Add the Modal Container to the Body
    document.body.appendChild(divModalBackground)
    sectionModalDelete.scrollIntoView({behavior:'smooth',block:'center'})
}

function closeModalDeleteComment(){
    const modalDeleteComment = document.querySelector('.modal-background')
    modalDeleteComment.remove()
}

function updateCommentScore(commentID, commentWrapper){
    //Get Score element
    const commentScore = commentWrapper.querySelector(".score") 
    //Update Score value
    commentsData.comments.forEach(comment => {
        if(comment.id == commentID){
            commentScore.innerText = comment.score
        }else if(comment.replies.length>0){
            comment.replies.forEach(reply => {
                if(reply.id == commentID){
                    commentScore.innerText = reply.score
                }
            })
        }
    })
}


function btnSendCommentClicked(event){
    event.preventDefault()
    //Get the Comment Content
    const addCommentContainer = document.querySelector('.add-comment-container')
    const commentContent = addCommentContainer.querySelector("#txt-add-comment").value.trim()
    if(commentContent !== ""){
        //Add New Comment to Array
        newComment(commentContent)
        //Update Local Storage
        updateLocalCommentsData()
        //Reset Displayed Comments
        mainSection.innerHTML = ""
        displayComments()
    }else{
        addCommentContainer.querySelector("#txt-add-comment").focus()
    }
}

function btnReplyClicked(event){
    removeOtherReplyContainer()
    //Get the CommentWrapper of the Button
    const commentWrapper = event.target.closest('.comment-wrapper')
    //Create the Add Reply Section
    const addReplyContainer = document.createElement('section')
    addReplyContainer.classList.add('add-reply-container')
    //Create Form Add Reply
    const formAddReply = document.createElement('form')
    formAddReply.classList.add('form-add-reply')
    //Create User image and add to the Form
    const formUserImage = document.createElement('img')
    formUserImage.src = currentUser.image.png
    formUserImage.classList.add('user-image')
    formAddReply.appendChild(formUserImage)
    //Create Text area and add to form
    const formTextArea = document.createElement('textarea')
    formTextArea.classList.add('txt-comment')
    formTextArea.name = "txt-add-comment"
    formTextArea.id = "txt-add-comment"
    formTextArea.cols = 10
    formTextArea.rows = 4
    formTextArea.placeholder = "Add a comment..."
    formAddReply.appendChild(formTextArea)
    //Create Send button and add to form
    const formBtnSend = document.createElement('button')
    formBtnSend.type = "submit"
    formBtnSend.classList.add('btn-add-reply')
    formBtnSend.classList.add('blue-button')
    formBtnSend.innerText = "Reply"
    formBtnSend.addEventListener('click', btnSendReplyClicked)
    formAddReply.appendChild(formBtnSend)
    //Create Cancel button and add to form
    const formBtnCancel = document.createElement('button')
    formBtnCancel.classList.add('btn-cancel-reply')
    formBtnCancel.classList.add('blue-button')
    formBtnCancel.innerText = "Cancel"
    formBtnCancel.addEventListener('click', btnCancelReplyClicked)
    formAddReply.appendChild(formBtnCancel)
    //Add Form to Add Reply Section
    addReplyContainer.appendChild(formAddReply)
    //Add Animation to Reply Section
    addReplyContainer.style.animation = "slide-in .5s ease"
    //Add Section to Comment Wrapper
    commentWrapper.appendChild(addReplyContainer)
    //Disable the Reply Button
    event.target.disabled = true
    //Focus TextArea
    formTextArea.focus()
}

function btnCancelReplyClicked(event){
    event.preventDefault()
    removeAddReplyContainer(event.target)
}

function btnSendReplyClicked(event){
    event.preventDefault()
    //Get the CommentWrapper, Comment ID and Content 
    const commentWrapper = event.target.closest('.comment-wrapper')
    const replyContent = commentWrapper.querySelector('.txt-comment').value.trim()
    //Check if content is empty
    if(replyContent !== ""){
        addNewReply(commentWrapper.dataset.comment_id, replyContent)
        updateLocalCommentsData()
        removeAddReplyContainer(event.target)
    }else{
        commentWrapper.querySelector('.txt-comment').focus()
    }
    
}

function btnEditReplyClicked(event){
    //Get the CommentWrapper of the Button
    const commentWrapper = event.target.closest('.comment-wrapper')
    let commentData = retrieveCommentData(commentWrapper.dataset.comment_id)
    //Create Update User Comment section
    const updateCommentSection = document.createElement('section')
    updateCommentSection.classList.add('comment-container')
    updateCommentSection.classList.add('update-user-comment')
    //Create Form Update Comment
    const formUpdateComment = document.createElement('form')
    formUpdateComment.classList.add('form-update-comment')
    //Create User image and add to the Form
    const formUserImage = document.createElement('img')
    formUserImage.src = currentUser.image.png
    formUserImage.classList.add('user-image')
    formUpdateComment.appendChild(formUserImage)
    //Create Username and add to form
    const formUserName = document.createElement('p')
    formUserName.classList.add('user-name')
    formUserName.innerHTML = currentUser.username+' <span class="reply-you">you</span>'
    formUpdateComment.appendChild(formUserName)
    //Get Date Created and Add to Form
    const dateCreated = commentWrapper.querySelector('.date-created').innerText
    const formDateCreated = document.createElement('p')
    formDateCreated.classList.add('date-created')
    //Change this later!!!
    formDateCreated.innerText = dateCreated         
    formUpdateComment.appendChild(formDateCreated)
    //Create Score section and append to Commentcontainer
    const formScoreSection = document.createElement('div')
    formScoreSection.classList.add('score-section')
    const btnUpvote = document.createElement('button')
    btnUpvote.classList.add('btn-upvote')
    btnUpvote.disabled = true
    formScoreSection.appendChild(btnUpvote)
    const commentScore = document.createElement('p')
    commentScore.innerText = commentWrapper.querySelector('.score').innerText
    commentScore.classList.add('score')
    formScoreSection.appendChild(commentScore)
    const btnDownvote = document.createElement('button')
    btnDownvote.classList.add('btn-downvote')
    btnDownvote.disabled = true
    formScoreSection.appendChild(btnDownvote)
    formUpdateComment.appendChild(formScoreSection)
    //Create Text area and add to form
    const formTextArea = document.createElement('textarea')
    formTextArea.classList.add('txt-update')
    formTextArea.name = "txt-update-comment"
    formTextArea.id = "txt-update-comment"
    formTextArea.cols = 10
    formTextArea.rows = 4
    formTextArea.placeholder = "Add a comment..."
    formTextArea.value = commentData.content
    formUpdateComment.appendChild(formTextArea)
    //Create Update button and add to form
    const formBtnUpdate = document.createElement('button')
    formBtnUpdate.type = "submit"
    formBtnUpdate.classList.add('btn-update')
    formBtnUpdate.classList.add('blue-button')
    formBtnUpdate.innerText = "Update"
    formBtnUpdate.addEventListener('click', btnUpdateCommentClicked)
    formUpdateComment.appendChild(formBtnUpdate)
    //Add the form to the Update Comment Section
    updateCommentSection.appendChild(formUpdateComment)
    //Add the Update Comment Section to the form
    commentWrapper.appendChild(updateCommentSection)
    //Hide the From Current User Section
    const fromCurrentUser = commentWrapper.querySelector('.from-current-user')
    fromCurrentUser.style.display = "none"
    //Focus TextArea
    formTextArea.focus()
}

function btnUpdateCommentClicked(event){
    event.preventDefault()
    //Get the CommentWrapper of the Button
    const commentWrapper = event.target.closest('.comment-wrapper')
    const commentContent = commentWrapper.querySelector('#txt-update-comment').value.trim()
    //Check if content is empty
    if(commentContent !== ""){
        //Update Selected Comment
        updateCommentContent(commentWrapper.dataset.comment_id, commentContent)
        //Update Local Storage
        updateLocalCommentsData()
        //Reset Displayed Comments
        mainSection.innerHTML = ""
        displayComments()
    }else{
        commentWrapper.querySelector('#txt-update-comment').focus()
    }
}

function btnModalDeleteClicked(event){
    deleteComment(event.target.dataset.comment_id)
    updateLocalCommentsData()
    closeModalDeleteComment()
    mainSection.innerHTML = ""
    displayComments()
}

function btnUpvoteClicked(event){
    //Get the CommentWrapper and Comment ID
    const commentWrapper = event.target.closest('.comment-wrapper')
    const commentID = parseInt(commentWrapper.dataset.comment_id) 
    //Check if user has already upvoted the comment
    if(commentsData.votedComments.upvoted_comments.length > 0){
        if(!commentsData.votedComments.upvoted_comments.includes(commentID)){
            upvoteComment(commentID)
            updateLocalCommentsData()
            updateCommentScore(commentID, commentWrapper)
        }
    }else{
        upvoteComment(commentID)
        updateLocalCommentsData()
        updateCommentScore(commentID, commentWrapper)
    }
}

function btnDownvoteClicked(event){
    //Get the CommentWrapper and Comment ID
    const commentWrapper = event.target.closest('.comment-wrapper')
    const commentID = parseInt(commentWrapper.dataset.comment_id) 
    //Check if user has already downvoted the comment
    if(commentsData.votedComments.downvoted_comments.length > 0){
        if(!commentsData.votedComments.downvoted_comments.includes(commentID)){
            downvoteComment(commentID)
            updateLocalCommentsData()
            updateCommentScore(commentID, commentWrapper)
        }
    }else{
        downvoteComment(commentID)
        updateLocalCommentsData()
        updateCommentScore(commentID, commentWrapper)
    }
}



 


































