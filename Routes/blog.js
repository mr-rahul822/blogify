const express = require("express")
const router = express.Router();
const auth   = require("../middleware/auth");
const CheckBlogOwnership =require("../middleware/auth");
const USERBLOGS = require("../Models/blogdatabase");


// Optional: Create a route to show all blogs
router.get("/all-blogs", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Fetch all published blogs with pagination
        const blogs = await USERBLOGS.find({ 
            published: true,
            status: 'published'
        })
        .populate('author', 'name username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalBlogs = await USERBLOGS.countDocuments({ 
            published: true,
            status: 'published' 
        });
        
        const totalPages = Math.ceil(totalBlogs / limit);

        res.render("all-blogs", {
            title: "All Blogs - Blogify",
            blogs: blogs,
            currentPage: page,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1
        });
    } catch (error) {
        console.error("Error fetching all blogs:", error);
        res.render("all-blogs", {
            title: "All Blogs - Blogify",
            blogs: [],
            currentPage: 1,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false
        });
    }
}); 


// Public blog detail route (for non-authenticated users)
router.get("/blog/:slug", async (req, res) => {
    try {
        // Find and increment views for published blog
        const blog = await USERBLOGS.findOneAndUpdate(
            { slug: req.params.slug, published: true },
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'name username');

        if (!blog) {
            return res.status(404).render("404", {
                title: "Blog Not Found",
                message: "The blog post you are looking for does not exist.",
            });
        }

        // Fetch related blogs (exclude current blog)
        const relatedBlogs = await USERBLOGS.find({
            _id: { $ne: blog._id },
            published: true,
        })
        .populate('author', 'name username')
        .sort({ createdAt: -1 })
        .limit(5);

        // Render the detail view
        return res.render("blog-detail", {
            title: blog.title,
            blog: blog,
            relatedBlogs: relatedBlogs,
            isPreview: false,
            user: req.user || null // Allow both authenticated and non-authenticated users
        });
    } catch (error) {
        console.error("Error fetching blog:", error.message);
        return res.status(500).render("error", {
            message: "Server error",
            status: 500,
        });
    }
});

router.get("/blog",auth,CheckBlogOwnership,(req,res)=>{
    return res.render("blog")
})

router.get("/add-blog",auth,CheckBlogOwnership, (req,res)=>{
    return res.render("add-blog")
})


// Blog Detail Route by Slug
router.get("/blog/:slug", auth,CheckBlogOwnership , async (req, res) => {
  try {
    // Find and increment views for published blog
    const blog = await USERBLOGS.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).render("404", {
        title: "Blog Not Found",
        message: "The blog post you are looking for does not exist.",
      });
    }

    // Fetch related blogs (exclude current blog)
    const relatedBlogs = await USERBLOGS.find({
      _id: { $ne: blog._id },
      published: true,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Render the detail view
    return res.render("blog-detail", {
      title: blog.title,
      blog: blog,
      relatedBlogs: relatedBlogs,
      isPreview: false,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching blog:", error.message);
    return res.status(500).render("error", {
      message: "Server error",
      status: 500,
    });
  }
});

router.delete('/delete-blog/:id',auth,CheckBlogOwnership, async (req,res)=>{
    try{
            const blog = req.params.id
            console.log(blog)
            if(!blog){
                return res.status(404).render("404")
            }       
            

            const blogid = await USERBLOGS.findByIdAndDelete(blog)
            console.log(blogid)

            if(!blogid){
                 return res.status(404).render("404");
            }


            res.json(  {
            success: true,
            message: 'Blog deleted successfully',
            data : blogid })


    }catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting blog'
        });
    }
})


// Edit Blog Route (GET - Show edit form)
router.get('/edit-blog/:id', auth,CheckBlogOwnership, async (req, res) => {
  try {
    const blogId = req.params.id;
    
    // Fetch blog from database using USERBLOGS model
    const blog = await USERBLOGS.findById(blogId);
    
    if (!blog) {
      return res.status(404).render('404', {
        title: "Blog Not Found",
        message: 'The blog you are trying to edit does not exist.',
      });
    }

    // Optional: Check if user owns this blog
    // if (blog.author !== req.user.id) {
    //   return res.status(403).render('error', {
    //     message: 'Unauthorized - You can only edit your own blogs',
    //     status: 403
    //   });
    // }

    res.render('edit-blog', {
      blog,
      title: `Edit: ${blog.title}`,
      user: req.user,
    });
  } catch (error) {
    console.error('Edit page error:', error);
    res.status(500).render('error', {
      message: 'Server error',
      status: 500,
    });
  }
});

