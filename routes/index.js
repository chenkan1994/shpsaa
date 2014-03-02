var Member = require('../models/Member.js');

exports.index = function(req, res){
	Member.findAll(function (err, docs) {
		if (err) {
			req.session.error = "something wrong!";
			return res.redirect('/');
		} else {
			if (typeof(req.session.success) != 'undefined') {
				var success = req.session.success;
				req.session.success = null;
			} else {
				var success = null;
			}
			if (typeof(req.session.error) != 'undefined') {
				var error = req.session.error;
				req.session.error = null;
			} else {
				var error = null;
			}
			res.render('index', {
				title: 'AA',
				members: docs,
				success: success,
				error: error
			});
		}
	});
};

exports.detail = function(req, res){
	Member.findOneByEmail(req.params.email, function (err, docs) {
		if (err) {
			req.session.error = "something wrong!";
			return res.redirect('/');
		} else {
			if (!docs) {
				req.session.error = "no such member!";
				return res.redirect('/');
			} else {
				if (typeof(req.session.success) != 'undefined') {
					var success = req.session.success;
					req.session.success = null;
				} else {
					var success = "";
				}
				if (typeof(req.session.error) != 'undefined') {
					var error = req.session.error;
					req.session.error = null;
				} else {
					var error = null;
				}
				res.render('detail', {
					title: "Detail",
					member: docs,
					success: success,
					error: error
				});
			}
		}
	});
};

exports.update = function(req, res){
	if (req.body.name == "") {
		req.session.error = "name must be filled!";
		return res.redirect("/");
	}
	var member = {
		email: req.params.email,
		name: req.body.name
	}
	Member.update(member, function (err) {
		if (err) {
			req.session.error = "update filed!";
			return res.redirect('/');
		} else {
			req.session.success = "update succeed!";
			return res.redirect('/');
		}
	});
};

exports.delete = function(req, res){
	Member.deleteByEmail(req.params.email, function (err, count) {
		if (err) {
			req.session.error = "delete failed!";
			return res.redirect('/');
		} else {
			req.session.succeed = "already deleted!";
			return res.redirect('/');
		}
	})
};

exports.charge = function(req, res){
	if (req.body.members.length == 0) {
		req.session.error = "no members?";
		return res.send({error: "no members"});
	}
	if (req.body.payer == "") {
		req.session.error = "no one paid the money?";
		return res.send({error: "no one paid the money"});
	}
	if (req.body.money == "") {
		req.session.error = "how much do you paid?";
		return res.send({error: "how much do you paid?"});
	}

	var members = req.body.members;
	var payer = req.body.payer;
	var money = parseInt(req.body.money);
	var minus = money/members.length;
	for (var i = members.length - 1; i >= 0; i--) {
		Member.updateBalanceByEmail(members[i], -minus, function (err) {
			if (err) {
				req.session.error = "update failed";
			}
		});
	};
	Member.updateBalanceByEmail(payer, money, function (err) {
		if (err) {
			req.session.error = "update failed";
		} else {
			req.session.succeed = "charge succeed!";
		}
	});
	return res.send({success: "success"});
};

exports.add = function(req, res){
	if (typeof(req.session.success) != 'undefined') {
		var success = req.session.success;
		req.session.success = null;
	} else {
		var success = "";
	}
	if (typeof(req.session.error) != 'undefined') {
		var error = req.session.error;
		req.session.error = null;
	} else {
		var error = null;
	}
	res.render('add', {
		title: 'Add',
		success: success,
		error: error
	});
};

exports.doAdd = function(req, res){
	var email = req.body.email.match("[a-z0-9]+");
	if (email == "" || req.body.name == "") {
		req.session.error = "something missing!";
		return res.redirect("/");
	}
	if (req.body.initial == "") {
		var initial = 0;
	} else {
		var initial = parseInt(req.body.initial);
	}
	var member = {
		email: email,
		name: req.body.name,
		balance: initial
	};

	Member.findOneByEmail(email, function (err, docs) {
		if (docs) {
			req.session.error = "this email has already been added!";
			return res.redirect('/');
		} else {
			Member.insert(member, function (err, docs) {
				if (err) {
					req.session.error = "add failed";
					return res.redirect('/');
				} else {
					req.session.succeed = "add succeed!";
					return res.redirect('/');
				}
			});
		}
	});
};

exports.email = function (req, res) {
	var nodemailer = require("nodemailer");
	var transport = nodemailer.createTransport("SMTP", {
	    host: "localhost",
	    port: 25
	});
	var mailOptions = {
	    from: "chenkan@baidu.com",
	    to: "haodahaodaya_ya@163.com",
	    subject: "Hello",
	    text: "Hello world",
	    html: "<b>Hello world</b>"
	};
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	    	res.send("wrong");
	    }else{
	    	res.send("success");
	    }

	    smtpTransport.close();
	});
}