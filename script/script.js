
//Import data from JSON file
import data from './data.json' assert { type: 'json' };

//SELECTORS
let currentUser = data.currentUser
const mainSection = document.getElementsByTagName('main')[0]

displayComments()

//FUNCTIONS
function displayComments(){
    let comments = data.comments
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
    formAddComment.appendChild(formBtnSend)
    //Add form to add comment section then add it to Main
    addCommentContainer.appendChild(formAddComment)
    mainSection.appendChild(addCommentContainer)
}

function createComment(comment){
    //Create Commentwrapper Div
    const commentWrapper = document.createElement('div')
    commentWrapper.classList.add('comment-wrapper')
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
    scoreSection.appendChild(btnUpvote)
    const commentScore = document.createElement('p')
    commentScore.innerText = comment.score
    commentScore.classList.add('score')
    scoreSection.appendChild(commentScore)
    const btnDownvote = document.createElement('button')
    btnDownvote.classList.add('btn-downvote')
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
        btnDelete.innerHTML = '<img src="./styles/images/icon-delete.svg" alt="Delete icon">Delete'
        divDeleteEdit.appendChild(btnDelete)
        const btnEdit = document.createElement('button')
        btnEdit.classList.add('btn-edit')
        btnEdit.innerHTML = '<img src="./styles/images/icon-edit.svg" alt="Edit icon">Edit'
        btnEdit.addEventListener('click', btnEditReplyClicked)
        divDeleteEdit.appendChild(btnEdit)
        commentContainer.appendChild(divDeleteEdit)
    }else{
        //Add from-other-user class
        commentContainer.classList.add('from-other-user')
        //Create Reply button and append to Commentcontainer
        const btnReply = document.createElement('button')
        btnReply.classList.add('btn-reply')
        btnReply.innerHTML = '<img src="./styles/images/icon-reply.svg" alt="Reply icon">Reply'
        btnReply.addEventListener('click',btnReplyClicked)
        commentContainer.appendChild(btnReply)
    }
    commentWrapper.appendChild(commentContainer)
    return commentWrapper
}

function btnReplyClicked(event){
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
    //Add Section to Comment Wrapper
    commentWrapper.appendChild(addReplyContainer)
    //Disable the Reply Button
    event.target.disabled = true
}

function btnCancelReplyClicked(event){
    event.preventDefault()
    removeAddReplyContainer(event.target)
    /*
    //Get the CommentWrapper of the Button
    const commentWrapper = event.target.closest('.comment-wrapper')
    //Get the addReplyContainer and delete it
    const addReplyContainer = commentWrapper.querySelector('.add-reply-container')
    addReplyContainer.remove()
    //Enable the Reply Button
    const btnReply = commentWrapper.querySelector('.btn-reply')
    btnReply.disabled = false*/
}

function btnSendReplyClicked(event){
    event.preventDefault()
    removeAddReplyContainer(event.target)
}

function removeAddReplyContainer(button){
    //Get the CommentWrapper of the Button
    const commentWrapper = button.closest('.comment-wrapper')
    //Get the addReplyContainer and delete it
    const addReplyContainer = commentWrapper.querySelector('.add-reply-container')
    addReplyContainer.remove()
    //Enable the Reply Button
    const btnReply = commentWrapper.querySelector('.btn-reply')
    btnReply.disabled = false
}

function btnEditReplyClicked(event){
    //Get the CommentWrapper of the Button
    const commentWrapper = event.target.closest('.comment-wrapper')
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
    formScoreSection.appendChild(btnUpvote)
    const commentScore = document.createElement('p')
    commentScore.innerText = commentWrapper.querySelector('.score').innerText
    commentScore.classList.add('score')
    formScoreSection.appendChild(commentScore)
    const btnDownvote = document.createElement('button')
    btnDownvote.classList.add('btn-downvote')
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
}

function btnUpdateCommentClicked(event){
    event.preventDefault()
    //Get the CommentWrapper of the Button
    const commentWrapper = event.target.closest('.comment-wrapper')
    //Remove the Update Comment Section
    const UpdateCommentSection = commentWrapper.querySelector('.update-user-comment')
    UpdateCommentSection.remove()
    //Display back the From current User section
    const fromCurrentUser = commentWrapper.querySelector('.from-current-user')
    fromCurrentUser.style.display = "grid"
}



//EVENT LISTENERS

/*const btnReply = document.querySelectorAll('.btn-reply')
btnReply.forEach(button => {
    //console.log(button)
    button.addEventListener('click', btnReplyClicked)
})*/

/*const btnCancelReply = document.querySelectorAll('.btn-cancel-reply')
btnCancelReply.forEach(button => {
    console.log(button)
})*/