// Update Blog Route (POST - Handle edit form submission)
router.post('/edit-blog/:id', auth,CheckBlogOwnership, async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content, expert, category, tags, published } = req.body;

    // Update blog in database using USERBLOGS model
    const updatedBlog = await USERBLOGS.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        expert,
        category,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        published: published === 'on',
        status: published === 'on' ? 'published' : 'draft',
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).render('404', {
        title: "Blog Not Found",
        message: 'The blog you are trying to update does not exist.',
      });
    }

    console.log('Blog updated successfully:', updatedBlog._id);

    // Redirect based on published status
    if (published === 'on') {
      res.redirect(`/user/blog/preview/${blogId}`);
    } else {
      res.redirect('/user/see-blog');
    }
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).render('error', {
      message: 'Error updating blog',
      status: 500,
    });
  }
});



// Preview Blog Route - FIXED: Now uses actual database data
router.get('/blog/preview/:id', auth,CheckBlogOwnership, async (req, res) => {
  try {
    const blogId = req.params.id;
    
    // Fetch ACTUAL blog from database using USERBLOGS model
    const blog = await USERBLOGS.findById(blogId);
    
    if (!blog) {
      return res.status(404).render('404', {
        title: "Blog Not Found",
        message: 'The blog preview you are looking for does not exist.',
      });
    }

    // Optional: Check if user owns this blog
    // if (blog.author !== req.user.id) {
    //   return res.status(403).render('error', {
    //     message: 'Unauthorized',
    //     status: 403
    //   });
    // }

    // Fetch related blogs for preview context
    const relatedBlogs = await USERBLOGS.find({
      _id: { $ne: blog._id },
      published: true,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('blog-detail', { // Using same template as public view
      title: `Preview: ${blog.title}`,
      blog: blog,
      relatedBlogs: relatedBlogs,
      isPreview: true, // Flag to show "Preview Mode" indicator
      user: req.user,
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).render('error', {
      message: 'Server error',
      status: 500,
    });
  }
});


// See Blog Route - Enhanced with better error handling
router.get("/see-blog", auth,CheckBlogOwnership, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Filter by user if needed (assuming blogs belong to logged-in user)
    // const query = {}; 
     const query = { author: req.user._id };// Add { author: req.user.id } if you want user-specific blogs

    const blogs = await USERBLOGS.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await USERBLOGS.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    // Calculate published and draft counts
    const publishedBlogs = blogs.filter(
      (blog) => blog.published === true || blog.status === "published"
    ).length;

    const draftBlogs = blogs.filter(
      (blog) => blog.published === false || blog.status === "draft"
    ).length;

    // Get recent blogs for sidebar/related section
    const relatedBlogs = await USERBLOGS.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate total views across all blogs
    const viewsAggregation = await USERBLOGS.aggregate([
      { $match: query }, // Apply same filter as main query
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const totalViews =
      viewsAggregation.length > 0 ? viewsAggregation[0].totalViews : 0;

    return res.render("see-blog", {
      title: "My Blogs",
      blogs,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews,
      relatedBlogs,
      user: req.user,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err.message);

    // Always pass fallback values to avoid EJS crashes
    return res.render("see-blog", {
      title: "My Blogs",
      blogs: [],
      currentPage: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: 1,
      prevPage: 1,
      totalBlogs: 0,
      publishedBlogs: 0,
      draftBlogs: 0,
      totalViews: 0,
      relatedBlogs: [],
      user: req.user,
    });
  }
});

router.post("/add-blog",auth,CheckBlogOwnership,async (req,res)=>{
    const {title, author ,date, expert,content,image,slug,published }= req.body


     const blogSlug = slug || title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');  

    await USERBLOGS.create({
        title,
        author :req.user._id,
        date,
        expert,
        content,
        image,
        slug :blogSlug,
        published
    })

    return res.redirect("/user/see-blog")

})

module.exports = router 