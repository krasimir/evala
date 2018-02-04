<?php

  error_reporting(E_ERROR | E_PARSE);

  header('Content-Type: application/json');

  $DB_SETTINGS = (object) array(
    'host' => 'localhost',
    'user' => 'krasimir',
    'pass' => 'admin',
    'db' => 'notara'
  );

  function error($msg) {
    header('HTTP/1.1 400: BAD REQUEST');
    exit('{"error":"'.addslashes($msg).'"}');
  }
  function success($token) {
    exit('{"token":"'.$token.'"}');
  }
  function successBuckets($token, $bucket_last_update, $num_of_buckets) {
    exit('{"token":"'.$token.'","bucket_last_update":"'.$bucket_last_update.'","num_of_buckets":'.$num_of_buckets.'}');
  }
  function getToken($username, $password) {
    return md5($username.$password.$username);
  }
  function getUser($token) {
    global $DB;
    $user = $DB->query('SELECT * FROM `users` WHERE `token` = "'.$token.'"');
    if ($user->num_rows === 0) {
      error('Wrong token provided.');
    }
    return $user->fetch_object();
  }

  function getConnection() {
    global $DB_SETTINGS;
    $conn = new mysqli($DB_SETTINGS->host, $DB_SETTINGS->user, $DB_SETTINGS->pass, $DB_SETTINGS->db);
    if ($conn->connect_errno) {
      error('Failed to connect to mysql server('.$conn->connect_errno.')'.$conn->connect_error);
    }
    return $conn;
  }

  $DB = getConnection();
  $username = FALSE;
  $email = FALSE;
  $password = FALSE;
  $token = FALSE;
  $content = FALSE;
  $part = FALSE;

  if (isset($_POST['username'])) { $username = $_POST['username']; }
  if (isset($_POST['email'])) { $email = $_POST['email']; }
  if (isset($_POST['password'])) { $password = $_POST['password']; }
  if (isset($_POST['token'])) { $token = $_POST['token']; }
  if (isset($_POST['content'])) { $content = $_POST['content']; }
  if (isset($_POST['part'])) { $part = $_POST['part']; }

  // register
  if ($username !== FALSE && $password !== FALSE && $email !== FALSE) {

    // checking if user already exist
    $exist = $DB->query('SELECT * FROM `users` WHERE `username` = "'.$username.'"');
    if ($exist->num_rows > 0) {
      error('User "'.$username.'" already exists.');
    }
    
    // creating a new user
    $token = getToken($username, $password);
    $query = 'INSERT INTO `users` (`id`, `username`, `password`, `email`, `token`) VALUES (NULL, "'.$username.'", "'.md5($password).'", "'.$email.'", "'.$token.'")';
    $DB->query($query);
    if ($DB->error) {
      error('Registration failed!');
    }
    success($token);

  // login
  } else if ($username !== FALSE && $password !== FALSE) {
    $user = $DB->query('SELECT * FROM `users` WHERE `username` = "'.$username.'" AND `password` = "'.md5($password).'"');
    if ($user->num_rows === 0) {
      error('Wrong username or password.');
    }
    $user = $user->fetch_object();
    success($user->token);

  // adding/updating buckets
  } else if ($token !== FALSE && $content !== false && $part !== FALSE) {
    $user = getUser($token);
    $bucket = $DB->query('SELECT * FROM `buckets` WHERE `user_id` = "'.$user->id.'" AND `part` = "'.$part.'"');
    if ($bucket->num_rows === 0) {
      $DB->query('INSERT INTO `buckets` (`id`, `user_id`, `content`, `part`) VALUES (NULL, "'.$user->id.'", "'.$content.'", "'.$part.'")');
    } else {
      $DB->query('UPDATE `buckets` SET `content` = "'.$content.'" WHERE `user_id` = "'.$user->id.'" AND `part` = "'.$part.'"');
    }

    $allBuckets = $DB->query('SELECT * FROM `buckets` WHERE `user_id` = "'.$user->id.'"');
    $lastUpdate = 


    success($token);

  // get buckets meta by token
  } else if ($token !== FALSE) {
    $user = getUser($token);
    successBuckets($user->token, $user->bucket_last_update, $user->num_of_buckets);
  }

  // wrong attempt
  error('Sorry!');

?>