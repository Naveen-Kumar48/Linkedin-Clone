import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";




//*create post 

export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token })
    if (!user) return res.status(404).json({ message: "User not found" });
    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[0] : ""
    })
    await post.save()
    return res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }


}
//* get all post 
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId","name username email profilePicture")
    return res.status(200).json({ posts })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}


//*Delete post

export const deletePost = async (req, res) => {
  const { token ,post_id } = req.body;
  try {
    const user = await User.findOne({ token }).select('_id');

    if (!user) return res.status(404).json({ message: "User not found" });
    const post = await Post.findById(post_id);
    if(!post) return res.status(404).json({ message: "Post not found" });
    if(post.userId.toString() !== user._id.toString()) return res.status(401).json({ message: "Unauthorized" });
    await Post.deletePost({
      _id:post_id 
    })
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

//*api to comment on post
export const commentPost=async(req,res)=>{
  const {token,post_id,commentBody}=req.body;
  try {
    const user=await User.findOne({token:token}).select('_id');

    if(!user) return res.status(404).json({ message: "User not found" });

    const post=await Post.findOne({_id:post_id});

    if(!post) return res.status(404).json({ message: "Post not found" });


    const comment=new CommentBody({ 
      userId:user._id,
      post_Id:post_id,
      comment:commentBody
    })
    await comment.save();

    return res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
} 

//*Get comments by post 

export const getCommentsByPost=async(req,res)=>{
  const {post_id}=req.body;

  try {
  const   post=await Post.findOne({_id:post_id});

  if(!post) return res.status(404).json({ message: "Post not found" });

  return res.status(200).json({ comments:post.comments });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}


//*Delete comments of user

export const delete_comment_of_user=async(req,res)=>{
  const {token,comment_id}=req.body;
  try {
    
const user=await User.findOne({token:token}).select('_id')
if(!user)return res.status(404).json({message:"User not found"})

const comment=await Comment.findOne({"_id":comment_id

})
if(!comment) return  res.status(404).json({
  message:"Comment not found "
})

if(comment.userId.toString()!==user._id.toString()){
  return res.status(401).json({
    message:"Unauthorized Access"
  })
}
await Comment.deleteOne({
  "_id":comment_id
})
return res.json({message:"Comment deleted Succesfully "})
  } catch (err) {
    return res.status(500).json({message:err.message})
  }

}

//* LIKES INCREMENT 

export const increment_likes=async (req,res)=>{
  const  {post_id}=req.body;
try {
  
  const post = await Post .findOne({
    _id:post_id
  })
  if(!post){
    return res.status(404).json({message:"Post not found"})
  }
  post.likes=post.likes+1;
  await post.save();
  return res.status(200).json({message:"Like added successfully"})
} catch (error) {
  return res.status(500).json({ message: error.message });
}

}