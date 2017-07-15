window.onload = function() {
	var replyDoms = getElementsByClassName('reply');
	
	for(var i in replyDoms) {
		replyDoms[i].onclick = reply;
	}
}

function reply() {
	location.hash='#comment';
	var c = document.getElementById('comment');
	var i = c.getElementsByTagName('input')[0];
	i.focus();
}

function getElementsByClassName(className)
{
	var doms = document.getElementsByTagName('*');
	var res = [];
	for (var i in doms) {
		if (doms[i].className == className) {
			res.push(doms[i]);
		}
	}
	return res;
}