<?php

// 留言本首页

require 'init.php';

use app\DB;
use app\Message;
use app\User;

$messages = Message::all();
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>留言本首页</title>
	<link rel="stylesheet" href="assets/css/app.css">
</head>
<body>
	<header class="navbar">
		<div class="container">
			<a href="" class="brand">留言本</a>
			<ul class="navbar-list right">
				<li><a href="">注册</a></li>
				<li><a href="">登录</a></li>
			</ul>
		</div>
	</header>

	<section class="container">
		<?php foreach ($messages as $msg): ?>
			<div class="message">
				<a href="" class="user"><?= $msg['username'] ?></a>
				<a href="javascript:void(0);" class="reply">回复</a>
				<div class="content">
					<?= $msg['message'] ?>
				</div>
			</div>
		<?php endforeach ?>

		<div id="comment">
			<h2>留言: </h2>
			<form method="post">
				<input type="text" class="form-control">
				<button class="btn">发布</button>
			</form>
		</div>
	</section>

	<footer>
		<div class="container">
			
		</div>
	</footer>

	<script src="assets/js/app.js"></script>
</body>
</html>