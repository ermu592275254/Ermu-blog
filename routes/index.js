var express = require('express');
var crypto=require('crypto');
var markdown= require('markdown').markdown;
var marked = require('marked');
var fs = require('fs');
var highlight = require('highlight.js');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});
var userModel = require('../models/user.js');
var postModel = require('../models/post.js');
var commentModel = require('../models/comment.js');
var pageQuery = require('../models/pageQuery.js');

//function checkLogin(req, res, next){
//    if(!req.session.user){
//        req.flash('error','请登录');
//        return res.redirect('/login');
//    }
//    next();
//}
module.exports =function(app){
	//app.get('/',function(req,res){
	//	res.render('index',{});
	//});
	// kp 后端的接口都可以写在这里
	/*******************************登录、注册接口**************************/
	// todo 修改密码，忘记密码，邮箱验证通过发送验证码到邮箱来验证
	app.post('/login',function(req,res){
		var params = req.body;
		userModel.findOne({name: params.name}, function(err,user) {
			if(err || user === null){
				res.send({code:0,message:'用户不存在 '});
				return;
			}
			params.password = crypto.createHash('md5').update(params.password).digest('base64');//密码加密
			if(user.password !== params.password){
				res.send({code:0,message:'密码错误！请输入正确的用户密码。'});
				return;
			}
			if(params.remember){
				req.session.user = user;//将用户信息存入session
				console.log(req.session.user);
			}
			res.send(user);
		});
	});
	app.post('/register',function(req,res){
		var params = req.body;
		userModel.findOne({name: params.name}, function(err, user){ // 判断用户名是否存在
			if(err){
				res.send(err);
				return;
			}
			if(user && user.name === params.name){
				res.send({code:0,message:'用户名已存在！'});
				return;
			}
			userModel.findOne({email: params.email}, function(err,user) { //邮箱是否被注册
				if(err){
					res.send(err);
					return;
				}
				if(user && user.email === params.email){
					res.send({code:0,message:'邮箱已被注册！'});
					return;
				}
				var newUser = {
					name: params.name,
					password: crypto.createHash('md5').update(params.password).digest('base64'),//md5加密密码
					email: params.email
				};
				userModel.create(newUser,function(err,user){ // 存进数据库
					if(err){res.send(err);return;}
					req.session.user = user;//将用户信息存入session
					res.send(user);
				})
			});
		})
	});
	/**-**************************** 文章的接口 ************************/
	app.get('/getData', function(req,res){ //获取所有文章  按发布时间倒序
        postModel.find().sort({'_id': -1}).exec(function(err,posts){
            if(err){
                res.send(err);
                return;
            }
            res.send(posts);
        });
	});
    app.post('/getArticleByPage',function(req,res){
        var page = req.body.page?req.body.page: 1,
            pageSize = req.body.pageSize?req.body.pageSize:10;
        pageQuery.pageQuery(page, pageSize, postModel, '', {}, {
            time: 'desc'
        }, function(error, data){
            if(error){
                next(error);
            }else{
                res.send(data)
            }
        });
    });
	app.post('/getArticleByUser', function(req,res){ //获取指定用户所有的文章
		postModel.find(req.body.username, function(err,posts){
			if(err){
				res.send(err);
				return;
			}
			res.send(posts)
		})
	});
	app.post('/getArticle', function(req,res){ //获取指定的一篇文章，增加阅读数
		//res.send('is OK');
		postModel.findById(req.body.id, function(err,post){ //接收的参数必须为_id,一个字符串
			if(err){
				res.send(err);
				return
			}
			if(post.readNum) {
				post.readNum += 1;
			}else{
				post.readNum = 1;
			}
			postModel.update({_id:req.body.id},{readNum: post.readNum},function(err,massage){ //阅读数+1
				if(err){
					console.log(err);
					return;
				}
				postModel.findById(req.body.id,function(err, newPost){ //重新取得新的数据
                    if(req.body.isEdit){
                        res.send(newPost);
                        return;
                    }
					newPost.post = marked(newPost.post);
					res.send(newPost);
				});
			});
		})
	});
	app.post('/postArticle', function(req,res){ //发表文章
        var params = req.body;
        params.time = new Date();
		params.readNum = 0;
		params.goodNum = 0;
        console.log(params);
		postModel.create(params,function(err){
			if(err){
				res.send(err);
				return;
			}
			res.send({isSuccess: true});
		});
	});
	app.post('/delArticle', function(req,res){
		var params = req.body;
		// kp 文章的ID，用户的ID； 通过文章ID查出作者名，对比作者名和用户名
		postModel.findById(params.articleId,function(err,article){
			if(err){
				res.send(err);
				return;
			}
			if(article.author === params.userName){
				postModel.remove({_id: params.articleId},function(err,message){
					if(err){
                        res.send({ok: 0,message:'删除文章失败！'});
						return
					}
                    commentModel.remove({article_id: article._id},function(err,message){
                        if(err){
                            res.send({ok: 0,message:'删除评论失败！'});
                            return
                        }
                        res.send(message);
                    });
				})
			} else {
				res.send({ok:0,message:'你不是这篇文章的作者！'})
			}
		});
	});
    app.post('/editArticle',function(req,res){
        var params = req.body;
        // kp 文章对象，用户的ID； 通过文章ID查出作者名，对比作者名和用户名
        postModel.findById(params.article._id,function(err,article){
            if(err){
                res.send({ok:0,message:'查询文章失败'});
                return;
            }
            if(article.author === params.userName){
                postModel.update(article,params.article,function(err,message){
                    if(err){
                        res.send({ok:0,message:'更新文章失败'});
                        return
                    }
                    res.send(message);
                })
            } else {
                res.send({ok:0,message:'你不是这篇文章的作者！'})
            }
        });
    });
	/************************************评论***************************/
    app.post('/addComment',function(req,res) {
        var params = req.body;
		params.comment_num = 0;
		params.likeCount = 0;
        params.created_time = new Date();
        commentModel.create(params, function(err,comment){
            if(err){
                console.log(err);
                return
            }
			console.log(comment);
            res.send({code:1,message:'发表评论成功'});
        });
    });
	app.post('/getComment',function(req,res){
		commentModel.find(req.body, function(err,comments){
			if(err){
				res.send(err);
				return;
			}
			if(!comments){
				res.send({code: 0,message:'查询失败!'});
				return
			}
			res.send(comments);
		})
	});
    app.post('/delComment',function(req,res){
        commentModel.remove({_id: req.body.comment_id},function(err,comment){
            if(err){
                console(err);
                return
            }
            res.send({code: 1,message:'删除评论成功'});
        });
    });

	/****************************测试上传******************************/
	app.post('/upload', function(req,res){
		// 放在public下面的Image里面的articleImg文件夹下面
		var tmp_path = req.files.imagefile.path;
		var name = new Date();
		var type = req.files.imagefile.mimetype.split('/')[1];
		var sendPath = 'images/articleImg/' +name.getTime().toString()+'.'+type;
		var targe_path = './public/' + sendPath;
		//更改文件的路径
		fs.rename(tmp_path,targe_path,function(err){
			if(err){
				console.log(err);
				return
			}
				//删除原来的文件
				fs.unlink(tmp_path, function() {
					if(err){
						console.log(err);
						return
					}
				res.send({code: 1 ,message: '文件上传成功，路径为：'+sendPath});
			});
		})
	});
    app.get('/upload', function(req,res){
        res.render('uploadyd',{});
    });
	/*
	app.get('/blog',function(req,res) {
		res.render('index',{});
	});
	app.get('/test',function(req,res){
		Post.getFive(function(err,posts){
			 if(err){
	            posts = [];
	        }
	         res.render('test',{
	            title:'Home',
	            user: req.session.user,
	            posts:posts,
	            success:req.flash('success').toString()
	        });
		});
	});
	app.get('/list',function(req,res){
        Post.getAll(null, function(err, posts){
	        if(err){
	            posts = [];
	        }
	        res.render('list',{
	            title:'Home',
	            user: req.session.user,
	            posts:posts,
	            success:req.flash('success').toString()
	        });
    	});
	});
	app.get('/login', function(req, res){
	    res.render('login',{
	        title:'登录',
	        user:req.session.user,
	        success:req.flash('success').toString(),
	        error:req.flash('error').toString()
	    });
 	});
	app.post('/login', function(req, res){
	    var md5 = crypto.createHash('md5'),
	        password = md5.update(req.body.password).digest('base64');
	    User.get(req.body.username, function(err, user){
	        if(!user){
	            req.flash('error', '用户不存在');
	            return res.redirect('/login');
	        }
	        if(user.password != password){
	            req.flash('error', '密码错误');
	            return res.redirect('/login');
	        }
	        req.session.user = user;
	        req.flash('success','登陆成功');
	        res.redirect('/');
	    });
	});
	app.get('/reg', function(req,res){
	    res.render('reg',{
	        title:'注册',
	        user:req.session.user,
	        success:req.flash('success').toString(),
	        error:req.flash('error').toString()
	    });
	});
	app.post('/reg', function(req,res){
	    if(req.body['password-repeat'] != req.body['password']){
	    	console.log(req.body['password-repeat']);
	        req.flash('error','两次输入的密码不一致');
	        return res.redirect('/reg');
	    }
	    var md5 = crypto.createHash('md5');
	    var password = md5.update(req.body.password).digest('base64');
	    var newUser = new User({
	        name: req.body.username,
	        password: password,
	    });
	    User.get(newUser.name, function(err, user){
	        if(user){
	            err = '用户已存在';
	        }
	        if(err){
	            req.flash('error', err);
	            return res.redirect('/reg');
	        }
	        newUser.save(function(err){
	            if(err){
	                req.flash('error',err);
	                return res.redirect('/reg');
	            }
	            req.session.user = newUser;
	            req.flash('success','注册成功');
	            res.redirect('/');
	        });
	    });
	 });
	app.get('/post', function(req, res){
    		res.render('post',{
    		       title:'Post',
    		       user:req.session.user,
    		       success:req.flash('success').toString(),
    		       error:req.flash('error').toString()
    		   });
    	});
    app.post('/post', function(req, res){
		var currentUser = req.session.user,
		    post = new Post(currentUser.name, req.body.title,req.body.tags,req.body.post);
		   post.save(function(err){
		       if(err){
		           req.flash('error', err);
		           return res.redirect('/');
		       }
		       req.flash('success', '发布成功!');
		       res.redirect('/'+req.session.user['name']);
		   });
	});
	app.get('/:user/:time/:title', function(req,res){
	    User.get(req.params.user,function(err, user){
	        Post.getOne(req.params.user, req.params.time, req.params.title, function(err, post){//还记得post.js里面获取文章的函数吧？
	            if(err){
	                req.flash('err',err);
	                return res.redirect('/');
	            }
	            res.render('article',{
	                title: req.params.title,
	                post: post,
	                user: req.session.user,
	                success: req.flash('success').toString(),
	                error: req.flash('error').toString()
	            });
	        });
	    });
	});
	app.post('/:user/:time/:title', function(req,res){
	    var comment = null,
	        date = new Date(),
	        time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
	    if(req.session.user){
	        var name=req.session.user.name;
	        comment = {"name":name, "email":name+"@gmail.com", "website":"www."+name+".com", "time":time, "content":req.body.content}
	    } else {
	        comment = {"name":req.body.name, "email":req.body.email, "website":req.body.website, "time":time, "content":req.body.content}
	    }
	    var oneComment = new Comment(req.params.user, req.params.time, req.params.title, comment);
	    oneComment.save(function(err){
	        if(err){
	            req.flash('error', err);
	            return res.redirect('/');
	        }
	        req.flash('success', '评论成功!');
	        res.redirect('back');//这句话的作用是评论成功后返回到被评论文章
	    });
	});
	app.get('/u/:name/:day/:title', function (req, res) {
	    Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
	      if (err) {
	        req.flash('error', err);
	        return res.redirect('/');
	      }
	      res.render('article', {
	        title: req.params.title,
	        post: post,
	        user: req.session.user,
	        success: req.flash('success').toString(),
	        error: req.flash('error').toString()
	      });
	    });
	  });
	app.get('/edit/:user/:time/:title',function(req,res){
		var currentUser= req.session.user;
		Post.edit(currentUser.name,req.params.time,req.params.title,function(err,post){
			if(err){
				console.log(err);
				req.flash('error',err);
				return res.redirect('back');
			}
			res.render('edit',{
				title:'编辑',
				post:post,
				user:req.session.user,
				success:req.flash('success').toString(),
				error:req.flash('error').toString()
			});
		});
	});
	app.post('/edit/:name/:day/:title', function (req, res) {
	    var currentUser = req.session.user;
	    Post.update(currentUser.name, req.params.day, req.params.title,req.body.post, function (err) {
	      var url = encodeURI('/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
	      if (err) {
	        req.flash('error', err);
	        return res.redirect(url);//出错！返回文章页
	      }
	      req.flash('success', '修改成功!');
	      res.redirect(url);//成功！返回文章页
	    });
	  });
	app.get('/photowall',function(req,res){
		res.render('photowall',{
			title:'照片墙',
			user:req.session.user,
	        success:req.flash('success').toString(),
	        error:req.flash('error').toString()
		});
	});
	app.get('/remove/:name/:day/:title',function(req,res){
	    var currentUser = req.session.user;
		Post.remove(currentUser.name,req.params.day,req.params.title,function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('back');
			}
			req.flash('success','删除成功');
			res.redirect('/'+currentUser.name);
		});
	});
	app.get('/:user', function(req,res){
		var page=req.query.p?parseInt(req.query.p):1;
	        User.get(req.params.user, function(err, user){
	        if(!user){
	            return res.redirect('/');
	        }
	        Post.getTen(req.params.user, null,page,function(err, posts,total){
	            if(err){
	                req.flash('err',err);
	                return res.redirect('/');
	            }
	            res.render('user',{
	                title: req.params.user,
	                posts: posts,
	                page:page,
	                tags:null,
	                isFirstPage:(page-1)==0,
	            	isLastPage:((page-1)*10+posts.length) == total,
	                user: req.session.user,
	               	pagecount:total%10==0?total/10:total/10+1,
	                success: req.flash('success').toString(),
	                error: req.flash('error').toString()
	            });
	        });
	    });
	});*/
};

