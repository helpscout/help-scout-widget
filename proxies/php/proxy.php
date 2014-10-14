<?php
/**
 * Help Scout API Proxy for Support Widget
 *
 * A simple proxy script for use with the support widget script from
 * https://github.com/appcues/help-scout-widget
 *
 * This script should require no editing, please see the `config.php` file.
 *
 */

header('Content-Type: application/json');

if (empty($_POST)) {
    exit(0);
}

$config = require __DIR__ . '/config.php';

$url = join('/', array($config->host, $config->version, $config->resource . '.json'));

$params = array(
    'type'     => 'email',
    'customer' => $_POST['customer'],
    'subject'  => $_POST['subject'],
    'mailbox'  => array(
        'id' => intval($_POST['mailbox']['id'])
    ),
    'threads'  => $_POST['threads']
);
$paramsJson = json_encode($params);

$ch = curl_init();
curl_setopt_array($ch, array(
    CURLOPT_URL            => $url,
    CURLOPT_CUSTOMREQUEST  => 'POST',
    CURLOPT_HTTPHEADER     => array(
        'Accept: application/json',
        'Content-Type: application/json',
        'Content-Length: ' . strlen($paramsJson)
    ),
    CURLOPT_HTTPAUTH       => CURLAUTH_BASIC,
    CURLOPT_USERPWD        => $config->apiKey . ':X',
    CURLOPT_USERAGENT      => 'Mozilla/5.0 (Proxy host for appcues/help-scout-widget)',
    CURLOPT_POSTFIELDS     => $paramsJson
));
$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

header('Proxy response', true, $statusCode);
echo $response;

/* End of file proxy.php */
