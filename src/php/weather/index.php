<?php

  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");

  $darkSkyAPIKey = '2520982c98d411b85414d3b1ad542409';
  $url = 'https://api.darksky.net/forecast/'.$darkSkyAPIKey;

  if (!isset($_GET['lat']) || !isset($_GET['lng'])) {
    header('Status: 400 Bad request');
    exit('{"code":400,"error":"Missing lat and lng GET parameters."}');
  } else {
    $units = isset($_GET['units']) ? $_GET['units'] : 'ca';
    $lang = isset($_GET['lang']) ? $_GET['lang'] : 'en';
    $url .= '/'.$_GET['lat'].','.$_GET['lng'].'?units='.$units.'&lang='.$lang;
  }

  $session = curl_init($url);

  curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

  $response = curl_exec($session);

  if (!$response) {
    header('Status: 400 Bad request');
    exit('{"code":404,"error":"'.curl_error($session).'"}');
  } else {
    $info = curl_getinfo($session);
    $responseCode = $info['http_code'];

    if ($responseCode !== 200) {
      header('Status: '.$responseCode);
      exit('{"code":'.$responseCode.',"response":"'.$response.'"}');
    }

    echo $response;
    curl_close($session);
  }

?>