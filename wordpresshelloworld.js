const fs = require ("fs");
const utils = require ("daveutils");
const wordpress = require ("wordpress");

var config = {
	siteUrl: undefined,
	username: undefined,
	password: undefined,
	};

function readConfig (f, config, callback) {
	fs.readFile (f, function (err, jsontext) {
		if (!err) {
			try {
				var jstruct = JSON.parse (jsontext);
				for (var x in jstruct) {
					config [x] = jstruct [x];
					}
				}
			catch (err) {
				console.log ("Error reading " + f);
				}
			}
		callback ();
		});
	}

function getPostInfo (client, idPost, callback) {
	client.getPost (idPost, function (err, thePost) {
		if (err) {
			callback (err);
			}
		else {
			callback (undefined, thePost);
			}
		});
	}
function newPost (client, title, content, callback) {
	const thePost = {
		title, 
		content,
		status: "publish" //omit this to create a draft that isn't published
		};
	client.newPost (thePost, function (err, idNewPost) {
		if (err) {
			callback (err);
			}
		else {
			getPostInfo (client, idNewPost, function (err, theNewPost) {
				if (err) {
					callback (err);
					}
				else {
					callback (undefined, theNewPost);
					}
				});
			}
		});
	}

readConfig ("config.json", config, function () {
	console.log ("config == " + utils.jsonStringify (config));
	
	const title = "This is a test";
	const content = "I am trying to post something to this WordPress site with a Node.js app. If you're reading this something worked. ;-)";
	
	const client = wordpress.createClient ({
		url: config.siteUrl,
		username: config.username,
		password: config.password
		});
	newPost (client, title, content, function (err, thePost) {
		if (err) {
			console.log ("newPost: err.message == " + err.message);
			}
		else {
			console.log ("newPost: thePost.link == " + thePost.link);
			}
		});
	});
