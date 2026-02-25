<?php

if (!function_exists('sendResponse')) {
    function sendResponse($data, $status, $message = "No message")
    {
        $response = [
            'data'    => $data,
            'status' => $status,
            'message' => $message
        ];

        return response()->json($response);
    }
}
