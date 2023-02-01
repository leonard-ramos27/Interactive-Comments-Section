
import data from './data.json' assert { type: 'json' };
//console.log(data);
let currentUser = data.currentUser
//console.log(currentUser)
const testSection = document.querySelector('.test-section')

data.comments.forEach(comment => {
    //console.log(comment)
    if(comment.replies.length > 0){
        //console.log('Here are the replies')
        comment.replies.forEach(reply => {
            //console.log(reply)
        })
    }
})

function displayComments(){
    let comments = data.comments
    comments.forEach(comment => {
        //Create Newcomment and add it to testSection
        const newComment = createComment(comment)
        testSection.appendChild(newComment)
        //Check if the comment has replies
        const commentReplies = comment.replies
        if(commentReplies.length > 0){
            const replyWrapper = document.createElement('div')
            replyWrapper.classList.add('reply-wrapper')
            commentReplies.forEach(reply => {
                //const newReply = createReplies(reply)
                const newReply = createComment(reply)
                //Add the replyto in the comment content
                const replyContent = newReply.querySelector('.comment-content')
                const getcurrentContent = replyContent.innerText
                replyContent.innerHTML = `<span class="replying-to">@${reply.replyingTo}</span> ${getcurrentContent}`
                //Add newreply to the replywrapper
                replyWrapper.appendChild(newReply)
            })
            //Add replywrapper to the test section
            testSection.appendChild(replyWrapper)
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
    //formUserImage.src = "../styles/"+currentUser.image.png
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
    //Add form to add comment section then add it to test section
    addCommentContainer.appendChild(formAddComment)
    testSection.appendChild(addCommentContainer)
}

function createReplies(reply){
    //Create Commentwrapper Div
    const commentWrapper = document.createElement('div')
    commentWrapper.classList.add('comment-wrapper')
    //Create Commentcontainer section
    const commentContainer = document.createElement('section')
    commentContainer.classList.add('comment-container')
    //Create User image and append to Commentcontainer
    const userImage = document.createElement('img')
    userImage.src = "../styles/"+reply.user.image.png
    userImage.classList.add('user-image')
    commentContainer.appendChild(userImage)
    //Create Username and append to Commentcontainer
    const userName = document.createElement('p')
    userName.innerText = reply.user.username
    userName.classList.add('user-name')
    commentContainer.appendChild(userName)
    //Create Date Created and append to Commentcontainer
    const dateCreated = document.createElement('p')
    dateCreated.innerText = reply.createdAt
    dateCreated.classList.add('date-created')
    commentContainer.appendChild(dateCreated)
    //Create Comment content and append to Commentcontainer
    const commentContent = document.createElement('p')
    commentContent.innerText = reply.content
    commentContent.classList.add('comment-content')
    commentContainer.appendChild(commentContent)
    //Create Score section and append to Commentcontainer
    const scoreSection = document.createElement('div')
    scoreSection.classList.add('score-section')
    const btnUpvote = document.createElement('button')
    btnUpvote.classList.add('btn-upvote')
    scoreSection.appendChild(btnUpvote)
    const commentScore = document.createElement('p')
    commentScore.innerText = reply.score
    commentScore.classList.add('score')
    scoreSection.appendChild(commentScore)
    const btnDownvote = document.createElement('button')
    btnDownvote.classList.add('btn-downvote')
    scoreSection.appendChild(btnDownvote)
    commentContainer.appendChild(scoreSection)
    //Check if comment is from the current user or from another user
    if(reply.user.username === currentUser.username){
        console.log('Comment is from current user')
        //Add from-current-user class
        commentContainer.classList.add('from-current-user')
        //Add the word you in username
        userName.innerHTML = reply.user.username+' <span class="reply-you">you</span>'
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
        divDeleteEdit.appendChild(btnEdit)
        commentContainer.appendChild(divDeleteEdit)
    }else{
        console.log('Comment is not from user')
        commentContainer.classList.add('from-other-user')
        //Create Reply button and append to Commentcontainer
        const btnReply = document.createElement('button')
        btnReply.classList.add('btn-reply')
        btnReply.innerHTML = '<img src="./styles/images/icon-reply.svg" alt="Reply icon">Reply'
        commentContainer.appendChild(btnReply)
    }
    commentWrapper.appendChild(commentContainer)
    return commentWrapper
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
    //userImage.src = "../styles/"+comment.user.image.png
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
        console.log('Comment is from current user')
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
        divDeleteEdit.appendChild(btnEdit)
        commentContainer.appendChild(divDeleteEdit)
    }else{
        console.log('Comment is not from user')
        commentContainer.classList.add('from-other-user')
        //Create Reply button and append to Commentcontainer
        const btnReply = document.createElement('button')
        btnReply.classList.add('btn-reply')
        btnReply.innerHTML = '<img src="./styles/images/icon-reply.svg" alt="Reply icon">Reply'
        commentContainer.appendChild(btnReply)
    }
    commentWrapper.appendChild(commentContainer)
    return commentWrapper
}

displayComments()


