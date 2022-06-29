exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [ 
            {
                _id: "1",
                title: "Smokies", 
                content: "Here is the message",
                imageUrl: "images/roomHouse.jpg",
                creator: {
                    name: "Douglas",
                },
                createdAt: new Date()    
            }
        ]
    })
}
// 
// feed/post
exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    // craete post in db

    res.status(201).json({
        message: "Post created successfully",
        post: {
                _id: new Date().toISOString(), 
                title: title, 
                content: content,
                creator: {name : "douglas"},
                createdAt: new Date()
            }
    })
}

